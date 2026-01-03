(function() {
  'use strict';

  // Cookie banner HTML - Modal design som blockerar hela sidan
  // Anpassad för Flocken med Flockens färgschema
  const bannerHTML = `
    <div id="custom-cookie-banner" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(62, 59, 50, 0.85);
      z-index: 999999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    ">
      <div style="
        background: #F5F1E8;
        border: 3px solid #6B7A3A;
        border-radius: 12px;
        padding: 30px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(62, 59, 50, 0.5);
      ">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="margin: 0 0 12px 0; color: #3E3B32; font-size: 24px; font-weight: 700;">
            Cookie-inställningar
          </h2>
          <p style="margin: 0; color: #3E3B32; font-size: 16px; line-height: 1.5;">
            Vi använder cookies för att förbättra din upplevelse. Välj vilka kategorier du tillåter:
          </p>
        </div>

        <!-- Cookie kategorier -->
        <div style="margin-bottom: 25px;">

          <!-- Nödvändiga cookies -->
          <div style="
            background: #FFFFFF;
            border: 2px solid #6B7A3A;
            border-radius: 8px;
            padding: 18px;
            margin-bottom: 16px;
          ">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <h3 style="margin: 0; color: #3E3B32; font-size: 18px; font-weight: 600;">
                Nödvändiga cookies
              </h3>
              <label style="
                position: relative;
                display: inline-block;
                width: 60px;
                height: 30px;
              ">
                <input type="checkbox" id="necessary-toggle" checked disabled style="opacity: 0; width: 0; height: 0;">
                <span style="
                  position: absolute;
                  cursor: not-allowed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: #6B7A3A;
                  transition: .4s;
                  border-radius: 30px;
                ">
                  <span style="
                    position: absolute;
                    content: '';
                    height: 22px;
                    width: 22px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                    transform: translateX(30px);
                  "></span>
                </span>
              </label>
            </div>
            <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">
              Krävs för webbplatsens grundfunktioner som navigering och säkerhet. <strong>Kan inte stängas av.</strong>
            </p>
          </div>

          <!-- Analys cookies -->
          <div style="
            background: #FFFFFF;
            border: 2px solid #6B7A3A;
            border-radius: 8px;
            padding: 18px;
            margin-bottom: 16px;
          ">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <h3 style="margin: 0; color: #3E3B32; font-size: 18px; font-weight: 600;">
                Analys cookies
              </h3>
              <label style="
                position: relative;
                display: inline-block;
                width: 60px;
                height: 30px;
              ">
                <input type="checkbox" id="analytics-toggle" checked style="opacity: 0; width: 0; height: 0;">
                <span class="toggle-slider" style="
                  position: absolute;
                  cursor: pointer;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: #A29D89;
                  transition: .4s;
                  border-radius: 30px;
                ">
                  <span class="toggle-button" style="
                    position: absolute;
                    content: '';
                    height: 22px;
                    width: 22px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                    transform: translateX(0px);
                  "></span>
                </span>
              </label>
            </div>
            <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">
              Google Analytics och liknande verktyg som hjälper oss förstå hur webbplatsen används. Data är anonymiserad.
            </p>
          </div>

          <!-- Marknadsföring cookies -->
          <div style="
            background: #FFFFFF;
            border: 2px solid #6B7A3A;
            border-radius: 8px;
            padding: 18px;
            margin-bottom: 0;
          ">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <h3 style="margin: 0; color: #3E3B32; font-size: 18px; font-weight: 600;">
                Marknadsföring cookies
              </h3>
              <label style="
                position: relative;
                display: inline-block;
                width: 60px;
                height: 30px;
              ">
                <input type="checkbox" id="marketing-toggle" checked style="opacity: 0; width: 0; height: 0;">
                <span class="toggle-slider" style="
                  position: absolute;
                  cursor: pointer;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: #A29D89;
                  transition: .4s;
                  border-radius: 30px;
                ">
                  <span class="toggle-button" style="
                    position: absolute;
                    content: '';
                    height: 22px;
                    width: 22px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                    transform: translateX(0px);
                  "></span>
                </span>
              </label>
            </div>
            <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">
              Facebook Pixel, Google Ads och andra verktyg för riktad marknadsföring och konverteringsspårning.
            </p>
          </div>
        </div>

        <!-- Knappar -->
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button id="cookie-decline-all" style="
            background: transparent;
            color: #A29D89;
            border: 3px solid #A29D89;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
            transition: all 0.3s ease;
            font-size: 16px;
            min-width: 120px;
          ">Avvisa</button>
          <button id="cookie-accept-selected" style="
            background: #6B7A3A;
            color: #F5F1E8;
            border: 3px solid #6B7A3A;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
            transition: all 0.3s ease;
            font-size: 16px;
            min-width: 120px;
          ">Spara val</button>
          <button id="cookie-accept-all" style="
            background: #6B7A3A;
            color: #F5F1E8;
            border: 3px solid #6B7A3A;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
            transition: all 0.3s ease;
            font-size: 16px;
            min-width: 120px;
          ">Tillåt alla</button>
        </div>

        <div style="text-align: center; margin-top: 15px;">
          <small style="color: #666; font-size: 13px;">
            Du måste göra ett val för att fortsätta använda webbplatsen
          </small>
        </div>
      </div>
    </div>

    <!-- Förenklad modal för cookie policy page -->
    <div id="cookie-settings-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(62, 59, 50, 0.85);
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    ">
      <div style="
        background: #F5F1E8;
        border: 3px solid #6B7A3A;
        border-radius: 12px;
        padding: 24px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(62, 59, 50, 0.5);
      ">
        <h2 style="margin: 0 0 16px 0; color: #3E3B32;">Ändra cookie-inställningar</h2>
        <p style="margin: 0 0 20px 0; color: #3E3B32;">Ändra dina cookie-inställningar:</p>
        
        <div style="margin-bottom: 16px; padding: 12px; background: #FFFFFF; border-radius: 6px;">
          <label style="display: flex; align-items: center; justify-content: space-between; color: #3E3B32; margin-bottom: 8px;">
            <div>
              <strong>Nödvändiga cookies</strong>
              <div style="font-size: 13px; color: #666; margin-top: 4px;">Krävs för webbplatsens grundfunktioner.</div>
            </div>
            <input type="checkbox" id="modal-necessary" checked disabled style="transform: scale(1.3);">
          </label>
        </div>

        <div style="margin-bottom: 16px; padding: 12px; background: #FFFFFF; border-radius: 6px;">
          <label style="display: flex; align-items: center; justify-content: space-between; color: #3E3B32; margin-bottom: 8px;">
            <div>
              <strong>Analys cookies</strong>
              <div style="font-size: 13px; color: #666; margin-top: 4px;">Google Analytics för användningsstatistik.</div>
            </div>
            <input type="checkbox" id="modal-analytics" style="transform: scale(1.3);">
          </label>
        </div>

        <div style="margin-bottom: 20px; padding: 12px; background: #FFFFFF; border-radius: 6px;">
          <label style="display: flex; align-items: center; justify-content: space-between; color: #3E3B32; margin-bottom: 8px;">
            <div>
              <strong>Marknadsföring cookies</strong>
              <div style="font-size: 13px; color: #666; margin-top: 4px;">För riktad marknadsföring och annonser.</div>
            </div>
            <input type="checkbox" id="modal-marketing" style="transform: scale(1.3);">
          </label>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button id="modal-close" style="
            background: transparent;
            color: #3E3B32;
            border: 2px solid #3E3B32;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          ">Stäng</button>
          <button id="modal-save-settings" style="
            background: #6B7A3A;
            color: #F5F1E8;
            border: 2px solid #6B7A3A;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          ">Spara inställningar</button>
        </div>
      </div>
    </div>
  `;

  // Cookie management functions
  function getCookieConsent() {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      try {
        return JSON.parse(consent);
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }
    return null;
  }

  function createConsentObject(necessary, analytics, marketing) {
    return {
      necessary: necessary, // Always true
      analytics: analytics,
      marketing: marketing,
      timestamp: Date.now()
    };
  }

  function saveConsentToStorage(consent) {
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    console.log('Cookie banner: Consent saved:', consent);
  }

  function updateGTMConsent(analytics, marketing) {
    if (typeof window.dataLayer === 'undefined') {
      console.warn('GTM: dataLayer not available');
      return;
    }

    const consentUpdate = {
      event: 'consent_update',
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
      functionality_storage: 'granted', // Always granted for necessary
      security_storage: 'granted' // Always granted for necessary
    };

    window.dataLayer.push(consentUpdate);
    console.log('GTM: Consent updated via dataLayer:', consentUpdate);
  }

  function trackConsentChoice(analytics, marketing) {
    if (typeof window.dataLayer === 'undefined') {
      return;
    }

    let consentLabel = 'partial_accepted';
    if (analytics && marketing) {
      consentLabel = 'all_accepted';
    } else if (!analytics && !marketing) {
      consentLabel = 'all_declined';
    }

    window.dataLayer.push({
      event: 'consent_choice',
      event_category: 'cookie_consent',
      event_label: consentLabel,
      analytics_consent: analytics,
      marketing_consent: marketing,
      page_path: window.location.pathname
    });

    console.log('GTM: Consent choice tracked via dataLayer');
  }

  function saveConsent(necessary = true, analytics = false, marketing = false) {
    const consent = createConsentObject(necessary, analytics, marketing);
    saveConsentToStorage(consent);
    updateGTMConsent(analytics, marketing);
    trackConsentChoice(analytics, marketing);
    
    // CRITICAL: Block or allow tracking based on consent
    // This prevents cookies/data from being saved if user declines
    if (!analytics) {
      // Block analytics tracking
      blockAnalyticsTracking();
    }
    if (!marketing) {
      // Block marketing tracking
      blockMarketingTracking();
    } else {
      // Allow Meta Pixel if marketing consent is granted
      if (typeof window.fbq !== 'undefined') {
        window.fbq('consent', 'grant');
        // Track PageView if pixel is ready
        window.fbq('track', 'PageView');
      }
    }
    
    // Dispatch custom event for Meta Pixel and other tracking
    if (typeof window !== 'undefined') {
      const consentEvent = new CustomEvent('consentchange', {
        detail: {
          necessary: necessary,
          analytics: analytics,
          marketing: marketing
        }
      });
      window.dispatchEvent(consentEvent);
    }
    
    hideBanner();
    hideModal();
  }

  // Block analytics tracking if user declines
  function blockAnalyticsTracking() {
    // Block Google Analytics if it exists
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    
    // Block GA4 via dataLayer (if GTM is used)
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        'event': 'consent_update',
        'analytics_storage': 'denied'
      });
    }
    
    // Remove GA cookies if they exist - CRITICAL for GDPR compliance
    if (typeof document !== 'undefined') {
      const gaCookies = ['_ga', '_ga_', '_gid', '_gat', '_gat_gtag_'];
      const hostname = window.location.hostname;
      const domainParts = hostname.split('.');
      
      gaCookies.forEach(cookieName => {
        // Remove cookies matching pattern from all possible domains
        document.cookie.split(';').forEach(cookie => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          if (name.startsWith(cookieName)) {
            // Try multiple domain variations
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + hostname;
            if (domainParts.length > 1) {
              document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + hostname;
              document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + domainParts.slice(-2).join('.');
            }
          }
        });
      });
      
      // Remove GA data from localStorage/sessionStorage
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('_ga') || key.startsWith('ga_')) {
            localStorage.removeItem(key);
          }
        });
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('_ga') || key.startsWith('ga_')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn('Could not clear GA storage:', e);
      }
      
      console.log('Cookie banner: Analytics cookies and storage blocked and removed');
    }
  }

  // Block marketing tracking if user declines
  function blockMarketingTracking() {
    // Block Meta Pixel if it exists
    if (typeof window.fbq !== 'undefined') {
      window.fbq('consent', 'revoke');
    }
    
    // Remove marketing cookies - CRITICAL for GDPR compliance
    if (typeof document !== 'undefined') {
      const marketingCookies = ['_fbp', 'fr', '_fbc', 'sb'];
      const hostname = window.location.hostname;
      const domainParts = hostname.split('.');
      
      marketingCookies.forEach(cookieName => {
        // Try multiple domain variations
        document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + hostname;
        if (domainParts.length > 1) {
          document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + hostname;
          document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + domainParts.slice(-2).join('.');
        }
      });
      
      // Remove Meta/Facebook data from localStorage/sessionStorage
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('_fbp') || key.startsWith('fb_') || key.includes('facebook')) {
            localStorage.removeItem(key);
          }
        });
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('_fbp') || key.startsWith('fb_') || key.includes('facebook')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn('Could not clear Meta storage:', e);
      }
      
      console.log('Cookie banner: Marketing cookies and storage blocked and removed');
    }
  }

  function hideBanner() {
    const banner = document.getElementById('custom-cookie-banner');
    if (banner) banner.style.display = 'none';
    // Re-enable page scrolling
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-modal-open');
    }
  }

  function hideModal() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) modal.style.display = 'none';
    // Re-enable page scrolling
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-modal-open');
    }
  }

  function showModal() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
      modal.style.display = 'flex';
      updateModalCheckboxes();
      // Disable page scrolling
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-modal-open', '');
      }
    }
  }

  function updateToggleStates() {
    const consent = getCookieConsent();
    if (consent) {
      // Update banner toggles
      const analyticsToggle = document.getElementById('analytics-toggle');
      const marketingToggle = document.getElementById('marketing-toggle');

      if (analyticsToggle) {
        analyticsToggle.checked = consent.analytics;
        // Force CSS update
        updateToggleDisplay(analyticsToggle);
      }
      if (marketingToggle) {
        marketingToggle.checked = consent.marketing;
        // Force CSS update
        updateToggleDisplay(marketingToggle);
      }
    }
  }

  function updateToggleDisplay(toggleInput) {
    if (!toggleInput) return;

    const slider = toggleInput.nextElementSibling;
    const button = slider ? slider.querySelector('.toggle-button') : null;

    if (slider && button) {
      if (toggleInput.checked) {
        slider.style.backgroundColor = '#6B7A3A';
        button.style.transform = 'translateX(30px)';
      } else {
        slider.style.backgroundColor = '#A29D89';
        button.style.transform = 'translateX(0px)';
      }
    }
  }

  function updateModalCheckboxes() {
    const consent = getCookieConsent();
    if (consent) {
      const modalAnalytics = document.getElementById('modal-analytics');
      const modalMarketing = document.getElementById('modal-marketing');

      if (modalAnalytics) modalAnalytics.checked = consent.analytics;
      if (modalMarketing) modalMarketing.checked = consent.marketing;
    }
  }

  // Button handlers
  function acceptAllCookies() {
    saveConsent(true, true, true);
  }

  function declineAllCookies() {
    saveConsent(true, false, false);
  }

  function saveSelectedCookies() {
    const analyticsToggle = document.getElementById('analytics-toggle');
    const marketingToggle = document.getElementById('marketing-toggle');

    const analytics = analyticsToggle ? analyticsToggle.checked : false;
    const marketing = marketingToggle ? marketingToggle.checked : false;

    saveConsent(true, analytics, marketing);
  }

  function saveModalSettings() {
    const modalAnalytics = document.getElementById('modal-analytics');
    const modalMarketing = document.getElementById('modal-marketing');

    const analytics = modalAnalytics ? modalAnalytics.checked : false;
    const marketing = modalMarketing ? modalMarketing.checked : false;

    saveConsent(true, analytics, marketing);
  }

  function addBannerToPage() {
    document.body.insertAdjacentHTML('beforeend', bannerHTML);
  }

  function addToggleStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Base toggle styling */
      .toggle-slider {
        transition: background-color 0.4s ease !important;
      }
      .toggle-button {
        transition: transform 0.4s ease !important;
      }

      /* Toggle checked state - button slides to RIGHT (active) */
      input[type="checkbox"]:checked + .toggle-slider {
        background-color: #6B7A3A !important;
      }
      input[type="checkbox"]:checked + .toggle-slider .toggle-button {
        transform: translateX(30px) !important;
      }

      /* Toggle unchecked state - button slides to LEFT (inactive) */
      input[type="checkbox"]:not(:checked) + .toggle-slider {
        background-color: #A29D89 !important;
      }
      input[type="checkbox"]:not(:checked) + .toggle-slider .toggle-button {
        transform: translateX(0px) !important;
      }

      .toggle-slider:hover {
        opacity: 0.9 !important;
      }

      /* Button hover effects - Flocken färger */
      #cookie-decline-all:hover {
        background-color: #A29D89 !important;
        color: #F5F1E8 !important;
      }
      #cookie-accept-selected:hover,
      #cookie-accept-all:hover,
      #modal-save-settings:hover {
        background-color: #8BA45D !important;
      }
      #modal-close:hover {
        background-color: #A29D89 !important;
        color: #F5F1E8 !important;
      }

      /* Prevent page scroll when modal is open - using CSS custom property */
      html {
        --modal-scroll: initial;
      }
      html[data-modal-open] {
        --modal-scroll: hidden;
      }
      body {
        overflow: var(--modal-scroll);
      }
    `;
    document.head.appendChild(style);
  }

  function handleExistingConsent() {
    const consent = getCookieConsent();
    if (!consent) {
      // NO CONSENT - Block all tracking from start
      blockAllTracking();
      return false; // No existing consent
    }

    // Apply existing consent to GTM immediately
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'consent_update',
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
      });
    }

    // If user previously declined, ensure tracking is still blocked
    if (!consent.analytics) {
      blockAnalyticsTracking();
    }
    if (!consent.marketing) {
      blockMarketingTracking();
    } else {
      // Allow Meta Pixel if marketing consent was previously granted
      if (typeof window.fbq !== 'undefined') {
        window.fbq('consent', 'grant');
      }
    }

    console.log('Cookie banner: Existing consent found:', consent);
    return true; // Existing consent found
  }

  // Block ALL tracking until user gives consent
  function blockAllTracking() {
    // Ensure dataLayer has denied state - CRITICAL: This prevents GTM/GA4 from tracking
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        'event': 'consent_update',
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'functionality_storage': 'granted',
        'security_storage': 'granted'
      });
    }

    // Block Google Analytics if it exists
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }

    // Block Meta Pixel if it exists
    if (typeof window.fbq !== 'undefined') {
      window.fbq('consent', 'revoke');
    }

    // IMPORTANT: Tracking scripts (GTM, GA4, Meta Pixel) should ONLY be loaded
    // AFTER user has given consent. If loaded before consent, they will respect
    // the 'denied' state set above, but best practice is to load them dynamically
    // after consent is granted.
  }

  function showBannerIfNeeded() {
    const banner = document.getElementById('custom-cookie-banner');
    if (banner) {
      banner.style.display = 'flex';
      // Disable page scrolling using html data attribute (no hydration issues)
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-modal-open', '');
      }
    }
    console.log('Cookie banner: No consent found, showing MODAL banner (blocks page)');
  }

  function setupEventListeners() {
    // Main banner buttons
    document.getElementById('cookie-decline-all')?.addEventListener('click', declineAllCookies);
    document.getElementById('cookie-accept-selected')?.addEventListener('click', saveSelectedCookies);
    document.getElementById('cookie-accept-all')?.addEventListener('click', acceptAllCookies);
    
    // Toggle change listeners for immediate visual feedback
    document.getElementById('analytics-toggle')?.addEventListener('change', function() {
      updateToggleDisplay(this);
    });
    document.getElementById('marketing-toggle')?.addEventListener('change', function() {
      updateToggleDisplay(this);
    });

    // Modal buttons
    document.getElementById('modal-save-settings')?.addEventListener('click', saveModalSettings);
    document.getElementById('modal-close')?.addEventListener('click', hideModal);
    
    // Close modal on background click
    document.getElementById('cookie-settings-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'cookie-settings-modal') {
        hideModal();
      }
    });
  }

  function initializeToggleStates() {
    updateToggleStates();
    updateModalCheckboxes();

    // Initialize toggle displays for default state (all checked)
    setTimeout(() => {
      const analyticsToggle = document.getElementById('analytics-toggle');
      const marketingToggle = document.getElementById('marketing-toggle');
      if (analyticsToggle) updateToggleDisplay(analyticsToggle);
      if (marketingToggle) updateToggleDisplay(marketingToggle);
    }, 100);
  }

  // Initialize - simplified main function
  function init() {
    // CRITICAL: Block all tracking FIRST before doing anything else
    // This ensures no cookies/data is saved if user hasn't consented
    const consent = getCookieConsent();
    if (!consent) {
      // No consent yet - block everything
      blockAllTracking();
    }
    
    addBannerToPage();
    addToggleStyles();
    
    const hasExistingConsent = handleExistingConsent();
    if (!hasExistingConsent) {
      showBannerIfNeeded();
    }
    
    setupEventListeners();
    initializeToggleStates();
  }

  // Make show function available globally for cookie policy page
  window.showCookieSettings = function() {
    showModal();
  };

  // Initialize when DOM is ready and after potential React hydration
  function safeInit() {
    // Double-check we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Wait extra frame to ensure React hydration is complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        init();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
  } else {
    safeInit();
  }

})();

