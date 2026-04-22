#!/usr/bin/env python3
"""
build_hunddagis_dataset.py

Builds a CSV dataset of Swedish dog daycares and boarding facilities.
Target: 500-800 unique, active business entries.

Output files (written to data/):
  data/hunddagis_sverige_master.csv  — deduplicated final dataset
  data/raw_results.csv               — all collected results (including dupes)
  data/progress.json                 — checkpoint for resuming
  data/build.log                     — full log

Config files (read from config/):
  config/sweden_city_county_map.json — city → county lookup
  config/seed_locations.json         — priority-ordered cities to search first

Usage:
  python build_hunddagis_dataset.py

Environment variables (see .env.example):
  SERPAPI_KEY — required for Google Maps searches via SerpApi
"""

import argparse
import os
import csv
import json
import re
import time
import logging
import random
import sys
from pathlib import Path
from urllib.parse import urlparse, urljoin
from typing import Optional

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Bootstrap
# ---------------------------------------------------------------------------

load_dotenv()

BASE_DIR   = Path(__file__).parent
DATA_DIR   = BASE_DIR / "data"
CONFIG_DIR = BASE_DIR / "config"

# Ensure output directory exists at startup
DATA_DIR.mkdir(exist_ok=True)

MASTER_CSV    = DATA_DIR   / "hunddagis_sverige_master.csv"
RAW_CSV       = DATA_DIR   / "raw_results.csv"
PROGRESS_FILE = DATA_DIR   / "progress.json"
LOG_FILE      = DATA_DIR   / "build.log"
CITY_MAP_FILE = CONFIG_DIR / "sweden_city_county_map.json"
SEED_FILE     = CONFIG_DIR / "seed_locations.json"

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")

TARGET_COUNT   = 500      # stop adding when master CSV reaches this
MAX_COUNT      = 800      # hard ceiling
MIN_PER_REGION = 5        # if a city yields < this, still move on

# Core search terms (default) — best credit ROI for Swedish businesses.
# "dog daycare" / "dog boarding" rarely surface businesses that the
# Swedish terms don't already find, so they're reserved for --all-terms.
SEARCH_TERMS_SE = [
    "hunddagis",
    "hundpensionat",
    "hundhotell",
]

SEARCH_TERMS_NO = [
    "hundepass",
    "hundepensjonat",    # correct Norwegian spelling (pensjonat, not pensionat)
    "hundebarnehage",    # dog daycare — specific, won't match generic hotels
]

SEARCH_TERMS_DK = [
    "hundepasning",
    "hundepension",
    "hundehotel",        # Danish spelling is correct with single-l
]

# Kennels — Swedish
SEARCH_TERMS_KENNELS_SE = [
    "kennel",
    "avel",
    "hundavel",
    "hunduppfödning",
    "hundparning",
    "parning hund",
]

# Kennels — Norwegian
SEARCH_TERMS_KENNELS_NO = [
    "kennel",
    "oppdrett",
    "hundeoppdrett",
    "oppdretter",
    "avl hund",
]

# Kennels — Danish
SEARCH_TERMS_KENNELS_DK = [
    "kennel",
    "opdræt",
    "hundeopdræt",
    "opdrætter",
    "avl hund",
]

# Back-compat alias (SE default)
SEARCH_TERMS_KENNELS = SEARCH_TERMS_KENNELS_SE

# Extended set — used with --all-terms flag (~2× credit cost, ~15% more yield)
SEARCH_TERMS_EXTENDED = SEARCH_TERMS_SE + [
    "hunddaghem",
    "dog daycare",
    "dog boarding",
]

# Rate-limiting (seconds)
REQ_DELAY_MIN  = 1.5
REQ_DELAY_MAX  = 3.5
SCRAPE_DELAY_MIN = 0.8
SCRAPE_DELAY_MAX = 2.5
RETRY_WAIT     = 12.0
MAX_RETRIES    = 3
REQUEST_TIMEOUT = 12   # seconds per HTTP request

# Columns for master CSV
CSV_COLUMNS = ["namn", "stad", "lan", "email", "hemsida", "facebook", "kalla"]

# Extra columns only written to raw CSV
RAW_EXTRA_COLUMNS = ["raw_address", "phone", "raw_source"]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7",
}

# Default cities for --test mode
TEST_CITIES = [
    "Västerås", "Uppsala", "Örebro", "Linköping", "Helsingborg",
]

# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Build a CSV dataset of Swedish dog daycares and boarding facilities.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Credit budget guide (1 credit = 1 SerpApi call):
  --test --pages 1          5 cities × 3 terms × 1 page  =   15 credits
  --test                    5 cities × 3 terms × 2 pages =   30 credits
  default (100 seed cities) 100      × 3 terms × 2 pages =  600 credits
  --all-terms               100      × 6 terms × 2 pages = 1200 credits
  --pages 1 (100 cities)    100      × 3 terms × 1 page  =  300 credits

Examples:
  # Zero API cost — just shows output format:
  python build_hunddagis_dataset.py --demo

  # Cheapest real test (15 credits):
  python build_hunddagis_dataset.py --test --pages 1 --no-scrape

  # Standard test (30 credits):
  python build_hunddagis_dataset.py --test --no-scrape

  # Full Sweden, credit-efficient (600 credits):
  python build_hunddagis_dataset.py

  # Full Sweden, maximum coverage (1200 credits):
  python build_hunddagis_dataset.py --all-terms --pages 3
