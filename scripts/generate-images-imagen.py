#!/usr/bin/env python3
"""
Flocken Image Generator - Vertex AI Imagen 3
=============================================

Genererar bilder för Flocken med Google Vertex AI Imagen 3.
Följer visual_style.md guidelines automatiskt.

Användning:
    python scripts/generate-images-imagen.py --prompt "Din prompt här"
    python scripts/generate-images-imagen.py --prompt-file prompts.txt
    python scripts/generate-images-imagen.py --interactive

Förutsättningar:
    1. Google Cloud SDK installerat: https://cloud.google.com/sdk/docs/install
    2. Autentisering via något av:
       - gcloud auth application-default login
       - GOOGLE_APPLICATION_CREDENTIALS miljövariabel
    3. Vertex AI API aktiverat i projektet
    4. Python-paket: pip install google-cloud-aiplatform

OBS: Watermark är avstängt (add_watermark=False) för determinism enligt docs.
"""

import os
import sys
import argparse
import datetime
import json
from pathlib import Path

# Försök importera Vertex AI SDK
try:
    import vertexai
    from vertexai.preview.vision_models import ImageGenerationModel
except ImportError:
    print("ERROR: google-cloud-aiplatform är inte installerat.")
    print("Kör: pip install google-cloud-aiplatform")
    sys.exit(1)


# =============================================================================
# KONFIGURATION
# =============================================================================

# GCP Projekt (samma som används för BigQuery)
PROJECT_ID = "nastahem-tracking"
LOCATION = "europe-west4"  # Imagen är tillgängligt i denna region

# Imagen model
MODEL_ID = "imagen-3.0-generate-002"

# Output-mapp (relativt till script-mappen)
SCRIPT_DIR = Path(__file__).parent
OUTPUT_DIR = SCRIPT_DIR.parent / "generated_images"

# Flocken visuell stil - automatiskt tillägg till alla prompts
# Baserat på docs/brand/visual_style.md
FLOCKEN_STYLE_SUFFIX = """
Photographed with a full-frame camera, 35mm or 50mm lens, f/2.8-f/5.6 for natural depth of field.
Swedish natural daylight, soft muted colors, no oversaturation.
Authentic Swedish suburban or small-town environment, Scandinavian vegetation.
Slightly imperfect details typical of real photography, natural asymmetry.
No glossy fur, no plastic textures, no CGI, no render-like surfaces, no over-sharpening.
Realistic fur strand variation, slight unevenness, natural dirt or moisture.
Single natural eye reflection, no cloned fur patterns.
Slight lens falloff at the edges, subtle chromatic aberration, very light natural grain.
"""

# Negativ prompt för att undvika AI-look
NEGATIVE_PROMPT = """
perfect symmetry, artificially clean surfaces, oversaturation, HDR, 
glossy fur, plastic textures, CGI, render-like surfaces, over-sharpening,
posed, studio lighting, perfect, artificial, American architecture,
multiple catchlights in eyes, cloned patterns, 3D rendered, digital art,
neon colors, instagram filters, influencer style, model-like
"""


# =============================================================================
# FUNKTIONER
# =============================================================================

def init_vertex_ai():
    """Initialisera Vertex AI med projekt och region."""
    print(f"🔧 Initierar Vertex AI...")
    print(f"   Projekt: {PROJECT_ID}")
    print(f"   Region: {LOCATION}")
    
    # Kolla efter service account key
    key_path = SCRIPT_DIR / "nastahem-tracking-key.json"
    if key_path.exists() and not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(key_path)
        print(f"   Använder service account: {key_path.name}")
    
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    print("   ✅ Vertex AI initierad")


