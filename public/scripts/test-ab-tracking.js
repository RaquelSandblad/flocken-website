/**
 * A/B Test Tracking Verification Script
 * 
 * Kör detta script i browser console på /valkommen-sidan för att testa tracking
 * 
 * Usage:
 *   1. Öppna http://localhost:3000/valkommen (eller flocken.info/valkommen)
 *   2. Öppna DevTools → Console
 *   3. Kopiera och klistra in detta script
 *   4. Eller ladda scriptet: <script src="/scripts/test-ab-tracking.js"></script>
 */

(function() {
  console.log('🧪 A/B Test Tracking Verification Script');
  console.log('==========================================\n');

  // Test results
  const results = {
    cookieConsent: false,
    experimentImpression: false,
    ctaClick: false,
    dataLayerEvents: [],
    networkRequests: []
  };

  // 1. Check cookie consent
  function checkCookieConsent() {
    try {
      const consent = JSON.parse(localStorage.getItem('cookie-consent') || '{}');
      results.cookieConsent = consent.analytics === true;
      
      if (results.cookieConsent) {
        console.log('✅ Analytics consent: GRANTED');
      } else {
        console.log('❌ Analytics consent: DENIED');
        console.log('   ⚠️  Events kommer INTE skickas utan analytics consent!');
        console.log('   💡 Acceptera analytics cookies i cookie-bannern');
      }
      return results.cookieConsent;
    } catch (e) {
      console.log('❌ Error checking cookie consent:', e);
      return false;
    }
  }

  // 2. Check experiment assignment
  function checkExperimentAssignment() {
    try {
      const cookie = document.cookie.split(';').find(c => c.includes('flocken_ab_assignments'));
      if (cookie) {
        const value = cookie.split('=')[1];
        const assignments = JSON.parse(decodeURIComponent(value));
        console.log('📊 Experiment assignments:', assignments);
        
        const variant = assignments['valkommen_hero_v1'];
        if (variant) {
          console.log(`✅ Variant assigned: ${variant}`);
          return variant;
        } else {
          console.log('⚠️  No variant assigned for valkommen_hero_v1');
          return null;
        }
      } else {
        console.log('⚠️  No AB test cookie found');
        return null;
      }
    } catch (e) {
      console.log('❌ Error checking experiment assignment:', e);
      return null;
    }
  }

  // 3. Monitor dataLayer
  function monitorDataLayer() {
    if (!window.dataLayer) {
      console.log('❌ dataLayer not found');
      return;
    }

    console.log('\n📡 Monitoring dataLayer events...');
    
    // Intercept dataLayer.push
    const originalPush = window.dataLayer.push;
    window.dataLayer.push = function(...args) {
      const event = args[0];
      if (typeof event === 'object' && event.event) {
        if (event.event === 'experiment_impression') {
          results.experimentImpression = true;
          console.log('✅ experiment_impression event detected:', event);
        }
        if (event.event === 'cta_click') {
          results.ctaClick = true;
          console.log('✅ cta_click event detected:', event);
        }
        results.dataLayerEvents.push(event);
      }
      return originalPush.apply(this, args);
    };

    // Check existing events
    window.dataLayer.forEach(event => {
      if (typeof event === 'object' && event.event) {
        if (event.event === 'experiment_impression') {
          results.experimentImpression = true;
          console.log('✅ experiment_impression found in existing dataLayer:', event);
        }
        if (event.event === 'cta_click') {
          results.ctaClick = true;
          console.log('✅ cta_click found in existing dataLayer:', event);
        }
        results.dataLayerEvents.push(event);
      }
    });
  }

  // 4. Monitor network requests
  function monitorNetworkRequests() {
    console.log('\n🌐 Monitoring network requests...');
    
    // This will only work if Performance API is available
    if (window.performance && window.performance.getEntriesByType) {
      const entries = window.performance.getEntriesByType('resource');
      const gaRequests = entries.filter(e => 
        e.name.includes('google-analytics') || 
        e.name.includes('collect') ||
        e.name.includes('gtm')
      );
      
      if (gaRequests.length > 0) {
        console.log(`✅ Found ${gaRequests.length} GA/GTM requests`);
        gaRequests.forEach(req => {
          results.networkRequests.push(req.name);
        });
      } else {
        console.log('⚠️  No GA/GTM requests found yet');
      }
    }
  }

  // 5. Test CTA click
  function testCTAClick() {
    console.log('\n🖱️  Testing CTA click...');
    
    // Find CTA buttons
    const ctaButtons = document.querySelectorAll('a[href*="/download"], a[href*="play.google.com"], a[href*="apps.apple.com"]');
    
    if (ctaButtons.length === 0) {
      console.log('⚠️  No CTA buttons found on page');
      return;
    }

    console.log(`Found ${ctaButtons.length} CTA button(s)`);
    
    // Click first button (but prevent navigation)
    const firstButton = ctaButtons[0];
    console.log('Clicking button:', firstButton.textContent.trim());
    
    // Create a test click event
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    // Prevent default navigation
    firstButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('✅ CTA click intercepted (navigation prevented)');
    }, { once: true });
    
    firstButton.dispatchEvent(clickEvent);
    
    // Wait a bit for event to fire
    setTimeout(() => {
      if (results.ctaClick) {
        console.log('✅ cta_click event was triggered!');
      } else {
        console.log('⚠️  cta_click event not detected yet');
        console.log('   Check if onClick handler is working');
      }
    }, 500);
  }

  // 6. Generate report
  function generateReport() {
    console.log('\n📋 Test Report');
    console.log('==========================================');
    console.log(`Cookie Consent: ${results.cookieConsent ? '✅' : '❌'}`);
    console.log(`Experiment Impression: ${results.experimentImpression ? '✅' : '❌'}`);
    console.log(`CTA Click: ${results.ctaClick ? '✅' : '❌'}`);
    console.log(`DataLayer Events Found: ${results.dataLayerEvents.length}`);
    console.log(`Network Requests: ${results.networkRequests.length}`);
    
    console.log('\n📊 All DataLayer Events:');
    results.dataLayerEvents.forEach((event, i) => {
      console.log(`${i + 1}. ${event.event || 'unknown'}:`, event);
    });

    // Summary
    const allPassed = results.cookieConsent && results.experimentImpression && results.ctaClick;
    
    if (allPassed) {
      console.log('\n🎉 All tests passed! Tracking is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Check the issues above.');
      
      if (!results.cookieConsent) {
        console.log('\n💡 Fix: Accept analytics cookies in cookie banner');
      }
      if (!results.experimentImpression) {
        console.log('\n💡 Fix: Check that ExperimentTracker component is mounted');
        console.log('   Check: lib/ab-testing/experiments.ts has status: "running"');
      }
      if (!results.ctaClick) {
        console.log('\n💡 Fix: Click a CTA button manually and check console');
        console.log('   Check: HeroBlock components have onClick handlers');
      }
    }
  }

  // Run tests
  console.log('Running tests...\n');
  
  checkCookieConsent();
  const variant = checkExperimentAssignment();
  monitorDataLayer();
  monitorNetworkRequests();
  
  // Wait a bit for page to fully load
  setTimeout(() => {
    testCTAClick();
    
    // Generate report after a delay
    setTimeout(() => {
      generateReport();
    }, 1000);
  }, 1000);

  // Export results for manual inspection
  window.abTestResults = results;
  console.log('\n💾 Results saved to window.abTestResults');
  console.log('   Run: console.log(window.abTestResults) to see full results');
})();
