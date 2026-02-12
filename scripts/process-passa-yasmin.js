const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImage() {
  const projectRoot = path.join(__dirname, '..');
  // Läs från originalbilden i C:\Dev
  const inputPath = path.join('C:', 'Dev', 'flocken_screens_passa_yasmin.png');
  const outputPath = path.join(projectRoot, 'public', 'assets', 'flocken', 'screenshots', 'flocken_passa_yasmin.png');

  if (!fs.existsSync(inputPath)) {
    console.log('❌ Bilden finns inte:', inputPath);
    return;
  }

  console.log('📱 Bearbetar bilden...');

  // iPhone 14 Pro dimensioner (samma som create-iphone-mockups.js)
  const DEVICE_WIDTH = 430;
  const DEVICE_HEIGHT = 932;
  const CORNER_RADIUS = 47;

  // Mockup dimensioner (med marginal för skugga - samma som Rasta)
  const MOCKUP_WIDTH = 500;
  const MOCKUP_HEIGHT = 1020;

  // Beräkna centrering
  const OFFSET_X = Math.floor((MOCKUP_WIDTH - DEVICE_WIDTH) / 2);
  const OFFSET_Y = Math.floor((MOCKUP_HEIGHT - DEVICE_HEIGHT) / 2);

  try {
    // Läs in originalbild och få metadata
    const metadata = await sharp(inputPath).metadata();
    console.log('Original bild:', metadata.width, 'x', metadata.height);
    
    // Läs in screenshot och skala till EXAKT iPhone-storlek (fyller hela skärmen)
    const resizedScreenshot = await sharp(inputPath)
      .resize(DEVICE_WIDTH, DEVICE_HEIGHT, {
        fit: 'cover',  // Fyller hela området, croppar om nödvändigt
        position: 'center'
      })
      .png()
      .toBuffer();

    // Skapa en SVG mask för rundade hörn
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

    // Skapa iPhone-ram SVG
    const phoneFrameSVG = `
      <svg width="${MOCKUP_WIDTH}" height="${MOCKUP_HEIGHT}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="20"/>
            <feOffset dx="0" dy="15" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Skugga -->
        <rect x="${OFFSET_X}" y="${OFFSET_Y + 5}" width="${DEVICE_WIDTH}" height="${DEVICE_HEIGHT}" 
              rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" 
              fill="rgba(0,0,0,0.3)" filter="url(#shadow)"/>
        
        <!-- Telefonram (svart) -->
        <rect x="${OFFSET_X}" y="${OFFSET_Y}" width="${DEVICE_WIDTH}" height="${DEVICE_HEIGHT}" 
              rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" 
              fill="rgb(20,20,20)" stroke="rgb(50,50,50)" stroke-width="2"/>
        
        <!-- Dynamic Island -->
        <ellipse cx="${OFFSET_X + DEVICE_WIDTH/2}" cy="${OFFSET_Y + 30}" 
                 rx="60" ry="18" fill="rgb(10,10,10)"/>
      </svg>
    `;

    // Skapa canvas med transparent bakgrund
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

    // Kombinera allt: ram + screenshot
    await sharp(canvas)
      .composite([
        // Först: telefonramen (ligger under)
        {
          input: Buffer.from(phoneFrameSVG),
          top: 0,
          left: 0
        },
        // Sen: screenshot som fyller skärmen
        {
          input: screenshotWithRoundedCorners,
          top: OFFSET_Y,
          left: OFFSET_X
        }
      ])
      .png({ quality: 95 })
      .toFile(outputPath);

    console.log('✅ Mockup skapad:', outputPath);
  } catch (error) {
    console.error('❌ Fel:', error.message);
  }
}

processImage();
