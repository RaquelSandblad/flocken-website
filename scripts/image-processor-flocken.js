#!/usr/bin/env node

/**
 * Flocken Image Processing Script
 * Anpassad från Nästa Hem's image processor
 * Använder Sharp för AVIF/WebP-konvertering med metadata-hantering
 * 
 * Kör med: node scripts/image-processor-flocken.js [kommando] [options]
 * 
 * Kommandon:
 * - process [bildväg]     Processar en specifik bild
 * - process-all          Processar alla bilder i _originals/
 * - migrate [från-mapp]   Migrerar befintliga bilder
 * - clean               Rensar _generated/ mappen
 * - status              Visar status på media-biblioteket
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { existsSync } = require('fs');

class FlockenImageProcessor {
  constructor() {
    this.publicDir = path.join(process.cwd(), 'public');
    this.assetsDir = path.join(this.publicDir, 'assets', 'flocken');
    this.originalsDir = path.join(this.assetsDir, '_originals');
    this.generatedDir = path.join(this.assetsDir, 'generated');
    this.metadataFile = path.join(this.assetsDir, 'image-metadata.json');
    
    this.formats = {
      avif: { quality: 85, effort: 6 },
      webp: { quality: 90, effort: 6 }
    };
    
    // Flocken-specifika storlekar (anpassade för hundbilder)
    this.sizes = {
      thumbnail: { width: 150, height: 150, fit: 'cover' },
      small: { width: 400, height: null, fit: 'inside' },
      medium: { width: 800, height: null, fit: 'inside' },
      large: { width: 1200, height: null, fit: 'inside' },
      hero: { width: 1920, height: 1080, fit: 'cover' } // För hero-bilder
    };
  }

  async loadMetadata() {
    try {
      if (existsSync(this.metadataFile)) {
        const data = await fs.readFile(this.metadataFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('⚠️  Kunde inte läsa metadata, skapar ny fil');
    }
    
    return {
      version: "1.0",
      project: "Flocken",
      lastUpdated: new Date().toISOString(),
      images: {},
      config: { formats: this.formats, sizes: this.sizes }
    };
  }

  async saveMetadata(metadata) {
    metadata.lastUpdated = new Date().toISOString();
    await fs.writeFile(this.metadataFile, JSON.stringify(metadata, null, 2));
  }

  getImageKey(filePath) {
    return path.basename(filePath, path.extname(filePath));
  }

  async ensureDirectories() {
    for (const dir of [this.assetsDir, this.originalsDir, this.generatedDir]) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
        console.log(`📁 Skapade mapp: ${path.relative(process.cwd(), dir)}`);
      }
    }
  }

  async processImage(imagePath) {
    await this.ensureDirectories();
    
    const imageKey = this.getImageKey(imagePath);
    const ext = path.extname(imagePath).toLowerCase();
    
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      throw new Error(`❌ Stöds ej filformat: ${ext}`);
    }

    console.log(`\n🖼️  Processar: ${imageKey}${ext}`);
    
    // Läs originalbildens metadata
    const image = sharp(imagePath);
    const originalMeta = await image.metadata();
    
    console.log(`   📏 Original: ${originalMeta.width}x${originalMeta.height}, ${Math.round(originalMeta.size / 1024)}KB`);

    const metadata = await this.loadMetadata();
    const imageData = {
      originalPath: path.relative(this.publicDir, imagePath).replace(/\\/g, '/'),
      originalSize: originalMeta.size,
      originalDimensions: {
        width: originalMeta.width,
        height: originalMeta.height
      },
      processedAt: new Date().toISOString(),
      variants: {}
    };

    // Generera alla storlekar och format
    for (const [sizeName, sizeConfig] of Object.entries(this.sizes)) {
      console.log(`   🔄 Skapar ${sizeName}...`);
      
      let resizer = image.clone();
      
      if (sizeConfig.fit === 'cover' && sizeConfig.width && sizeConfig.height) {
        resizer = resizer.resize(sizeConfig.width, sizeConfig.height, { 
          fit: 'cover', 
          position: 'centre' 
        });
      } else if (sizeConfig.width) {
        resizer = resizer.resize(sizeConfig.width, sizeConfig.height, { 
          fit: 'inside',
          withoutEnlargement: true 
        });
      }

      const resizedMeta = await resizer.metadata();
      
      // Skapa AVIF
      const avifPath = path.join(this.generatedDir, `${imageKey}_${sizeName}.avif`);
      await resizer
        .clone()
        .avif(this.formats.avif)
        .toFile(avifPath);
      
      const avifStat = await fs.stat(avifPath);
      
      // Skapa WebP
      const webpPath = path.join(this.generatedDir, `${imageKey}_${sizeName}.webp`);
      await resizer
        .clone()
        .webp(this.formats.webp)
        .toFile(webpPath);
      
      const webpStat = await fs.stat(webpPath);

      // Skapa JPG fallback
      const jpgPath = path.join(this.generatedDir, `${imageKey}_${sizeName}.jpg`);
      await resizer
        .clone()
        .jpeg({ quality: 90, progressive: true, mozjpeg: true })
        .toFile(jpgPath);
      
      const jpgStat = await fs.stat(jpgPath);

      // Spara variant-info
      imageData.variants[sizeName] = {
        dimensions: {
          width: resizedMeta.width,
          height: resizedMeta.height
        },
        avif: {
          path: path.relative(this.publicDir, avifPath).replace(/\\/g, '/'),
          size: avifStat.size
        },
        webp: {
          path: path.relative(this.publicDir, webpPath).replace(/\\/g, '/'),
          size: webpStat.size
        },
        jpg: {
          path: path.relative(this.publicDir, jpgPath).replace(/\\/g, '/'),
          size: jpgStat.size
        }
      };

      const avifReduction = Math.round((1 - avifStat.size / originalMeta.size) * 100);
      const webpReduction = Math.round((1 - webpStat.size / originalMeta.size) * 100);
      
      console.log(`     ✅ ${sizeName}: ${resizedMeta.width}x${resizedMeta.height}`);
      console.log(`        📦 AVIF: ${Math.round(avifStat.size / 1024)}KB (-${avifReduction}%)`);
      console.log(`        📦 WebP: ${Math.round(webpStat.size / 1024)}KB (-${webpReduction}%)`);
      console.log(`        📦 JPG:  ${Math.round(jpgStat.size / 1024)}KB (fallback)`);
    }

    // Spara i metadata
    metadata.images[imageKey] = imageData;
    await this.saveMetadata(metadata);
    
    console.log(`\n🎉 Klart! ${imageKey} processad med flera optimerade varianter`);
    
    return imageData;
  }

  async processAll() {
    console.log('🚀 Processar alla bilder i _originals/...');
    
    const files = await fs.readdir(this.originalsDir);
    const imageFiles = files.filter(file => 
      ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
    );

    if (imageFiles.length === 0) {
      console.log('📭 Inga bilder hittades i _originals/');
      return;
    }

    console.log(`📸 Hittade ${imageFiles.length} bilder att processera\n`);
    
    for (const file of imageFiles) {
      try {
        const fullPath = path.join(this.originalsDir, file);
        await this.processImage(fullPath);
      } catch (error) {
        console.error(`❌ Fel vid processering av ${file}:`, error.message);
      }
    }
    
    console.log('\n✨ Alla bilder processerade!');
  }

  async migrateFromDirectory(sourceDir) {
    console.log(`🔄 Migrerar bilder från ${sourceDir}...`);
    
    const resolvedSourceDir = path.resolve(sourceDir);
    const allowedBasePath = path.resolve(process.cwd());
    
    if (!resolvedSourceDir.startsWith(allowedBasePath)) {
      throw new Error(`❌ Säkerhetsfel: Sökvägen måste vara inom projektmappen`);
    }
    
    if (!existsSync(resolvedSourceDir)) {
      throw new Error(`❌ Katalog existerar inte: ${resolvedSourceDir}`);
    }

    const files = await fs.readdir(resolvedSourceDir);
    const imageFiles = files.filter(file => 
      ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
    );

    console.log(`📸 Hittade ${imageFiles.length} bilder att migrera\n`);

    for (const file of imageFiles) {
      const sanitizedFile = path.basename(file);
      const sourcePath = path.join(resolvedSourceDir, sanitizedFile);
      const destPath = path.join(this.originalsDir, sanitizedFile);
      
      try {
        await fs.copyFile(sourcePath, destPath);
        console.log(`📋 Kopierad: ${sanitizedFile}`);
        
        await this.processImage(destPath);
        
      } catch (error) {
        console.error(`❌ Fel vid migrering av ${file}:`, error.message);
      }
    }
    
    console.log('\n✨ Migrering klar!');
  }

  async clean() {
    console.log('🧹 Rensar generated/ mappen...');
    
    try {
      const files = await fs.readdir(this.generatedDir);
      for (const file of files) {
        // Behåll inte screenshots eller logo-mappen
        if (file !== 'screenshots' && file !== 'logo' && file !== '.gitkeep') {
          await fs.unlink(path.join(this.generatedDir, file));
        }
      }
      console.log(`🗑️  Raderade genererade bildvarianter`);
    } catch (error) {
      console.log('📭 generated/ mappen var redan tom');
    }
    
    const metadata = await this.loadMetadata();
    metadata.images = {};
    await this.saveMetadata(metadata);
    
    console.log('✨ Rensning klar!');
  }

  async status() {
    const metadata = await this.loadMetadata();
    const imageCount = Object.keys(metadata.images).length;
    
    console.log('\n📊 FLOCKEN MEDIA BIBLIOTEK STATUS');
    console.log('==================================');
    console.log(`📸 Processerade bilder: ${imageCount}`);
    console.log(`📅 Senast uppdaterad: ${new Date(metadata.lastUpdated).toLocaleString('sv-SE')}`);
    
    if (imageCount > 0) {
      console.log('\n🖼️  BILDER:');
      for (const [key, data] of Object.entries(metadata.images)) {
        const originalSizeKB = Math.round(data.originalSize / 1024);
        const variantCount = Object.keys(data.variants).length;
        console.log(`   ${key}: ${originalSizeKB}KB → ${variantCount} varianter`);
      }
    }
    
    try {
      const originalsFiles = await fs.readdir(this.originalsDir);
      const unprocessed = originalsFiles.filter(file => 
        ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase()) &&
        !metadata.images[this.getImageKey(file)]
      );
      
      if (unprocessed.length > 0) {
        console.log(`\n⚠️  ${unprocessed.length} oprocesserade bilder i _originals/:`);
        unprocessed.forEach(file => console.log(`   - ${file}`));
      } else {
        console.log('\n✅ Alla bilder i _originals/ är processerade');
      }
    } catch (error) {
      console.log('\n📭 _originals/ mappen är tom');
    }
  }
}

// CLI Interface
async function main() {
  const processor = new FlockenImageProcessor();
  const command = process.argv[2];
  const arg = process.argv[3];

  try {
    switch (command) {
      case 'process':
        if (!arg) {
          console.error('❌ Ange bildens sökväg: node scripts/image-processor-flocken.js process [bildväg]');
          process.exit(1);
        }
        await processor.processImage(arg);
        break;
        
      case 'process-all':
        await processor.processAll();
        break;
        
      case 'migrate':
        if (!arg) {
          console.error('❌ Ange källmapp: node scripts/image-processor-flocken.js migrate [från-mapp]');
          process.exit(1);
        }
        await processor.migrateFromDirectory(arg);
        break;
        
      case 'clean':
        await processor.clean();
        break;
        
      case 'status':
        await processor.status();
        break;
        
      default:
        console.log('\n🐕 FLOCKEN - IMAGE PROCESSOR');
        console.log('============================');
        console.log('');
        console.log('Kommandon:');
        console.log('  process [bildväg]     Processar en specifik bild');
        console.log('  process-all          Processar alla bilder i _originals/');
        console.log('  migrate [från-mapp]   Migrerar befintliga bilder');
        console.log('  clean               Rensar generated/ mappen');
        console.log('  status              Visar status på media-biblioteket');
        console.log('');
        console.log('Exempel:');
        console.log('  node scripts/image-processor-flocken.js process public/assets/flocken/_originals/hero.jpg');
        console.log('  node scripts/image-processor-flocken.js process-all');
        console.log('  node scripts/image-processor-flocken.js status');
        console.log('');
        console.log('📁 Mappstruktur:');
        console.log('  public/assets/flocken/_originals/  → Lägg originalbilder här');
        console.log('  public/assets/flocken/generated/   → Optimerade versioner hamnar här');
    }
  } catch (error) {
    console.error('\n❌ Fel:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = FlockenImageProcessor;