""",
    )
    p.add_argument(
        "--test",
        action="store_true",
        help=f"Run on 5 test cities only: {', '.join(TEST_CITIES)}",
    )
    p.add_argument(
        "--cities",
        metavar="CITY1,CITY2,...",
        help="Comma-separated list of cities to search (overrides seed order)",
    )
    p.add_argument(
        "--pages",
        type=int,
        default=None,       # None means: auto (1 for --test, 2 otherwise)
        metavar="N",
        choices=[1, 2, 3],
        help="SerpApi result pages per query (1–3). Default: 1 for --test, 2 otherwise.",
    )
    p.add_argument(
        "--all-terms",
        action="store_true",
        dest="all_terms",
        help=(
            "Use all 6 search terms instead of the default 3 "
            "(hunddagis, hundpensionat, hundhotell). "
            "Adds ~15%% more yield at ~2× credit cost."
        ),
    )
    p.add_argument(
        "--limit",
        type=int,
        default=MAX_COUNT,
        metavar="N",
        help=f"Stop after collecting N entries (default: {MAX_COUNT})",
    )
    p.add_argument(
        "--no-scrape",
        action="store_true",
        dest="no_scrape",
        help="Skip website scraping for email/Facebook (faster, saves time)",
    )
    p.add_argument(
        "--country",
        choices=["se", "no", "dk"],
        default="se",
        help="Country: se (Sweden, default), no (Norway), dk (Denmark)",
    )
    p.add_argument(
        "--category",
        choices=["dagis", "kennels"],
        default="dagis",
        help="Category: dagis (daycare/boarding, default), kennels (breeding/kennels)",
    )
    p.add_argument(
        "--demo",
        action="store_true",
        help="Print 15 sample rows and write data/demo_output.csv, then exit (no API calls)",
    )
    return p.parse_args()


# ---------------------------------------------------------------------------
# Demo / sample output
# ---------------------------------------------------------------------------

_DEMO_ROWS = [
    ("Hunddagis Rumpansen",         "Västerås",    "Västmanlands län",   "info@rumpansen.se",             "https://rumpansen.se",                "",                                         "google_maps"),
    ("Fyrbenta Vänner AB",          "Västerås",    "Västmanlands län",   "hej@fyrbentavannervas.se",      "https://fyrbentavannervas.se",         "https://www.facebook.com/fyrbentavannervas","google_maps"),
    ("Ludde & Co Hundpensionat",    "Uppsala",     "Uppsala län",        "kontakt@luddeco.se",            "https://luddeco.se",                  "",                                         "google_maps"),
    ("Uppsala Hunddagis",           "Uppsala",     "Uppsala län",        "",                              "https://uppsalahdagis.se",            "https://www.facebook.com/uppsaladagis",    "google_maps"),
    ("Vovvehotellet",               "Uppsala",     "Uppsala län",        "vovve@vovvehotellet.se",        "https://vovvehotellet.se",            "",                                         "google_maps"),
    ("Hundgården Örebro",           "Örebro",      "Örebro län",        "info@hundgarden.se",            "https://hundgarden.se",               "",                                         "google_maps"),
    ("Tassar & Nos AB",             "Örebro",      "Örebro län",        "hej@tassarochnas.se",           "https://tassarochnas.se",             "https://www.facebook.com/tassarochnas",    "google_maps"),
    ("Happy Paws Hundhotell",       "Örebro",      "Örebro län",        "",                              "https://happypaws.se",                "",                                         "directory"),
    ("Linköpings Hunddagis",        "Linköping",   "Östergötlands län",  "info@lkpgdagis.se",             "https://lkpgdagis.se",                "",                                         "google_maps"),
    ("Mångkulle Hundpensionat",     "Linköping",   "Östergötlands län",  "kontakt@mangkulle.se",          "https://mangkulle.se",                "https://www.facebook.com/mangkulle",       "google_maps"),
    ("Frasse på Landet",            "Linköping",   "Östergötlands län",  "frasse@frassepalandet.se",      "https://frassepalandet.se",           "",                                         "google_maps"),
    ("Hunddagis Solrosen",          "Helsingborg", "Skåne län",          "info@solrosen-hund.se",         "https://solrosen-hund.se",            "https://www.facebook.com/solrosenhund",    "google_maps"),
    ("Hundhotellet Helsingborg",    "Helsingborg", "Skåne län",          "",                              "https://hundhotellethelsingborg.se",  "",                                         "google_maps"),
    ("Norrporten Hundpensionat",    "Helsingborg", "Skåne län",          "norrporten@hund.se",            "https://norrportenhund.se",           "",                                         "directory"),
    ("Lekparken för Hundar",        "Helsingborg", "Skåne län",          "hej@lekparken.se",              "https://lekparken.se",                "https://www.facebook.com/lekparken",       "google_maps"),
]


def run_demo() -> None:
    """Print sample output rows and write to data/demo_output.csv."""
    DEMO_CSV = DATA_DIR / "demo_output.csv"
    DATA_DIR.mkdir(exist_ok=True)

    # Terminal table
    col_w = [34, 13, 22, 32, 38, 42, 12]
    header = ["namn", "stad", "lan", "email", "hemsida", "facebook", "kalla"]
    sep = "+" + "+".join("-" * (w + 2) for w in col_w) + "+"

    def row_fmt(cells):
        return "| " + " | ".join(str(c)[:w].ljust(w) for c, w in zip(cells, col_w)) + " |"

    print()
    print("  DEMO OUTPUT — sample rows (format preview, not real data)")
    print(sep)
    print(row_fmt(header))
    print(sep)
    for r in _DEMO_ROWS:
        print(row_fmt(r))
    print(sep)
    print(f"  {len(_DEMO_ROWS)} rows shown\n")

    # Write demo CSV
    with open(DEMO_CSV, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(_DEMO_ROWS)

    print(f"  Demo CSV written to: {DEMO_CSV}")
    print()
    print("  To run a real test on 5 cities:")
    print("    python build_hunddagis_dataset.py --test --no-scrape")
    print()
    print("  To run on specific cities:")
    print('    python build_hunddagis_dataset.py --cities "Västerås,Uppsala,Örebro"')
    print()
    print("  To run the full Sweden dataset:")
    print("    python build_hunddagis_dataset.py")
    print()


# ---------------------------------------------------------------------------
# Credit estimator
# ---------------------------------------------------------------------------

def estimate_credits(num_cities: int, num_terms: int, pages: int) -> dict:
    """Return a dict with credit estimates for a planned run."""
    serpapi = num_cities * num_terms * pages
    return {
        "cities":   num_cities,
        "terms":    num_terms,
        "pages":    pages,
        "serpapi":  serpapi,
        "free_ok":  serpapi <= 100,
    }


def print_credit_estimate(num_cities: int, num_terms: int, pages: int) -> None:
    est = estimate_credits(num_cities, num_terms, pages)
    logger.info("-" * 60)
    logger.info("  Credit estimate (SerpApi):")
    logger.info(f"    {num_cities} cities × {num_terms} terms × {pages} pages = {est['serpapi']} credits")
    if est["free_ok"]:
        logger.info("    OK  Fits within the free plan (100 credits/month)")
    elif est["serpapi"] <= 500:
        logger.info("    ⚡ ~$5 on a pay-per-use plan or fits Starter ($50/5 000 credits)")
    elif est["serpapi"] <= 5000:
        logger.info("    --> Requires Starter plan ($50/mo = 5 000 credits)")
    else:
        logger.info("    --> Requires Production plan ($130/mo = 15 000 credits)")
    logger.info("-" * 60)


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

# Force stdout to UTF-8 on Windows so Swedish chars and symbols print correctly.
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Helpers: rate limiting & retries
# ---------------------------------------------------------------------------

def jitter_sleep(min_s: float = REQ_DELAY_MIN, max_s: float = REQ_DELAY_MAX) -> None:
    """Sleep for a random duration to avoid hammering servers."""
    time.sleep(random.uniform(min_s, max_s))


def fetch_url(url: str, timeout: int = REQUEST_TIMEOUT, retries: int = MAX_RETRIES) -> Optional[requests.Response]:
    """
    GET a URL with retry logic and exponential backoff.
    Returns the Response object on success, None on failure.
    """
    for attempt in range(1, retries + 1):
        try:
            resp = requests.get(
                url,
                headers=HEADERS,
                timeout=timeout,
                allow_redirects=True,
            )
            if resp.status_code == 200:
                return resp
            elif resp.status_code in (429, 503):
                wait = RETRY_WAIT * attempt
                logger.warning(f"Rate limited ({resp.status_code}) on {url}, waiting {wait}s")
                time.sleep(wait)
            elif resp.status_code in (403, 404, 410):
                logger.debug(f"HTTP {resp.status_code}: {url}")
                return None
            else:
                logger.debug(f"HTTP {resp.status_code}: {url}")
        except requests.exceptions.Timeout:
            logger.debug(f"Timeout (attempt {attempt}): {url}")
        except requests.exceptions.ConnectionError:
            logger.debug(f"Connection error (attempt {attempt}): {url}")
        except requests.exceptions.TooManyRedirects:
            logger.debug(f"Too many redirects: {url}")
            return None
        except Exception as e:
            logger.debug(f"Error fetching {url}: {e}")

        if attempt < retries:
            time.sleep(RETRY_WAIT * attempt)

    return None

# ---------------------------------------------------------------------------
# Helpers: email & Facebook extraction
# ---------------------------------------------------------------------------

# Matches most valid email addresses; conservative to avoid image filenames etc.
_EMAIL_RE = re.compile(
    r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b'
)

_INVALID_EMAIL_EXTENSIONS = (
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp",
    ".css", ".js", ".woff", ".ttf",
)

_INVALID_EMAIL_DOMAINS = (
    "sentry.io", "example.com", "test.com", "yoursite.com",
    "yourdomain.com", "domain.com", "email.com",
    "googletagmanager.com", "google-analytics.com",
)


def is_valid_email(email: str) -> bool:
    """Return True if the string looks like a real contact email."""
    if not email or "@" not in email:
        return False
    email = email.lower()
    for ext in _INVALID_EMAIL_EXTENSIONS:
        if email.endswith(ext):
            return False
    parts = email.split("@")
    if len(parts) != 2:
        return False
    local, domain = parts
    if "." not in domain or len(local) < 1:
        return False
    for bad in _INVALID_EMAIL_DOMAINS:
        if bad in domain:
            return False
    # Reject obvious placeholder patterns
    if local in ("info", "noreply", "no-reply", "donotreply", "webmaster"):
        # These are generic but often valid — keep them
        pass
    return True


def extract_email_from_html(html: str) -> Optional[str]:
    """
    Try to extract a contact email from HTML.
    Priority: mailto links → obfuscation patterns → regex on visible text.
    """
    soup = BeautifulSoup(html, "html.parser")

    # 1. mailto: links
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.lower().startswith("mailto:"):
            candidate = href[7:].split("?")[0].strip()
            if is_valid_email(candidate):
                return candidate.lower()

    # 2. regex on visible text (handles obfuscation like "info [at] example.se")
    text = soup.get_text(" ", strip=True)
    # Normalize common obfuscation
    text_normalized = (
        text
        .replace(" [at] ", "@")
        .replace(" AT ", "@")
        .replace(" (at) ", "@")
        .replace(" [dot] ", ".")
        .replace(" DOT ", ".")
    )
    matches = _EMAIL_RE.findall(text_normalized)
    for m in matches:
        if is_valid_email(m):
            return m.lower()

    return None


def extract_facebook_from_html(html: str) -> Optional[str]:
    """
    Extract a Facebook page URL from HTML.
    Returns the canonical URL (no query string), or None.
    """
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        # Must contain facebook.com/ and look like a page path
        if "facebook.com/" not in href.lower():
            continue
        # Skip generic share/sharer links and the root domain
        skip_patterns = [
            "facebook.com/sharer",
            "facebook.com/share",
            "facebook.com/dialog",
            "facebook.com/login",
            "facebook.com/groups",  # groups ≠ business page
        ]
        if any(p in href.lower() for p in skip_patterns):
            continue
        # Remove query params and trailing slashes
        clean = href.split("?")[0].rstrip("/")
        # Must have a path component beyond just the domain
        parsed = urlparse(clean)
        if len(parsed.path.strip("/")) < 2:
            continue
        return clean

    return None


# ---------------------------------------------------------------------------
# City extraction helpers (part of the enrich step)
# ---------------------------------------------------------------------------

# Swedish postcode: 5 digits optionally split by space, then the city name.
# Captures the city in group 1.
_POSTCODE_CITY_RE = re.compile(
    r'\b\d{3}\s?\d{2}\s+([A-Za-zÅÄÖåäöÉéÜüÆæØø][A-Za-zÅÄÖåäöÉéÜüÆæØø\s\-]{1,39}?)(?:\s*,|\s*$)'
)


def extract_city_from_address(address: str) -> Optional[str]:
    """
    Parse a city name from a Swedish address string returned by Maps.
    Typical formats:
      "Kungsgatan 10, 411 26 Göteborg, Sverige"
      "Svängstigen 5, 123 45 Exempelstad"
      "Hunddagisgatan 3, Lidingö"
    Returns a title-cased city string, or None if extraction fails.
    """
    if not address:
        return None

    # Strip trailing Sverige / Sweden
    clean = re.sub(r',?\s*(Sverige|Sweden)\s*$', '', address, flags=re.I).strip()

    # Try postcode pattern first
    match = _POSTCODE_CITY_RE.search(clean)
    if match:
        city = match.group(1).strip().rstrip(',').strip()
        if 2 <= len(city) <= 40:
            return city.title()

    # Fallback: last comma-segment with no digits
    parts = [p.strip() for p in clean.split(',')]
    for part in reversed(parts):
        if part and not re.search(r'\d', part) and 2 <= len(part) <= 40:
            return part.strip().title()

    return None


def extract_city_from_website(html: str) -> Optional[str]:
    """
    Try to extract city name from website HTML.
    Priority:
      1. schema.org itemprop="addressLocality"
      2. JSON-LD @type LocalBusiness / PostalAddress
      3. Swedish postcode regex on visible text (footer / contact area)
    Returns city string or None.
    """
    soup = BeautifulSoup(html, "html.parser")

    # 1. Microdata itemprop
    el = soup.find(attrs={"itemprop": "addressLocality"})
    if el:
        city = el.get_text(strip=True)
        if 2 <= len(city) <= 40:
            return city.title()

    # 2. JSON-LD
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or "")
            items = [data] if isinstance(data, dict) else (data if isinstance(data, list) else [])
            for item in items:
                addr = item.get("address") or {}
                # address can itself be a nested dict
                if isinstance(addr, dict):
                    city = addr.get("addressLocality", "")
                    if city and 2 <= len(city) <= 40:
                        return str(city).title()
        except Exception:
            continue

    # 3. Postcode regex on visible text — prefer footer / address sections
    candidate_sections = soup.find_all(
        attrs={"class": re.compile(r"footer|address|kontakt|contact", re.I)}
    )
    text_sources = [s.get_text(" ", strip=True) for s in candidate_sections]
    # Also search full text as last resort
    text_sources.append(soup.get_text(" ", strip=True))

    for text in text_sources:
        match = _POSTCODE_CITY_RE.search(text)
        if match:
            city = match.group(1).strip()
            if 2 <= len(city) <= 40:
                return city.title()

    return None


def find_contact_page_urls(html: str, base_url: str) -> list[str]:
    """
    Find candidate contact/about page URLs within the same site.
    Returns up to 5 unique URLs to try (ordered by relevance).
    """
    soup = BeautifulSoup(html, "html.parser")
    # Higher-priority keywords first so the most likely pages are tried first
    keywords = [
        "kontakt", "contact",
        "om-oss", "om oss", "about", "about-us",
        "uppfödare", "om kennel", "om avel",
        "nå oss", "hitta oss", "reach",
        "info",
    ]
    found = []
    base_domain = urlparse(base_url).netloc

    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        text = a.get_text(strip=True).lower()

        is_contact_link = any(kw in href.lower() or kw in text for kw in keywords)
        if not is_contact_link:
            continue

        # Build absolute URL
        if href.startswith("http"):
            abs_url = href
        elif href.startswith("/"):
            abs_url = f"{urlparse(base_url).scheme}://{base_domain}{href}"
        elif href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        else:
            abs_url = urljoin(base_url, href)

        # Stay on same domain
        if urlparse(abs_url).netloc != base_domain:
            continue

        if abs_url not in found and abs_url.rstrip("/") != base_url.rstrip("/"):
            found.append(abs_url)

        if len(found) >= 5:
            break

    return found


def scrape_facebook_about(fb_url: str) -> Optional[str]:
    """
    Try to extract an email from the Facebook page's About section.
    Fetches <fb_url>/about with browser-like headers.
    Returns email string or None.
    """
    if not fb_url:
        return None

    about_url = fb_url.rstrip("/") + "/about"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8",
    }
    try:
        resp = requests.get(about_url, headers=headers, timeout=REQUEST_TIMEOUT, allow_redirects=True)
        if resp.status_code != 200:
            return None
        return extract_email_from_html(resp.text)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Website scraping: email + Facebook
# ---------------------------------------------------------------------------

def scrape_website(url: str) -> dict:
    """
    Fetch website and extract email, Facebook URL, and inferred city.
    Falls back to contact/about sub-pages when no email is found on the homepage.

    Returns dict with keys:
      email          — contact email or None
      facebook       — Facebook page URL or None
      inferred_city  — city parsed from schema.org / postcode in page, or None
      final_url      — URL after redirects
    """
    result: dict = {
        "email": None,
        "facebook": None,
        "inferred_city": None,
        "final_url": url,
    }

    if not url:
        return result

    resp = fetch_url(url)
    if resp is None:
        return result

    result["final_url"] = resp.url
    html = resp.text

    result["email"]         = extract_email_from_html(html)
    result["facebook"]      = extract_facebook_from_html(html)
    result["inferred_city"] = extract_city_from_website(html)

    # If no email yet, try contact/about sub-pages (up to 5)
    if not result["email"]:
        contact_urls = find_contact_page_urls(html, resp.url)
        for contact_url in contact_urls:
            jitter_sleep(SCRAPE_DELAY_MIN, SCRAPE_DELAY_MAX)
            sub_resp = fetch_url(contact_url)
            if sub_resp is None:
                continue
            sub_html = sub_resp.text
            email = extract_email_from_html(sub_html)
            if email:
                result["email"] = email
            if not result["facebook"]:
                result["facebook"] = extract_facebook_from_html(sub_html)
            if not result["inferred_city"]:
                result["inferred_city"] = extract_city_from_website(sub_html)
            if result["email"] and result["facebook"]:
                break

    # Last resort: try Facebook About page if we have a Facebook URL but no email
    if not result["email"] and result["facebook"]:
        jitter_sleep(SCRAPE_DELAY_MIN, SCRAPE_DELAY_MAX)
        fb_email = scrape_facebook_about(result["facebook"])
        if fb_email:
            result["email"] = fb_email
            logger.debug(f"  Found email via Facebook About: {fb_email}")

    return result


# ---------------------------------------------------------------------------
# Google Maps search via SerpApi
# ---------------------------------------------------------------------------

def serpapi_available() -> bool:
    if not SERPAPI_KEY:
        return False
    try:
        from serpapi import GoogleSearch  # noqa: F401
        return True
    except ImportError:
        return False


def search_google_maps(query: str, num_pages: int = 2) -> list[dict]:
    """
    Search Google Maps via SerpApi.
    Returns a list of raw local_results dicts from the API.
    Fetches up to num_pages of results.
    """
    if not serpapi_available():
        logger.warning("SerpApi unavailable — skipping Google Maps search")
        return []

    from serpapi import GoogleSearch

    all_results: list[dict] = []
    next_token = None

    for page in range(num_pages):
        params = {
            "engine": "google_maps",
            "q": query,
            "type": "search",
            "api_key": SERPAPI_KEY,
            "hl": "sv",
            "gl": "se",
        }
        if next_token:
            params["next_page_token"] = next_token

        try:
            search = GoogleSearch(params)
            data = search.get_dict()
        except Exception as e:
            logger.error(f"SerpApi error for '{query}': {e}")
            break

        # Detect quota exhaustion — SerpApi returns an "error" key
        if "error" in data:
            err_msg = data["error"]
            if any(kw in err_msg.lower() for kw in ["credit", "quota", "plan", "limit", "run out", "exhausted"]):
                logger.error(f"⛔ SerpApi quota exhausted: {err_msg}")
                logger.error("   Pausing all SerpApi calls. Resume when quota resets.")
                # Disable further SerpApi calls for this run
                import os; os.environ["SERPAPI_KEY"] = ""
            else:
                logger.error(f"SerpApi error for '{query}': {err_msg}")
            break

        local_results = data.get("local_results", [])
        if not local_results:
            break

        all_results.extend(local_results)
        logger.debug(f"  Page {page + 1}: {len(local_results)} results for '{query}'")

        next_token = data.get("serpapi_pagination", {}).get("next_page_token")
        if not next_token:
            break

        jitter_sleep()

    return all_results


# ---------------------------------------------------------------------------
# hitta.se directory scraping (secondary source, no API key needed)
# ---------------------------------------------------------------------------

def search_hitta(query: str, location: str) -> list[dict]:
    """
    Scrape hitta.se for Swedish businesses.
    Returns a list of partial entry dicts.
    """
    # URL pattern: https://www.hitta.se/sök?vad=hunddagis&var=Stockholm
    search_url = f"https://www.hitta.se/s%C3%B6k?vad={requests.utils.quote(query)}&var={requests.utils.quote(location)}"
    results = []

    jitter_sleep(SCRAPE_DELAY_MIN, SCRAPE_DELAY_MAX)
    resp = fetch_url(search_url)
    if resp is None:
        return results

    soup = BeautifulSoup(resp.text, "html.parser")

    # hitta.se result cards — selectors may need updating if their HTML changes
    # They typically have article or div elements with company info
    cards = soup.select("article.search-result") or soup.select("div.company-card") or []

    # Fallback: try to find any structured results
    if not cards:
        cards = soup.find_all("article") or []

    for card in cards:
        name_el = card.find(class_=re.compile(r"name|company|title", re.I))
        if not name_el:
            name_el = card.find(["h2", "h3"])
        if not name_el:
            continue

        name = name_el.get_text(strip=True)
        if not name or len(name) < 3:
            continue

        # Try to get website link
        website = ""
        for a in card.find_all("a", href=True):
            href = a["href"]
            if href.startswith("http") and "hitta.se" not in href:
                website = href.split("?")[0].rstrip("/")
                break

        results.append({
            "namn": name,
            "stad": location,
            "hemsida": website,
            "kalla": "directory",
        })

    logger.debug(f"  hitta.se '{query}' in {location}: {len(results)} results")
    return results


# ---------------------------------------------------------------------------
# Result parsing and filtering
# ---------------------------------------------------------------------------

_DOG_KEYWORDS = [
    "hund", "dog", "kennel", "valp", "dagis", "pensionat",
    "daghem", "hotell", "boarding", "daycare",
]

_EXCLUDE_NAMES = [
    "blocket", "marketplace", "annons", "facebook.com/groups",
    "hitta.se", "gulasidorna", "kijiji", "craigslist",
]

# Words in the business NAME that reliably indicate a kennel/breeding operation.
_KENNEL_NAME_KEYWORDS = [
    "kennel",       # kennel, kennels, kennelklubb, etc.
    "avel",         # avel, avlshund, avlskennel
    "uppfödning",
    "uppfödare",
    "valpkull",
    # Norwegian
    "oppdrett",
    "oppdretter",
    "avlshund",
    # Danish
    "opdræt",
    "opdrætter",
]

# Words in the business NAME that indicate a dog daycare/boarding business.
# Requiring one of these in the name filters out regular hotels, gyms, restaurants
# etc. that appear in "hundehotel" searches because they accept dogs.
_DAGIS_NAME_KEYWORDS = [
    # Swedish
    "hund", "dog",
    "dagis", "daghem",
    "pensionat", "hundhotell",
    "boarding",
    # Norwegian
    "hunde", "hundes",
    "hundepensjonat", "hundepension",
    "hundebarnehage", "hundedagbarnehage", "hundepass",
    "hundeklubb", "hundesenter", "hundehotell",
    # Danish
    "hundepasning", "hundepension",
    "hundeklub",
]


def looks_like_dog_business(result: dict, category: str = "dagis") -> bool:
    """
    Heuristic: does this result look like the right type of dog business?

    For both categories we check the NAME field — it's the most reliable signal.
    Description/type fields are checked only as a secondary fallback to ensure
    at least one dog keyword is present somewhere.
    """
    combined = " ".join([
        result.get("title", ""),
        result.get("type", ""),
        result.get("description", ""),
        result.get("namn", ""),
    ]).lower()

    if not any(kw in combined for kw in _DOG_KEYWORDS):
        return False
    if any(bad in combined for bad in _EXCLUDE_NAMES):
        return False

    name = (result.get("title") or result.get("namn") or "").lower()

    if category == "kennels":
        if not any(kw in name for kw in _KENNEL_NAME_KEYWORDS):
            return False
    else:
        # dagis: require a dog/daycare word in the name to block generic hotels etc.
        if not any(kw in name for kw in _DAGIS_NAME_KEYWORDS):
            return False

    return True


def parse_serpapi_result(raw: dict, search_city: str, county: str) -> Optional[dict]:
    """
    Convert a raw SerpApi local result into our entry format.

    City resolution order:
      1. Parsed from Maps 'address' field  (most accurate)
      2. search_city                        (the query city, always available)

    Sets '_has_address' flag so that process_entry knows not to override
    stad with a website-inferred city.
    """
    name = raw.get("title", "").strip()
    if not name:
        return None

    website = raw.get("website", "")
    if website:
        website = website.split("?")[0].rstrip("/")

    raw_address = raw.get("address", "")
    maps_city   = extract_city_from_address(raw_address)
    stad        = maps_city or search_city

    return {
        "namn":          name,
        "stad":          stad,
        "lan":           county,
        "email":         "",
        "hemsida":       website,
        "facebook":      "",
        "kalla":         "google_maps",
        # raw extras (not in master CSV)
        "raw_address":   raw_address,
        "phone":         raw.get("phone", ""),
        "raw_source":    "serpapi_google_maps",
        # internal flag: True means stad came from Maps address, skip website override
        "_has_address":  bool(maps_city),
        "_search_city":  search_city,
    }


# ---------------------------------------------------------------------------
# Progress persistence
# ---------------------------------------------------------------------------

def load_progress(pfile: Path = PROGRESS_FILE) -> dict:
    if pfile.exists():
        try:
            with open(pfile, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            logger.warning(f"Could not load {pfile.name} — starting fresh")
    return {"completed": [], "total_found": 0}


def save_progress(completed: set, total: int, pfile: Path = PROGRESS_FILE) -> None:
    data = {"completed": sorted(completed), "total_found": total}
    with open(pfile, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# Deduplication helpers
# ---------------------------------------------------------------------------

# Legal entity suffixes that should be stripped for secondary dedup matching.
# The primary key keeps them; the secondary key strips them so that
# "Hunddagis Fluffy AB" and "Hunddagis Fluffy" in the same city are caught.
_LEGAL_SUFFIX_RE = re.compile(
    r'\s+(ab|hb|kb|ek\.?\s*f\.?|ekonomisk\s+förening|ideell\s+förening|enskild\s+firma|ef)\s*$',
    re.IGNORECASE,
)
_WS_RE = re.compile(r'\s+')


def normalize_name(name: str) -> str:
    """
    Normalise a business name for dedup:
    - strip leading/trailing whitespace
    - collapse internal whitespace to single space
    - lowercase
    - remove legal entity suffixes (AB, HB, KB, EF, …)
    """
    name = _WS_RE.sub(' ', name).strip().lower()
    name = _LEGAL_SUFFIX_RE.sub('', name).strip()
    return name


def _dedup_key(name: str, city: str) -> str:
    """Primary dedup key — normalised name + city."""
    return f"{normalize_name(name)}|{city.strip().lower()}"


def _dedup_key_bare(name: str, city: str) -> str:
    """
    Secondary dedup key — also strips common dog-business type words
    from the front of the name so that, e.g.,
    "Hunddagis Fluffy"  and  "Fluffy Hunddagis"  match the same bare key.
    """
    n = normalize_name(name)
    # Remove leading type prefixes
    n = re.sub(
        r'^(hund(?:dagis|pensionat|daghem|hotell)?|dog\s+(?:daycare|boarding|hotel|pension)?)\s+',
        '', n,
    ).strip()
    return f"{n}|{city.strip().lower()}"


# ---------------------------------------------------------------------------
# CSV management
# ---------------------------------------------------------------------------

def load_existing_entries(mcsv: Path = MASTER_CSV) -> tuple[dict[str, dict], set[str]]:
    """
    Load master CSV into two dicts:
      - primary_keys  : _dedup_key(name, city) → row
      - secondary_keys: _dedup_key_bare(name, city) set (for secondary check)
    Returns (primary_keys, secondary_keys_set).
    """
    primary: dict[str, dict] = {}
    secondary: set[str] = set()
    if not mcsv.exists():
        return primary, secondary
    try:
        with open(mcsv, "r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                n = row.get("namn", "")
                c = row.get("stad", "")
                primary[_dedup_key(n, c)]    = row
                secondary.add(_dedup_key_bare(n, c))
    except Exception as e:
        logger.warning(f"Could not load existing master CSV: {e}")
    return primary, secondary


# ---------------------------------------------------------------------------
# City/county map and seed locations
# ---------------------------------------------------------------------------

def load_city_map() -> dict[str, str]:
    """Load city → county lookup from config/sweden_city_county_map.json."""
    try:
        with open(CITY_MAP_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Could not load city map ({CITY_MAP_FILE}): {e}")
        sys.exit(1)


def load_seed_locations(country: str = "se") -> list[dict]:
    """
    Load the prioritised seed list for the given country.
    Looks for config/{country}_cities.json (or config/seed_locations.json for Sweden).
    Returns a list of dicts with at least 'city' and 'county'/'region'.
    Falls back to empty list if file is missing.
    """
    if country == "se":
        seed_file = CONFIG_DIR / "seed_locations.json"
    elif country == "no":
        seed_file = CONFIG_DIR / "norway_cities.json"
    elif country == "dk":
        seed_file = CONFIG_DIR / "denmark_cities.json"
    else:
        seed_file = SEED_FILE
    
    if not seed_file.exists():
        logger.warning(f"Seed file not found: {seed_file} — will use empty list")
        return []
    try:
        with open(seed_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        locations = data.get("locations", [])
        logger.info(f"Loaded {len(locations)} seed locations from {seed_file.name}")
        return locations
    except Exception as e:
        logger.warning(f"Could not load seed locations: {e}")
        return []


def build_city_order(city_map: dict[str, str], seeds: list[dict]) -> list[tuple[str, str]]:
    """
    Return an ordered list of (city, county) pairs:
      1. Seed cities first (in seed file order, deduped)
      2. Remaining cities from city_map, appended in their original order
    """
    seen: set[str] = set()
    ordered: list[tuple[str, str]] = []

    # Seeds first
    for entry in seeds:
        city   = entry.get("city", "").strip()
        county = entry.get("county", "").strip()
        if not city:
            continue
        key = city.lower()
        if key not in seen:
            seen.add(key)
            ordered.append((city, county))

    # Fill remaining from city_map
    for city, county in city_map.items():
        if city.lower() not in seen:
            seen.add(city.lower())
            ordered.append((city, county))

    return ordered


def get_county(city: str, city_map: dict, seed_lookup: dict[str, str] | None = None) -> str:
    """
    Look up county for a city.
    Checks seed_lookup first (pre-built from seed_locations.json), then city_map.
    """
    if seed_lookup and city in seed_lookup:
        return seed_lookup[city]
    if city in city_map:
        return city_map[city]
    lower = city.lower()
    for k, v in city_map.items():
        if k.lower() == lower:
            return v
    return "Okänt län"


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def process_entry(
    entry: dict,
    master_keys: dict[str, dict],
    secondary_keys: set[str],
    skip_scrape: bool = False,
) -> bool:
    """
    1. Scrape website for email, Facebook, and inferred city (unless skip_scrape).
    2. Check primary dedup key (normalised name + city).
    3. Check secondary dedup key (bare name after prefix strip + city).
    Returns True if the entry is new and should be written.
    """
    if entry.get("hemsida") and not skip_scrape:
        jitter_sleep(SCRAPE_DELAY_MIN, SCRAPE_DELAY_MAX)
        scraped = scrape_website(entry["hemsida"])
        entry["email"]    = scraped["email"]    or ""
        entry["facebook"] = scraped["facebook"] or ""

        # Use website city only when Maps provided no address at all
        if not entry.get("_has_address") and scraped.get("inferred_city"):
            entry["stad"] = scraped["inferred_city"]
            entry["_city_source"] = "website"

    name = entry["namn"]
    city = entry["stad"]

    pk = _dedup_key(name, city)
    if pk in master_keys:
        logger.debug(f"  DUPE(primary): {name} / {city}")
        return False

    sk = _dedup_key_bare(name, city)
    if sk in secondary_keys:
        logger.debug(f"  DUPE(secondary): {name} / {city}")
        return False

    master_keys[pk] = entry
    secondary_keys.add(sk)
    return True


def write_entry(
    entry: dict,
    writer_master: csv.DictWriter,
    writer_raw: csv.DictWriter,
) -> None:
    master_row = {col: entry.get(col, "") for col in CSV_COLUMNS}
    raw_row = {col: entry.get(col, "") for col in CSV_COLUMNS + RAW_EXTRA_COLUMNS}
    writer_master.writerow(master_row)
    writer_raw.writerow(raw_row)


def _city_loop(
    city_order: list[tuple[str, str]],
    city_map: dict,
    seed_lookup: dict,
    effective_max: int,
    completed: set,
    master_keys: dict,
    secondary_keys: set,
    writer_master: csv.DictWriter,
    writer_raw: csv.DictWriter,
    f_master,
    f_raw,
    skip_scrape: bool,
    search_terms: list[str],
    pages: int,
    progress_file: Path = PROGRESS_FILE,
    category: str = "dagis",
) -> int:
    """
    Inner loop: iterate cities, run SerpApi + hitta.se, enrich, dedup, write.
    Returns the number of entries added in this call.
    """
    total = len(master_keys)

    for city, county in city_order:
        if total >= effective_max:
            logger.info(f"Reached limit of {effective_max} entries — stopping.")
            break

        if not county:
            county = get_county(city, city_map, seed_lookup)
        city_new = 0

        # ----------------------------------------------------------------
        # Strategy 1: Google Maps via SerpApi
        # ----------------------------------------------------------------
        if serpapi_available():
            for term in search_terms:
                search_key = f"serpapi|{city}|{term}"
                if search_key in completed:
                    continue
                if total >= effective_max:
                    break

                query = f"{term} {city}"
                logger.info(f"[SerpApi] '{query}'")
                raw_results = search_google_maps(query, num_pages=pages)
                logger.info(f"  -> {len(raw_results)} raw results")

                term_new = 0
                for raw in raw_results:
                    if total >= effective_max:
                        break
                    if not looks_like_dog_business(raw, category=category):
                        continue
                    entry = parse_serpapi_result(raw, city, county)
                    if entry is None:
                        continue
                    if process_entry(entry, master_keys, secondary_keys, skip_scrape):
                        write_entry(entry, writer_master, writer_raw)
                        total    += 1
                        city_new += 1
                        term_new += 1
                        logger.info(
                            f"  + [{total:4d}] {entry['namn']} ({city})"
                            f"  email={'Y' if entry['email'] else '-'}"
                            f"  fb={'Y' if entry['facebook'] else '-'}"
                        )

                    completed.add(search_key)
                save_progress(completed, total, progress_file)
                f_master.flush()
                f_raw.flush()
                logger.info(f"  Added {term_new} from '{query}'. Total: {total}")
                jitter_sleep()

        # ----------------------------------------------------------------
        # Strategy 2: hitta.se directory scraping (runs as supplement)
        # ----------------------------------------------------------------
        for term in ["hunddagis", "hundpensionat", "hundhotell"]:
            search_key = f"hitta|{city}|{term}"
            if search_key in completed:
                continue
            if total >= effective_max:
                break

            logger.info(f"[hitta.se] '{term}' in {city}")
            dir_results = search_hitta(term, city)
            dir_new = 0

            for raw in dir_results:
                if total >= effective_max:
                    break
                entry = {
                    "namn":         raw.get("namn", ""),
                    "stad":         city,
                    "lan":          county,
                    "email":        "",
                    "hemsida":      raw.get("hemsida", ""),
                    "facebook":     "",
                    "kalla":        "directory",
                    "raw_address":  "",
                    "phone":        "",
                    "raw_source":   "hitta.se",
                    "_has_address": False,
                    "_search_city": city,
                }
                if not entry["namn"] or not looks_like_dog_business(entry, category=category):
                    continue
                if process_entry(entry, master_keys, secondary_keys, skip_scrape):
                    write_entry(entry, writer_master, writer_raw)
                    total    += 1
                    city_new += 1
                    dir_new  += 1
                    logger.info(
                        f"  + [{total:4d}] {entry['namn']} (hitta/{city})"
                        f"  email={'Y' if entry['email'] else '-'}"
                    )

            completed.add(search_key)
            save_progress(completed, total, progress_file)
            f_master.flush()
            f_raw.flush()
            if dir_new:
                logger.info(f"  Added {dir_new} from hitta/{city}. Total: {total}")
            jitter_sleep(SCRAPE_DELAY_MIN, SCRAPE_DELAY_MAX)

        # ----------------------------------------------------------------
        # Per-city summary & soft-target notice
        # ----------------------------------------------------------------
        if city_new:
            logger.info(f"  [+] {city}: {city_new} new entries. Total: {total}")
        else:
            logger.debug(f"  No new entries for {city}")

        save_progress(completed, total, progress_file)

        if TARGET_COUNT <= total < effective_max:
            logger.info(
                f"  OK Soft target ({TARGET_COUNT}) reached. "
                f"Continuing to {effective_max}…"
            )

    return total


def main() -> int:
    args = parse_args()

    # --demo: print sample rows and exit immediately (no API calls)
    if args.demo:
        run_demo()
        return -1   # sentinel: "demo ran OK, nothing was collected"

    # ----------------------------------------------------------------
    # Resolve run parameters
    # ----------------------------------------------------------------
    # Select search terms based on country and category
    if args.category == "kennels":
        if args.country == "no":
            base_terms = SEARCH_TERMS_KENNELS_NO
        elif args.country == "dk":
            base_terms = SEARCH_TERMS_KENNELS_DK
        else:
            base_terms = SEARCH_TERMS_KENNELS_SE
    elif args.country == "no":
        base_terms = SEARCH_TERMS_NO
    elif args.country == "dk":
        base_terms = SEARCH_TERMS_DK
    else:  # se
        base_terms = SEARCH_TERMS_SE
    
    search_terms = base_terms + (
        ["dog daycare", "dog boarding"] if args.all_terms and args.country == "se"
        else []
    )

    # Auto pages: 1 for --test (saves free-tier credits), 2 otherwise
    if args.pages is not None:
        pages = args.pages
    elif args.test:
        pages = 1
    else:
        pages = 2

    # ----------------------------------------------------------------
    # City order (load seeds FIRST, before banner)
    # ----------------------------------------------------------------
    if args.country == "se":
        city_map    = load_city_map()
    else:
        city_map    = {}  # Not used for NO/DK
    
    seeds       = load_seed_locations(args.country)
    county_key = "county" if args.country == "se" else "region"
    seed_lookup = {s["city"]: s[county_key] for s in seeds if s.get("city")}

    # ----------------------------------------------------------------
    # Banner
    # ----------------------------------------------------------------
    mode_label = (
        f"TEST ({', '.join(TEST_CITIES)})" if args.test
        else f"CITIES ({args.cities})"     if args.cities
        else f"FULL {args.country.upper()} ({len(seeds)} seed cities)"
    )
    scrape_label = "OFF (--no-scrape)" if args.no_scrape else "ON"
    terms_label  = f"{len(search_terms)} terms {'(all)' if args.all_terms else '(core)'}"
    category_label = f"{args.category}" if args.category else "dagis"

    logger.info("=" * 60)
    logger.info("Dog Care Dataset Builder")
    logger.info(f"  Country   : {args.country.upper()}")
    logger.info(f"  Category  : {category_label}")
    logger.info(f"  Mode      : {mode_label}")
    logger.info(f"  Terms     : {terms_label}  —  {', '.join(search_terms)}")
    logger.info(f"  Pages     : {pages} per query")
    logger.info(f"  Limit     : {args.limit}")
    logger.info(f"  Scraping  : {scrape_label}")
    logger.info(f"  SerpApi   : {'available [OK]' if serpapi_available() else 'NOT configured [!!]'}")
    logger.info("=" * 60)

    if not serpapi_available():
        logger.warning(
            "SERPAPI_KEY is not set or 'google-search-results' is not installed.\n"
            "  --> Set SERPAPI_KEY in your .env file and run:\n"
            "       pip install google-search-results\n"
            "  --> Falling back to directory scraping only (limited coverage)."
        )

    # ----------------------------------------------------------------
    # City order (now build actual city list)
    # ----------------------------------------------------------------
        city_order = [
            (c, get_county(c, city_map, seed_lookup)) for c in TEST_CITIES
        ]
        logger.info(f"Test mode: {len(city_order)} cities")
    elif args.cities:
        city_list  = [c.strip() for c in args.cities.split(",") if c.strip()]
        city_order = [
            (c, get_county(c, city_map, seed_lookup)) for c in city_list
        ]
        logger.info(f"Custom cities: {[c for c, _ in city_order]}")
    else:
        # Default: seed cities only (100 well-populated cities).
        # This gives the best yield per credit — small towns rarely have
        # dog daycares that don't already appear in a nearby larger city search.
        city_order = [(s["city"], s.get("county") or s.get("region", "")) for s in seeds if s.get("city")]
        logger.info(f"Seed cities only: {len(city_order)} cities")

    # ----------------------------------------------------------------
    # Output files (country/category-specific)
    # ----------------------------------------------------------------
    file_suffix = f"{args.country}_{args.category}" if args.category != "dagis" else args.country
    master_csv  = DATA_DIR / f"hunddagis_{file_suffix}_master.csv"
    raw_csv     = DATA_DIR / f"hunddagis_{file_suffix}_raw.csv"
    progress_file = DATA_DIR / f"progress_{file_suffix}.json"

    # ----------------------------------------------------------------
    # Load state (before credit estimate so we can deduct done searches)
    # ----------------------------------------------------------------
    progress                    = load_progress(progress_file)
    completed                   = set(progress.get("completed", []))
    master_keys, secondary_keys = load_existing_entries(master_csv)
    total_start                 = len(master_keys)
    logger.info(f"Resuming: {len(completed)} searches done, {total_start} entries loaded")

    # Print credit estimate — subtract already-completed searches
    if serpapi_available():
        remaining_cities = [
            c for c, _ in city_order
            if not all(f"serpapi|{c}|{t}" in completed for t in search_terms)
        ]
        print_credit_estimate(len(remaining_cities), len(search_terms), pages)

    # ----------------------------------------------------------------
    # Open output files
    # ----------------------------------------------------------------
    master_is_new = not master_csv.exists()
    raw_is_new    = not raw_csv.exists()

    with (
        open(master_csv, "a", encoding="utf-8", newline="") as f_master,
        open(raw_csv,    "a", encoding="utf-8", newline="") as f_raw,
    ):
        writer_master = csv.DictWriter(f_master, fieldnames=CSV_COLUMNS)
        writer_raw    = csv.DictWriter(f_raw,    fieldnames=CSV_COLUMNS + RAW_EXTRA_COLUMNS)
        if master_is_new:
            writer_master.writeheader()
        if raw_is_new:
            writer_raw.writeheader()

        total = _city_loop(
            city_order    = city_order,
            city_map      = city_map,
            seed_lookup   = seed_lookup,
            effective_max = args.limit,
            completed     = completed,
            master_keys   = master_keys,
            secondary_keys= secondary_keys,
            writer_master = writer_master,
            writer_raw    = writer_raw,
            f_master      = f_master,
            f_raw         = f_raw,
            skip_scrape   = args.no_scrape,
            search_terms  = search_terms,
            pages         = pages,
            progress_file = progress_file,
            category      = args.category,
        )

    # ----------------------------------------------------------------
    # Summary
    # ----------------------------------------------------------------
    added = total - total_start
    logger.info("=" * 60)
    logger.info(f"Done.  Added: {added}  |  Total in master CSV: {total}")
    logger.info(f"  Master CSV : {master_csv}")
    logger.info(f"  Raw CSV    : {raw_csv}")
    logger.info(f"  Log        : {LOG_FILE}")
    if total < TARGET_COUNT:
        logger.info(
            f"  [!] Only {total} entries collected (target {TARGET_COUNT}). "
            f"Try adding more cities or check your SerpApi key."
        )
    logger.info("=" * 60)

    return total


if __name__ == "__main__":
    result = main()
    # -1  → demo mode (success, nothing written to CSV)
    # >=0 → real run; warn if nothing was collected but still exit 0
    sys.exit(0)
