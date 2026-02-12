/**
 * Test A/B Test Tracking Code
 * 
 * Detta script testar att tracking-koden är korrekt implementerad
 * genom att simulera vad som skulle hända i webbläsaren.
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing A/B Test Tracking Implementation\n');
console.log('==========================================\n');

const results = {
  experimentTracker: false,
  heroBlockTracking: false,
  heroBlockVariantBTracking: false,
  trackingFunctions: false,
};

// 1. Check ExperimentTracker component
console.log('1. Checking ExperimentTracker component...');
try {
  const trackerPath = path.join(__dirname, '../components/ab-testing/ExperimentTracker.tsx');
  const trackerContent = fs.readFileSync(trackerPath, 'utf8');
  
  if (trackerContent.includes('trackExperimentView')) {
    console.log('   ✅ ExperimentTracker imports trackExperimentView');
    results.experimentTracker = true;
  } else {
    console.log('   ❌ ExperimentTracker does not import trackExperimentView');
  }
  
  if (trackerContent.includes('useABTest')) {
    console.log('   ✅ ExperimentTracker uses useABTest hook');
  } else {
    console.log('   ❌ ExperimentTracker does not use useABTest');
  }
} catch (e) {
  console.log('   ❌ Error reading ExperimentTracker:', e.message);
}

// 2. Check HeroBlock tracking
console.log('\n2. Checking HeroBlock tracking...');
try {
  const heroBlockPath = path.join(__dirname, '../components/marketing/HeroBlock.tsx');
  const heroBlockContent = fs.readFileSync(heroBlockPath, 'utf8');
  
  if (heroBlockContent.includes('trackExperimentCTAClick')) {
    console.log('   ✅ HeroBlock imports trackExperimentCTAClick');
    results.heroBlockTracking = true;
  } else {
    console.log('   ❌ HeroBlock does not import trackExperimentCTAClick');
  }
  
  if (heroBlockContent.includes('useABTest')) {
    console.log('   ✅ HeroBlock uses useABTest hook');
  } else {
    console.log('   ❌ HeroBlock does not use useABTest');
  }
  
  if (heroBlockContent.includes('handleCTAClick')) {
    console.log('   ✅ HeroBlock has handleCTAClick function');
  } else {
    console.log('   ❌ HeroBlock does not have handleCTAClick function');
  }
} catch (e) {
  console.log('   ❌ Error reading HeroBlock:', e.message);
}

// 3. Check HeroBlockVariantB tracking
console.log('\n3. Checking HeroBlockVariantB tracking...');
try {
  const variantBPath = path.join(__dirname, '../components/marketing/HeroBlockVariantB.tsx');
  const variantBContent = fs.readFileSync(variantBPath, 'utf8');
  
  if (variantBContent.includes('trackExperimentCTAClick')) {
    console.log('   ✅ HeroBlockVariantB imports trackExperimentCTAClick');
    results.heroBlockVariantBTracking = true;
  } else {
    console.log('   ❌ HeroBlockVariantB does not import trackExperimentCTAClick');
  }
  
  if (variantBContent.includes('useABTest')) {
    console.log('   ✅ HeroBlockVariantB uses useABTest hook');
  } else {
    console.log('   ❌ HeroBlockVariantB does not use useABTest');
  }
  
  if (variantBContent.includes('handleCTAClick')) {
    console.log('   ✅ HeroBlockVariantB has handleCTAClick function');
  } else {
    console.log('   ❌ HeroBlockVariantB does not have handleCTAClick function');
  }
} catch (e) {
  console.log('   ❌ Error reading HeroBlockVariantB:', e.message);
}

// 4. Check tracking functions exist
console.log('\n4. Checking tracking functions...');
try {
  const trackingPath = path.join(__dirname, '../lib/ab-testing/tracking.ts');
  const trackingContent = fs.readFileSync(trackingPath, 'utf8');
  
  if (trackingContent.includes('export function trackExperimentView')) {
    console.log('   ✅ trackExperimentView function exists');
  } else {
    console.log('   ❌ trackExperimentView function not found');
  }
  
  if (trackingContent.includes('export function trackExperimentCTAClick')) {
    console.log('   ✅ trackExperimentCTAClick function exists');
    results.trackingFunctions = true;
  } else {
    console.log('   ❌ trackExperimentCTAClick function not found');
  }
  
  // Check that it sends to GA4
  if (trackingContent.includes('window.gtag') && trackingContent.includes("'event', 'cta_click'")) {
    console.log('   ✅ trackExperimentCTAClick sends cta_click to GA4');
  } else {
    console.log('   ⚠️  trackExperimentCTAClick may not send cta_click to GA4 correctly');
  }
  
  // Check experiment_impression
  if (trackingContent.includes("'event', 'experiment_impression'")) {
    console.log('   ✅ trackExperimentView sends experiment_impression to GA4');
  } else {
    console.log('   ⚠️  trackExperimentView may not send experiment_impression correctly');
  }
} catch (e) {
  console.log('   ❌ Error reading tracking.ts:', e.message);
}

// 5. Check experiment configuration
console.log('\n5. Checking experiment configuration...');
try {
  const experimentsPath = path.join(__dirname, '../lib/ab-testing/experiments.ts');
  const experimentsContent = fs.readFileSync(experimentsPath, 'utf8');
  
  if (experimentsContent.includes("status: 'running'")) {
    console.log('   ✅ Experiment status is "running"');
  } else {
    console.log('   ⚠️  Experiment status may not be "running"');
  }
  
  if (experimentsContent.includes("'valkommen_hero_v1'")) {
    console.log('   ✅ valkommen_hero_v1 experiment exists');
  } else {
    console.log('   ❌ valkommen_hero_v1 experiment not found');
  }
  
  // Check image paths
  if (experimentsContent.includes('_trbg.png')) {
    console.log('   ✅ Using new transparent background images');
  } else {
    console.log('   ⚠️  May still be using old images (not _trbg.png)');
  }
} catch (e) {
  console.log('   ❌ Error reading experiments.ts:', e.message);
}

// 6. Check page implementation
console.log('\n6. Checking page implementation...');
try {
  const pagePath = path.join(__dirname, '../app/valkommen/page.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf8');
  
  if (pageContent.includes('<ExperimentTracker')) {
    console.log('   ✅ Page uses ExperimentTracker component');
  } else {
    console.log('   ❌ Page does not use ExperimentTracker component');
  }
  
  if (pageContent.includes('HeroBlockVariantB') || pageContent.includes('HeroBlock')) {
    console.log('   ✅ Page uses HeroBlock components');
  } else {
    console.log('   ❌ Page does not use HeroBlock components');
  }
} catch (e) {
  console.log('   ❌ Error reading page.tsx:', e.message);
}

// Summary
console.log('\n📋 Test Summary');
console.log('==========================================');
console.log(`ExperimentTracker: ${results.experimentTracker ? '✅' : '❌'}`);
console.log(`HeroBlock Tracking: ${results.heroBlockTracking ? '✅' : '❌'}`);
console.log(`HeroBlockVariantB Tracking: ${results.heroBlockVariantBTracking ? '✅' : '❌'}`);
console.log(`Tracking Functions: ${results.trackingFunctions ? '✅' : '❌'}`);

const allPassed = Object.values(results).every(r => r === true);

if (allPassed) {
  console.log('\n🎉 All code checks passed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Test in browser: http://localhost:3000/valkommen/test-tracking');
  console.log('   2. Or run test script in browser console');
  console.log('   3. Check Network tab for GA4 requests');
  process.exit(0);
} else {
  console.log('\n⚠️  Some code checks failed. Review the issues above.');
  process.exit(1);
}
