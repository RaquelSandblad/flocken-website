# App Tracking Plan för Flocken (iOS/Android)

**Status:** ⏳ Planerad  
**Prioritet:** Medium  
**Tidsåtgång:** 4-6 timmar (per plattform)

---

## 🎯 Syfte

Implementera Firebase Analytics i Flocken iOS och Android appar för att:
- ✅ Tracka app-användare i samma GA4 property som webb
- ✅ Cross-platform analysis
- ✅ Unified user journey tracking
- ✅ App-specifika events (install, subscription, etc.)

---

## 📱 Arkitektur

```
GA4 Property: Flocken (G-7B1SVKL89Q)
├── Web Data Stream (flocken.info) ✅ LIVE
├── iOS Data Stream (Flocken iOS App) ⏳ Pending
└── Android Data Stream (Flocken Android App) ⏳ Pending
```

**Fördelar:**
- ✅ En GA4 property för alla plattformar
- ✅ Cross-platform analysis i GA4
- ✅ Unified user journey (web → app)
- ✅ Enklare reporting

---

## 📋 iOS Implementation

### **Steg 1: Skapa iOS Data Stream i GA4**

**1.1 Öppna GA4 Admin**
- Gå till: https://analytics.google.com
- Välj property: Flocken (G-7B1SVKL89Q)
- Admin → Data Streams → Add Stream → iOS App

**1.2 Konfigurera Data Stream**
- App Name: Flocken iOS
- Bundle ID: (från iOS app)
- Measurement ID: `G-7B1SVKL89Q` (samma som web)
- Spara

---

### **Steg 2: Firebase Setup**

**2.1 Skapa Firebase Project**
- Gå till: https://console.firebase.google.com
- Skapa nytt projekt eller använd befintligt
- Lägg till iOS app till projektet

**2.2 Konfigurera Firebase Analytics**
- Ladda ner `GoogleService-Info.plist`
- Lägg till i iOS projektet

**2.3 Installera Firebase SDK**
```swift
// Podfile
pod 'Firebase/Analytics'
pod 'Firebase/Core'
```

---

### **Steg 3: Implementera i iOS App**

**3.1 Initialize Firebase**
```swift
import FirebaseCore
import FirebaseAnalytics

// AppDelegate.swift
func application(_ application: UIApplication, 
                didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    FirebaseApp.configure()
    return true
}
```

**3.2 Track Page Views**
```swift
Analytics.logEvent(AnalyticsEventScreenView, parameters: [
    AnalyticsParameterScreenName: "Home",
    AnalyticsParameterScreenClass: "HomeViewController"
])
```

**3.3 Track Custom Events**
```swift
// Sign up
Analytics.logEvent("sign_up", parameters: [
    "method": "email"
])

// App install
Analytics.logEvent("app_install", parameters: [
    "platform": "ios"
])

// Subscription
Analytics.logEvent("purchase", parameters: [
    "transaction_id": transactionId,
    "value": 299.0,
    "currency": "SEK",
    "items": [["item_name": "Premium Subscription"]]
])
```

---

### **Steg 4: Link Firebase → GA4**

**4.1 I Firebase Console**
- Project Settings → Integrations
- Link Firebase project till GA4 property
- Välj property: Flocken (G-7B1SVKL89Q)

**4.2 Verifiera**
- Events från Firebase ska nu synas i GA4
- Testa i GA4 DebugView

---

## 🤖 Android Implementation

### **Steg 1: Skapa Android Data Stream i GA4**

**1.1 Öppna GA4 Admin**
- Gå till: https://analytics.google.com
- Välj property: Flocken (G-7B1SVKL89Q)
- Admin → Data Streams → Add Stream → Android App

**1.2 Konfigurera Data Stream**
- App Name: Flocken Android
- Package Name: (från Android app)
- Measurement ID: `G-7B1SVKL89Q` (samma som web)
- Spara

---

### **Steg 2: Firebase Setup**

**2.1 Lägg till Android App till Firebase**
- Firebase Console → Add App → Android
- Package Name: (från Android app)
- Ladda ner `google-services.json`
- Lägg till i Android projektet

**2.2 Installera Firebase SDK**
```gradle
// build.gradle (Project)
dependencies {
    classpath 'com.google.gms:google-services:4.4.0'
}

// build.gradle (App)
apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation 'com.google.firebase:firebase-analytics'
}
```

---

### **Steg 3: Implementera i Android App**

**3.1 Initialize Firebase**
```kotlin
// Application.kt eller MainActivity.kt
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.ktx.Firebase

class MainActivity : AppCompatActivity() {
    private lateinit var firebaseAnalytics: FirebaseAnalytics
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        firebaseAnalytics = Firebase.analytics
    }
}
```

**3.2 Track Screen Views**
```kotlin
firebaseAnalytics.logEvent(FirebaseAnalytics.Event.SCREEN_VIEW) {
    param(FirebaseAnalytics.Param.SCREEN_NAME, "Home")
    param(FirebaseAnalytics.Param.SCREEN_CLASS, "HomeActivity")
}
```

**3.3 Track Custom Events**
```kotlin
// Sign up
firebaseAnalytics.logEvent("sign_up") {
    param("method", "email")
}

// App install
firebaseAnalytics.logEvent("app_install") {
    param("platform", "android")
}

// Subscription
firebaseAnalytics.logEvent(FirebaseAnalytics.Event.PURCHASE) {
    param(FirebaseAnalytics.Param.TRANSACTION_ID, transactionId)
    param(FirebaseAnalytics.Param.VALUE, 299.0)
    param(FirebaseAnalytics.Param.CURRENCY, "SEK")
    param(FirebaseAnalytics.Param.ITEMS, items)
}
```

---

### **Steg 4: Link Firebase → GA4**

**4.1 I Firebase Console**
- Project Settings → Integrations
- Link Firebase project till GA4 property
- Välj property: Flocken (G-7B1SVKL89Q)

**4.2 Verifiera**
- Events från Firebase ska nu synas i GA4
- Testa i GA4 DebugView

---

## 📊 Events att Tracka

### **Standard Events (Automatiska)**
- `first_open` - App öppnas första gången
- `app_update` - App uppdateras
- `screen_view` - Skärmvisningar

### **Custom Events (Implementera)**
- `sign_up` - Användarregistrering
- `app_install` - App-installation
- `subscription_start` - Premium subscription start
- `subscription_renew` - Premium subscription förnyelse
- `listing_created` - Hundannons skapad
- `message_sent` - Meddelande skickat
- `booking_created` - Bokning skapad
- `booking_confirmed` - Bokning bekräftad

---

## 🔍 Verifiering

### **GA4 DebugView**
1. Öppna GA4 → DebugView
2. Öppna appen på enhet
3. Verifiera att events kommer in i realtid

### **GA4 Realtime Report**
1. Öppna GA4 → Realtime
2. Verifiera att app-användare syns
3. Kontrollera att events trackas korrekt

---

## 📚 Referenser

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [GA4 Mobile App Setup](https://support.google.com/analytics/answer/9304153)
- [Firebase iOS Setup](https://firebase.google.com/docs/ios/setup)
- [Firebase Android Setup](https://firebase.google.com/docs/android/setup)

---

**Nästa steg:** Se `BIGQUERY_EXPORT_PLAN.md` för data export