def generate_images(
    prompt: str,
    num_images: int = 1,
    aspect_ratio: str = "1:1",
    add_style_suffix: bool = True,
    seed: int = None,
    output_prefix: str = "flocken"
) -> list[Path]:
    """
    Generera bilder med Imagen 3.
    
    Args:
        prompt: Text-prompt för bildgenerering
        num_images: Antal bilder att generera (1-4)
        aspect_ratio: "1:1", "9:16", "16:9", "4:3", "3:4"
        add_style_suffix: Lägg till Flocken-stil automatiskt
        seed: Seed för reproducerbarhet (valfri)
        output_prefix: Prefix för filnamn
    
    Returns:
        Lista med sökvägar till sparade bilder
    """
    # Skapa output-mapp om den inte finns
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Bygg full prompt med stil-suffix
    full_prompt = prompt
    if add_style_suffix:
        full_prompt = f"{prompt}\n\n{FLOCKEN_STYLE_SUFFIX}"
    
    print(f"\n🎨 Genererar {num_images} bild(er)...")
    print(f"   Aspect ratio: {aspect_ratio}")
    print(f"   Watermark: ❌ Avstängt (för determinism)")
    print(f"\n📝 Prompt:\n{'-'*50}")
    print(prompt[:500] + "..." if len(prompt) > 500 else prompt)
    print(f"{'-'*50}\n")
    
    # Ladda modell
    model = ImageGenerationModel.from_pretrained(MODEL_ID)
    
    # Generera bilder
    # OBS: add_watermark=False för determinism
    generation_params = {
        "prompt": full_prompt,
        "negative_prompt": NEGATIVE_PROMPT,
        "number_of_images": num_images,
        "aspect_ratio": aspect_ratio,
        "add_watermark": False,  # VIKTIGT: Avstängt för determinism
    }
    
    # Lägg till seed om specificerad
    if seed is not None:
        generation_params["seed"] = seed
        print(f"   Seed: {seed}")
    
    try:
        response = model.generate_images(**generation_params)
    except Exception as e:
        print(f"❌ Fel vid bildgenerering: {e}")
        raise
    
    # Spara bilder lokalt
    saved_paths = []
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    for i, image in enumerate(response.images):
        # Skapa filnamn
        filename = f"{output_prefix}_{timestamp}_{i+1}.png"
        filepath = OUTPUT_DIR / filename
        
        # Spara bilden
        image.save(str(filepath))
        saved_paths.append(filepath)
        print(f"   💾 Sparad: {filepath}")
    
    # Spara metadata
    metadata = {
        "timestamp": timestamp,
        "prompt": prompt,
        "full_prompt": full_prompt,
        "negative_prompt": NEGATIVE_PROMPT,
        "aspect_ratio": aspect_ratio,
        "num_images": num_images,
        "model": MODEL_ID,
        "seed": seed,
        "add_watermark": False,
        "files": [str(p) for p in saved_paths]
    }
    
    metadata_path = OUTPUT_DIR / f"{output_prefix}_{timestamp}_metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    print(f"   📋 Metadata: {metadata_path}")
    
    return saved_paths


def interactive_mode():
    """Interaktivt läge för att testa olika prompts."""
    print("\n🎯 INTERAKTIVT LÄGE")
    print("="*50)
    print("Skriv en prompt och tryck Enter.")
    print("Skriv 'quit' eller 'q' för att avsluta.")
    print("="*50)
    
    while True:
        try:
            prompt = input("\n📝 Prompt: ").strip()
            
            if prompt.lower() in ['quit', 'q', 'exit']:
                print("👋 Avslutar...")
                break
            
            if not prompt:
                print("⚠️  Tom prompt, försök igen.")
                continue
            
            # Fråga om aspect ratio
            ratio = input("   Aspect ratio [1:1/9:16/16:9/4:3/3:4] (default 1:1): ").strip()
            if not ratio:
                ratio = "1:1"
            
            # Fråga om antal bilder
            num = input("   Antal bilder [1-4] (default 1): ").strip()
            num_images = int(num) if num.isdigit() and 1 <= int(num) <= 4 else 1
            
            # Generera
            generate_images(prompt, num_images=num_images, aspect_ratio=ratio)
            
        except KeyboardInterrupt:
            print("\n👋 Avbruten av användare")
            break
        except Exception as e:
            print(f"❌ Fel: {e}")


