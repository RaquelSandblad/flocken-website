/**
 * Script för att skapa iPhone-mockups av app screenshots
 * Lägger screenshots i realistiska iPhone-ramar
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const os = require('os');

// iPhone 14 Pro dimensioner
const DEVICE_WIDTH = 430;
const DEVICE_HEIGHT = 932;
const CORNER_RADIUS = 47;

// Mockup dimensioner (med marginal)
const MOCKUP_WIDTH = 500;
const MOCKUP_HEIGHT = 1020;

// Beräkna centrering
const OFFSET_X = Math.floor((MOCKUP_WIDTH - DEVICE_WIDTH) / 2);
const OFFSET_Y = Math.floor((MOCKUP_HEIGHT - DEVICE_HEIGHT) / 2);

/**
 * Skapar en iPhone mockup av en screenshot
 */
async function createIPhoneMockup(screenshotPath, outputPath) {
  try {
    console.log(`📱 Bearbetar: ${path.basename(screenshotPath)}`);

    // Läs in screenshot och skala till iPhone-storlek
    const resizedScreenshot = await sharp(screenshotPath)
      .resize(DEVICE_WIDTH, DEVICE_HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toBuffer();

    // Skapa en SVG mask för rundade hörn (iPhone-stil)
    const roundedCornersSVG = `
      <svg width="${DEVICE_WIDTH}" height="${DEVICE_HEIGHT}">
        <rect x="0" y="0" width="${DEVICE_WIDTH}" height="${DEVICE_HEIGHT}" 
              rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" fill="white"/>
      </svg>
    `;

    // Applicera rundade hörn på screenshot
    const screenshotWithRoundedCorners = await sharp(resizedScreenshot)
      .composite([
        {
          input: Buffer.from(roundedCornersSVG),
          blend: 'dest-in'
        }
      ])
      .png()
      .toBuffer();

    // Skapa canvas med plats för skugga
    const canvas = await sharp({
      create: {
        width: MOCKUP_WIDTH,
        height: MOCKUP_HEIGHT,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .png()
    .toBuffer();

    // Skapa mjuk skugga
    const shadowSVG = `
      <svg width="${MOCKUP_WIDTH}" height="${MOCKUP_HEIGHT}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="15"/>
            <feOffset dx="0" dy="10" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect x="${OFFSET_X}" y="${OFFSET_Y}" width="${DEVICE_WIDTH}" height="${DEVICE_HEIGHT}" 
              rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" 
              fill="black" filter="url(#shadow)"/>
      </svg>
    `;

    // Kombinera allt
    await sharp(canvas)
      .composite([
        // Lägg till skugga
        {
          input: Buffer.from(shadowSVG),
          top: 0,
          left: 0
        },
        // Lägg till screenshot med rundade hörn
        {
          input: screenshotWithRoundedCorners,
          top: OFFSET_Y,
          left: OFFSET_X
        }
      ])
      .png({ quality: 95 })
      .toFile(outputPath);

    console.log(`✅ Skapade mockup: ${path.basename(outputPath)}`);
    return true;

  } catch (error) {
    console.error(`❌ Fel vid skapande av mockup: ${error.message}`);
    return false;
  }
}

/**
 * Huvudfunktion
 */
async function main() {
  console.log('🎨 Skapar iPhone mockups...\n');

  const projectRoot = path.join(__dirname, '..');
  const screenshotsDir = path.join(projectRoot, 'public', 'assets', 'flocken', 'screenshots');
  const downloadsDir = path.join(os.homedir(), 'Downloads');

  // Mappling av screenshots
  const screenshotsMap = {
    'flocken_screen_para': 'flocken_para_karta-alla-hundar.png',
    'flocken_screen_passa': 'flocken_passa_lista-personer-som-kan-passa.png',
    'flocken_screen_rasta': 'flocken_rasta_starta-promenad.png',
    'flocken_screen_besoka': 'flocken_besoka_karta-alla.png',
  };

  console.log(`📁 Screenshots mapp: ${screenshotsDir}`);
  console.log(`📁 Letar i Downloads: ${downloadsDir}\n`);

  // Skapa output-mapp om den inte finns
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  let successCount = 0;
  let totalCount = 0;

  // Bearbeta varje screenshot
  for (const [inputName, outputName] of Object.entries(screenshotsMap)) {
    totalCount++;

    // Leta efter filen i Downloads (prova olika extensions)
    let inputPath = null;
    const extensions = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];
    
    for (const ext of extensions) {
      const potentialPath = path.join(downloadsDir, inputName + ext);
      if (fs.existsSync(potentialPath)) {
        inputPath = potentialPath;
        break;
      }
    }

    if (!inputPath) {
      console.log(`⚠️  Hittade inte: ${inputName} (prövade ${extensions.join(', ')})`);
      continue;
    }

    const outputPath = path.join(screenshotsDir, outputName);
    
    const success = await createIPhoneMockup(inputPath, outputPath);
    if (success) successCount++;
  }

  console.log(`\n✨ Klart! ${successCount}/${totalCount} iPhone mockups skapade.`);
  
  if (successCount > 0) {
    console.log('\n📋 Nästa steg:');
    console.log('   1. Kontrollera bilderna i: public/assets/flocken/screenshots/');
    console.log('   2. Kör: npm run dev (för att testa lokalt)');
    console.log('   3. Committa och pusha ändringarna');
  }
}

// Kör huvudfunktionen
main().catch(error => {
  console.error('❌ Oväntat fel:', error);
  process.exit(1);
});

