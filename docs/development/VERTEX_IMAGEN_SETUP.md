# Vertex AI Imagen – körning och 403 Permission Denied

## Köra scriptet (Node.js)

```bash
node scripts/generate-flocken-imagen-seeds.js
```

Ingen Python krävs – scriptet använder `@google/genai` och Vertex AI.

## Service Account med Vertex AI User

**`email-signup-api-service@nastahem-tracking.iam.gserviceaccount.com`** har redan rollen **Vertex AI User** ✅

För att använda denna service account:

1. **Hämta key-filen från GCP Console:**
   - Gå till [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=nastahem-tracking)
   - Hitta `email-signup-api-service`
   - Klicka på den → **Keys** → **Add Key** → **Create new key** → **JSON**
   - Spara filen som `scripts/email-signup-api-service-key.json`

2. **Kör scriptet:**
   ```bash
   node scripts/generate-flocken-imagen-seeds.js
   ```
   Scriptet hittar automatiskt `email-signup-api-service-key.json` och använder den.

## Om du får 403 Permission Denied

Felet betyder att det konto som används **saknar behörighet** för Vertex AI (Imagen).

### Alternativ A: Använd ditt eget Google-konto (enklast)

1. Installera [gcloud CLI](https://cloud.google.com/sdk/docs/install) om du inte har det.
2. Logga in med application default credentials:
   ```bash
   gcloud auth application-default login
   ```
3. **Ta bort eller byt namn** på `scripts/nastahem-tracking-key.json` tillfälligt (så att scriptet inte använder service account), **eller** kör med tom credentials:
   ```bash
   set GOOGLE_APPLICATION_CREDENTIALS=
   node scripts/generate-flocken-imagen-seeds.js
   ```
   (PowerShell: `$env:GOOGLE_APPLICATION_CREDENTIALS=""`)

Då används ditt inloggade användarkonto, som normalt har Vertex AI-rättigheter om du är ägare/editor i projektet.

### Alternativ B: Ge service account Vertex AI-rättigheter

Om du vill använda service account (t.ex. för automation):

1. Gå till [IAM & Admin](https://console.cloud.google.com/iam-admin/iam?project=nastahem-tracking).
2. Hitta service account (t.ex. `bigquery-automation@nastahem-tracking.iam.gserviceaccount.com`).
3. Klicka på pennikonen (Redigera).
4. Lägg till roll: **Vertex AI User** (eller en anpassad roll med behörigheten `aiplatform.endpoints.predict`).
5. Spara.

Därefter ska `node scripts/generate-flocken-imagen-seeds.js` fungera med befintlig key-fil.

## Övrigt

- **Vertex AI API** måste vara aktiverat: [Aktivera API](https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=nastahem-tracking)
- Bilder sparas i `generated_images/` (skapas automatiskt).
