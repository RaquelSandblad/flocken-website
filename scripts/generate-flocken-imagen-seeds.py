"""
Generate 10 deterministic images on Vertex AI using Imagen + seeds.

Prereqs:
- pip install --upgrade google-cloud-aiplatform
- gcloud auth application-default login
- Set PROJECT_ID + LOCATION
"""

import os
import sys
import traceback
from datetime import datetime

import vertexai

# Stöd för både preview och GA vision_models (SDK-versioner skiljer)
try:
    from vertexai.preview.vision_models import ImageGenerationModel
except ImportError:
    from vertexai.vision_models import ImageGenerationModel

# ========= CONFIG =========
PROJECT_ID = os.getenv("GCP_PROJECT", "nastahem-tracking")  # Uppdaterat till Flocken-projektet
LOCATION = os.getenv("GCP_LOCATION", "europe-west4")  # pick your Vertex region
MODEL_NAME = "imagen-4.0-generate-001"  # see supported model versions in docs
OUT_DIR = os.getenv("OUT_DIR", "./generated_images")

# Master prompt (same idea as Nano Banana prompt, but tuned for Imagen)
PROMPT = """
Photorealistic advertising image in bright, warm daylight in a Swedish everyday park.
A dog owner (age 25–40) stands casually holding a smartphone; calm, friendly mood (pleasant and upbeat, not exaggerated).
A friendly dog (labrador or poodle) sits next to them looking up.
Modern smartphone photography look: sharp focus on dog and hand with phone, soft background bokeh, clean colors, natural lighting, no harsh shadows.
No recognizable landmarks. No text. No logos.
Phone screen must not be readable; only a vague hint of a map/app.
Composition with generous negative space for future overlay.
""".strip()

NEGATIVE_PROMPT = """
dystopian, gloomy, rainy, night, harsh shadows, serious faces, exaggerated laughter,
posed stock photo, extra fingers, deformed hands, text, watermark, readable UI, logo, brand marks
""".strip()

# 10 seeds (byt gärna till egna om du vill)
SEEDS = [101, 202, 303, 404, 505, 606, 707, 808, 909, 1001]

# ========= RUN =========
def main():
    # Skapa output-mapp relativt till script-mappen
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(script_dir, "..", "generated_images")
    os.makedirs(out_path, exist_ok=True)

    # Initiera Vertex AI
    # Kolla efter service account key
    key_path = os.path.join(script_dir, "nastahem-tracking-key.json")
    if os.path.exists(key_path) and not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = key_path
        print(f"🔑 Använder service account: {os.path.basename(key_path)}")

    print(f"🔧 Initierar Vertex AI...")
    print(f"   Projekt: {PROJECT_ID}")
    print(f"   Region: {LOCATION}")
    print(f"   Model: {MODEL_NAME}")
    print(f"   Output: {out_path}")
    print(f"   Watermark: ❌ Avstängt (för determinism)\n")

    vertexai.init(project=PROJECT_ID, location=LOCATION)
    model = ImageGenerationModel.from_pretrained(MODEL_NAME)

    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    print(f"🎨 Genererar {len(SEEDS)} bilder med seeds...\n")

    for i, seed in enumerate(SEEDS, 1):
        print(f"[{i}/{len(SEEDS)}] Genererar med seed {seed}...", end=" ")
        
        try:
            response = model.generate_images(
                prompt=PROMPT,
                negative_prompt=NEGATIVE_PROMPT,
                number_of_images=1,
                aspect_ratio="1:1",      # ändra till "4:5" eller "9:16" i separata körningar
                seed=seed,
                add_watermark=False,     # required for deterministic behavior per docs
            )

            img = response.images[0]
            filename = f"flocken_v1_seed{seed}_{stamp}.png"
            filepath = os.path.join(out_path, filename)

            # Spara: vissa SDK-versioner använder save(path), andra save(location=path)
            try:
                img.save(location=filepath)
            except TypeError:
                img.save(filepath)

            print(f"✅ Sparad: {filename}")

        except Exception as e:
            print(f"❌ Fel: {e}")
            traceback.print_exc()
            continue

    print(f"\n✅ Klart! {len(SEEDS)} bilder genererade i: {out_path}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("\n" + "=" * 60)
        print("❌ OVÄNTAT FEL – kopia hela utskriften nedan om du behöver hjälp:")
        print("=" * 60)
        traceback.print_exc()
        sys.exit(1)