def run_from_file(filepath: str):
    """Kör prompts från en fil (en prompt per rad)."""
    path = Path(filepath)
    if not path.exists():
        print(f"❌ Filen finns inte: {filepath}")
        sys.exit(1)
    
    with open(path, "r", encoding="utf-8") as f:
        prompts = [line.strip() for line in f if line.strip() and not line.startswith("#")]
    
    print(f"📄 Läste {len(prompts)} prompt(s) från {filepath}")
    
    for i, prompt in enumerate(prompts, 1):
        print(f"\n{'='*50}")
        print(f"Prompt {i}/{len(prompts)}")
        print(f"{'='*50}")
        generate_images(prompt, output_prefix=f"flocken_batch{i}")


# =============================================================================
# HUVUDPROGRAM
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Generera bilder för Flocken med Vertex AI Imagen 3",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exempel:
    # Generera en bild med prompt
    python generate-images-imagen.py --prompt "Golden retriever walking on a Swedish forest path"
    
    # Generera 4 bilder i 9:16 format
    python generate-images-imagen.py --prompt "..." --num 4 --ratio 9:16
    
    # Kör i interaktivt läge
    python generate-images-imagen.py --interactive
    
    # Kör från fil med flera prompts
    python generate-images-imagen.py --prompt-file my-prompts.txt
        """
    )
    
    parser.add_argument(
        "--prompt", "-p",
        help="Text-prompt för bildgenerering"
    )
    parser.add_argument(
        "--prompt-file", "-f",
        help="Fil med prompts (en per rad)"
    )
    parser.add_argument(
        "--interactive", "-i",
        action="store_true",
        help="Kör i interaktivt läge"
    )
    parser.add_argument(
        "--num", "-n",
        type=int,
        default=1,
        choices=[1, 2, 3, 4],
        help="Antal bilder att generera (1-4, default: 1)"
    )
    parser.add_argument(
        "--ratio", "-r",
        default="1:1",
        choices=["1:1", "9:16", "16:9", "4:3", "3:4"],
        help="Aspect ratio (default: 1:1)"
    )
    parser.add_argument(
        "--seed", "-s",
        type=int,
        help="Seed för reproducerbarhet"
    )
    parser.add_argument(
        "--no-style",
        action="store_true",
        help="Lägg INTE till Flocken-stil suffix"
    )
    parser.add_argument(
        "--prefix",
        default="flocken",
        help="Prefix för filnamn (default: flocken)"
    )
    
    args = parser.parse_args()
    
    # Verifiera att minst ett läge är valt
    if not any([args.prompt, args.prompt_file, args.interactive]):
        parser.print_help()
        print("\n❌ Ange --prompt, --prompt-file eller --interactive")
        sys.exit(1)
    
    # Banner
    print("""
╔════════════════════════════════════════════════════════════════╗
║           🐕 FLOCKEN IMAGE GENERATOR - Vertex AI Imagen 3      ║
║                                                                ║
║  Genererar svenska, vardagliga hundbilder                      ║
║  enligt Flockens visuella stil                                 ║
╚════════════════════════════════════════════════════════════════╝
    """)
    
    # Initiera Vertex AI
    init_vertex_ai()
    
    # Kör baserat på valt läge
    if args.interactive:
        interactive_mode()
    elif args.prompt_file:
        run_from_file(args.prompt_file)
    elif args.prompt:
        generate_images(
            prompt=args.prompt,
            num_images=args.num,
            aspect_ratio=args.ratio,
            add_style_suffix=not args.no_style,
            seed=args.seed,
            output_prefix=args.prefix
        )
    
    print("\n✅ Klart!")
    print(f"📂 Bilder sparade i: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
