/**
 * HerCare AI — i18n translations
 * Usage: t('key', language)
 * Languages: 'en' | 'ur'
 */

const translations = {
  en: {
    // Navbar / general
    simpact: "SIMPACT '26",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",

    // Dashboard
    welcomeBack: "Welcome back",
    dashboardGreeting: "Assalam-o-Alaikum",
    dashboardSubtitle: "Your personal health companion. Use our AI modules to take care of your health.",
    editName: "Edit Name",
    save: "Save",
    platformSubmission: "Platform Submission",
    platformOrg: "Aga Khan University – CIME",
    dailyTip: "Daily Health Tip",
    tipLabel: "Sehat ka mashwara",

    // Health Score
    healthScore: "Health Score",
    healthScoreSubtitle: "Based on your last assessment",
    healthScoreEmpty: "No assessment yet",
    healthScoreEmptyHint: "Complete a Risk Screening to see your score",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    needsAttention: "Needs Attention",
    lastAssessed: "Last assessed",
    topRisk: "Highest risk",
    runAssessment: "Run Assessment",
    viewReport: "View Report",

    // Quick action cards
    riskScreening: "Risk Screening",
    riskScreeningDesc: "Assess your risk for PCOS, thyroid, anemia, endometriosis, and menstrual irregularities.",
    startScreening: "Start Screening",
    reportExplainer: "Report Explainer",
    reportExplainerDesc: "Upload prescriptions or reports (CBC, Thyroid etc.) and get a plain-language summary.",
    explainReport: "Explain Report",
    recoveryAssistant: "Recovery Assistant",
    recoveryAssistantDesc: "Track post-discharge check-ins, medicine schedules and get alerts for warning signs.",
    trackRecovery: "Track Recovery",
    symptomDictionary: "Symptom Dictionary",
    browseConditions: "Browse 12 conditions",
    healthLibrary: "Health Library",
    browseLibrary: "Browse 12 conditions in detail",

    // Disclaimer
    disclaimer: "Important Notice: HerCare AI is for health awareness only and does not provide medical diagnosis. Always consult a qualified healthcare provider.",

    // Sidebar
    dashboard: "Dashboard",
    assessment: "Risk Assessment",
    symptomChecker: "Symptom Checker",
    reportExplainerNav: "Report Explainer",
    healthLibraryNav: "Health Library",
    recoveryAssistantNav: "Recovery Assistant",
    aiChat: "AI Chat",
    geminiKeyLabel: "Gemini API Key:",
    geminiKeyHint: "Stores locally. Fallback mock used if blank.",
    signOut: "Sign out",

    // Auth
    signIn: "Sign In",
    createAccount: "Create Account",
    fullName: "Full Name",
    emailAddress: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    demoAccount: "Use demo account",
    dataPrivacy: "Your data stays on your device. HerCare AI does not store health data on external servers.",

    // Health tips
    tips: [
      "Iron supplements absorb better with Vitamin C (like orange juice) — helping treat anemia faster.",
      "In PCOS, low-glycemic foods (vegetables, lentils) help control weight and stabilize insulin.",
      "Avoid tea or coffee immediately after meals — they block iron absorption significantly.",
      "During recovery, avoid heavy lifting to protect internal stitches and aid healing.",
      "Always get your TSH test done in the morning on an empty stomach for accurate results.",
      "Vitamin D deficiency is very common in Pakistan — 15–20 minutes of morning sunlight helps.",
      "Drinking enough water (8+ glasses/day) is one of the best ways to prevent UTIs.",
      "Tracking your cycle monthly helps detect irregularities and hormonal patterns early.",
    ],
  },

  ur: {
    // Navbar / general
    simpact: "SIMPACT '26",
    goodMorning: "Subh bakhair",
    goodAfternoon: "Dopahar bakhair",
    goodEvening: "Shaam bakhair",

    // Dashboard
    welcomeBack: "Khush aamdeed",
    dashboardGreeting: "Assalam-o-Alaikum",
    dashboardSubtitle: "Aapka personal health companion. Hamare AI modules ke zariye apni sehat ka khayal rakhein.",
    editName: "Naam badlein",
    save: "Save karein",
    platformSubmission: "Platform Submission",
    platformOrg: "Aga Khan University – CIME",
    dailyTip: "Rozana Sehat ka Mashwara",
    tipLabel: "Sehat ka mashwara",

    // Health Score
    healthScore: "Sehat Score",
    healthScoreSubtitle: "Aakhri assessment ke mutabiq",
    healthScoreEmpty: "Koi assessment nahi hui",
    healthScoreEmptyHint: "Apna score dekhne ke liye Risk Screening karein",
    excellent: "Behtareen",
    good: "Acha",
    fair: "Theek",
    needsAttention: "توجہ کی ضرورت",
    lastAssessed: "Aakhri baar jaancha",
    topRisk: "Zyada khatre wali bimari",
    runAssessment: "Assessment karein",
    viewReport: "Report dekhein",

    // Quick action cards
    riskScreening: "Risk Jaanch",
    riskScreeningDesc: "PCOS, thyroid, khoon ki kami, endometriosis aur periods ki bemariyon ka khatre ka andaza lagayein.",
    startScreening: "Screening shuru karein",
    reportExplainer: "Report Samjhaiye",
    reportExplainerDesc: "Nuskhay ya reports (CBC, Thyroid wagera) upload karein aur Roman Urdu mein wazahat haasil karein.",
    explainReport: "Report samjhayein",
    recoveryAssistant: "Sehat Yaabi Assistant",
    recoveryAssistantDesc: "Discharge ke baad check-ins, dawaon ka schedule track karein aur khatarnak signs par alerts paayein.",
    trackRecovery: "Sehat track karein",
    symptomDictionary: "Alamaat ka Dictionary",
    browseConditions: "12 bemariyan dekhein",
    healthLibrary: "Sehat Library",
    browseLibrary: "12 bemariyan tafseel se dekhein",

    // Disclaimer
    disclaimer: "Zaroori notice: HerCare AI sirf sehat ki awareness ke liye hai aur medical diagnosis nahi deta. Hamesha ek qualified doctor se milein.",

    // Sidebar
    dashboard: "Dashboard",
    assessment: "Risk Assessment",
    symptomChecker: "Alamaat Checker",
    reportExplainerNav: "Report Samjhaiye",
    healthLibraryNav: "Sehat Library",
    recoveryAssistantNav: "Sehat Yaabi Assistant",
    aiChat: "AI Chat",
    geminiKeyLabel: "Gemini API Key:",
    geminiKeyHint: "Locally save hota hai. Blank rehne par mock use hoga.",
    signOut: "Sign out karein",

    // Auth
    signIn: "Darj ho jayein",
    createAccount: "Account banayein",
    fullName: "Poora Naam",
    emailAddress: "Email Address",
    password: "Password",
    confirmPassword: "Password dobara likhein",
    demoAccount: "Demo account use karein",
    dataPrivacy: "Aapka data aapke device par rehta hai. HerCare AI sehat ka data baahir nahi bhejta.",

    // Health tips (Roman Urdu)
    tips: [
      "Iron supplements ko Vitamin C (jaise Orange Juice) ke sath lene se khoon ki kami jaldi door hoti hai.",
      "PCOS mein low-glycemic foods (sabziyan, daalein) weight control karne aur insulin levels normal rakhne mein madad karte hain.",
      "Khana khane ke foran baad Chai ya Coffee peene se parhez karein — yeh iron absorb nahi hone dete.",
      "Recovery period mein heavy lifting se parhez karein taake andar ki stitches safe rahein.",
      "TSH test hamesha subh khali pait karwayein taake thyroid levels ki sahi report aaye.",
      "Pakistan mein Vitamin D ki kami bahut aam hai — subh ki 15-20 minute ki dhoop bahut faida deti hai.",
      "Roz 8+ gilas paani peena UTI se bachne ka sab se acha tarika hai.",
      "Apna cycle har maah track karein taake hormonal patterns aur irregularities jaldi pata chalein.",
    ],
  },
};

