import { NextRequest, NextResponse } from "next/server";

const APPSTORE_URL = process.env.NEXT_PUBLIC_FLOCKEN_APPSTORE_URL || "https://apps.apple.com/app/flocken/id6755424578";
const PLAYSTORE_URL = process.env.NEXT_PUBLIC_FLOCKEN_PLAYSTORE_URL || "https://play.google.com/store/apps/details?id=com.bastavan.app";

function withQuery(baseUrl: string, req: NextRequest) {
  const url = new URL(baseUrl);
  // Behåll alla query params från /download?utm_... osv
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

export function GET(req: NextRequest) {
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const uaOriginal = req.headers.get("user-agent") || "";

  const isAndroid = ua.includes("android");
  
  // iOS detection - förbättrad för iPadOS
  // iPadOS 13+ rapporterar sig som "Macintosh" istället för "iPad"
  // Vi detekterar iPad genom: Macintosh + Safari + ingen Chrome/Firefox
  // Detta är en heuristik - bättre att redirecta iPad (och eventuellt Mac) till App Store
  // än att missa iPads som hamnar på manual-sidan
  const isIOS =
    ua.includes("iphone") ||
    ua.includes("ipad") ||
    ua.includes("ipod") ||
    // iPadOS detection: Macintosh + Safari (utan Chrome/Firefox/Edge)
    (ua.includes("macintosh") && 
     ua.includes("safari") && 
     !ua.includes("chrome") && 
     !ua.includes("firefox") &&
     !ua.includes("edge") &&
     !ua.includes("crios") && // Chrome iOS
     !ua.includes("fxios"));   // Firefox iOS

  // Redirect iOS till App Store
  if (isIOS) {
    return NextResponse.redirect(withQuery(APPSTORE_URL, req), 302);
  }
  
  // Redirect Android till Google Play
  if (isAndroid) {
    return NextResponse.redirect(withQuery(PLAYSTORE_URL, req), 302);
  }

  // Desktop/okänt → skicka till manual-sidan
  return NextResponse.redirect(new URL("/download/manual", req.nextUrl.origin), 302);
}