/**
 * Translate a key into the current language.
 * Falls back to English if key missing in target language.
 */
export function t(key, lang = 'en') {
  return translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
}

export default translations;

// ── Extended translations for all components ──────────────────────────────────
const extended = {
  en: {
    // SymptomChecker
    loadingConditions: "Loading health awareness guide...",
    searchPlaceholder: "Search symptoms (e.g. fatigue, irregular periods, hair loss...)",
    conditionsLabel: "Conditions",
    noConditionsMatch: "No conditions match your search.",
    clinicalInfo: "Clinical Information & Awareness",
    urduExplanation: "Roman Urdu Explanation (Khulasa)",
    associatedSymptoms: "Associated Symptoms (Alamaat)",
    urgencyDetails: "Urgency Details:",
    lifestyleTips: "Lifestyle Tips (Parhez & Mashwara):",
    selectCondition: "Select a condition to view details",
    symptomDisclaimer: "This information is for awareness only and is not a diagnosis. Please consult your doctor for proper medical advice.",

    // HealthQuestionnaire
    step1Label: "Step 1: Vital Stats & Habits",
    step2Label: "Step 2: Symptoms Selection",
    step3Label: "Step 3: AI Results",
    ageLabel: "Age (Umar)",
    weightLabel: "Weight (Wazan) in kg",
    heightLabel: "Height (Qad) in cm",
    cycleLengthLabel: "Cycle Length (Days)",
    cycleRegularityLabel: "Cycle Regularity (Periods ka pattern)",
    exerciseLabel: "I exercise regularly (Gym, walk, yoga)",
    fastFoodLabel: "I consume fast food frequently (Weekly)",
    selectSymptomsHint: "Select all symptoms you are currently experiencing:",
    analyzeBtn: "Analyze Health Risks",
    analyzingBtn: "Analyzing...",
    resultsTitle: "AI Assessment Results (Tashkhees Report)",
    downloadPDF: "Download PDF Report",
    startNewAssessment: "Start New Assessment",
    nextBtn: "Next",
    prevBtn: "Back",

    // ReportUploader
    uploadTitle: "Upload Medical Report / Prescription",
    uploadDesc: "Upload a CBC, thyroid panel, hormonal report, or prescription. Our AI will explain it in plain language.",
    dragDrop: "Drag & Drop file here",
    orText: "or",
    browseFile: "Browse File",
    clearFile: "Clear",
    explainBtn: "Explain Report",
    processingBtn: "Processing...",
    analysisComplete: "Analysis Complete",
    uploadAnother: "Upload Another Report",
    chatTitle: "Ask Follow-up Questions",
    chatPlaceholder: "Ask about your report results...",

    // ChatBot
    chatWelcome: "Assalam-o-Alaikum! I am HerCare AI — your women's health companion. PCOS, thyroid, periods, anemia or any health question — ask me, I'm here!\n\n(Remember: I provide awareness, not diagnosis. Please consult a doctor.)",
    chatInputPlaceholder: "Write your question here...",
    chatReset: "Start new chat",
    suggestedLabel: "Suggested questions:",

    // HealthLibrary
    libraryTitle: "Health Library",
    librarySubtitle: "Evidence-based health awareness for women — in English & Roman Urdu.",
    libraryConditions: "Conditions",
    librarySearch: "Search conditions...",
    libraryNoResults: "No conditions found for",
    libraryDisclaimer: "This library is for awareness only. Please consult your doctor or gynecologist for any diagnosis. HerCare AI does not provide medical advice.",
    expandBtn: "Symptoms, causes & tips",
    collapseBtn: "Less info",
    symptomsSection: "Common Symptoms",
    causesSection: "Causes",
    preventionSection: "Prevention & Tips",
  },
  ur: {
    // SymptomChecker
    loadingConditions: "Sehat guide load ho rahi hai...",
    searchPlaceholder: "Alamaat search karein (maslan thakawat, irregular periods, baal girna...)",
    conditionsLabel: "Bemariyan",
    noConditionsMatch: "Koi bimari aapki search se match nahi hui.",
    clinicalInfo: "Tibbi Malumat & Awareness",
    urduExplanation: "Roman Urdu Wazahat (Khulasa)",
    associatedSymptoms: "Mutaliq Alamaat",
    urgencyDetails: "Zaroori tafseelaat:",
    lifestyleTips: "Zindagi ke mashwaray (Parhez & Mashwara):",
    selectCondition: "Tafseel dekhne ke liye ek bimari chunein",
    symptomDisclaimer: "Yeh malumaat sirf awareness ke liye hai aur tashkhees nahi. Sahi mashwaray ke liye apne doctor se milein.",

    // HealthQuestionnaire
    step1Label: "Qadam 1: Bunyadi Malumat",
    step2Label: "Qadam 2: Alamaat ka Intikhab",
    step3Label: "Qadam 3: AI Nataij",
    ageLabel: "Umar (saal mein)",
    weightLabel: "Wazan (kg mein)",
    heightLabel: "Qad (cm mein)",
    cycleLengthLabel: "Cycle ki muddat (din)",
    cycleRegularityLabel: "Cycle ka pattern (Periods ka nizam)",
    exerciseLabel: "Main baaqaaidgi se exercise karti hoon (Gym, walk, yoga)",
    fastFoodLabel: "Main aksar fast food khati hoon (hafte mein)",
    selectSymptomsHint: "Woh tamam alamaat chunein jo aap abhi mehsoos kar rahi hain:",
    analyzeBtn: "Sehat ki Jaanch Karein",
    analyzingBtn: "Tajzia ho raha hai...",
    resultsTitle: "AI Tashkhees Report (Nataij)",
    downloadPDF: "PDF Report Download Karein",
    startNewAssessment: "Nai Assessment Shuru Karein",
    nextBtn: "Agla",
    prevBtn: "Wapas",

    // ReportUploader
    uploadTitle: "Tibbi Report / Nuskha Upload Karein",
    uploadDesc: "CBC, thyroid panel, hormonal report ya nuskha upload karein. Hamara AI use aasaan alfaz mein samjhayega.",
    dragDrop: "File yahan khainchein",
    orText: "ya",
    browseFile: "File Chunein",
    clearFile: "Hatayein",
    explainBtn: "Report Samjhayein",
    processingBtn: "Processing ho rahi hai...",
    analysisComplete: "Tajzia Mukammal",
    uploadAnother: "Doosri Report Upload Karein",
    chatTitle: "Mزید Sawal Poochhein",
    chatPlaceholder: "Apni report ke baare mein sawal karein...",

    // ChatBot
    chatWelcome: "Assalam-o-Alaikum! Main HerCare AI hoon — aapki women's health companion. PCOS, thyroid, periods, anemia ya koi bhi sehat ka sawaal — poochhein, main yahaan hoon!\n\n(Yaad rakhein: Main awareness deti hoon, diagnosis nahi. Doctor se zaroor milein.)",
    chatInputPlaceholder: "Apna sawaal yahan likhein...",
    chatReset: "Nai guftagoo shuru karein",
    suggestedLabel: "Mashoor sawalaat:",

    // HealthLibrary
    libraryTitle: "Sehat Library",
    librarySubtitle: "Khawateen ke liye tibbi awareness — English aur Roman Urdu mein.",
    libraryConditions: "Bemariyan",
    librarySearch: "Bemariyan dhundhein...",
    libraryNoResults: "Koi bimari nahi mili:",
    libraryDisclaimer: "Yeh library sirf awareness ke liye hai. Kisi bhi tashkhees ke liye apne doctor ya gynecologist se zaroor milein. HerCare AI tibbi mashwara nahi deta.",
    expandBtn: "Alamaat, wajuhaat aur mashwaray",
    collapseBtn: "Kam malumat",
    symptomsSection: "Aam Alamaat",
    causesSection: "Wajuhaat",
    preventionSection: "Bachao aur Mashwaray",
  },
};

// Merge extended into main translations
Object.keys(extended).forEach(lang => {
  Object.assign(translations[lang], extended[lang]);
});
