// No Firebase imports needed for core app.js functionality with custom backend
// All Firebase-related imports have been removed.
// --- THREE.JS SETUP ---
// Three.js is disabled to avoid loading issues. The app runs without 3D rendering.
function initThreeJS() {
    // No-op: Three.js initialization removed
}

// --- CONFIGURATION AND GLOBAL STATE ---
// Backend API configuration from window.ENV (see config.js)
const API_BASE_URL = `${window.ENV.BACKEND_API}/api`;
const appState = {
    userId: null,
    transactions: [],
    goals: [],
    obligations: [],

    isLoading: true,
    isSaving: false, // State for the transaction button
    isAnalyzing: false,

    // Form States
    amount: '',
    description: '',
    category: 'Uncategorized',
    type: 'expense',
    isBusiness: false,
    gstAmount: '',

    // Feature States
    isShared: false,
    currentLanguage: 'en',
    alert: { message: '', type: '' },
    // Pagination/Visibility State
    visibleTransactionsCount: 5,
    visibleGoalsCount: 3,
    visibleObligationsCount: 3,
    visibleBudgetsCount: 3,
    authView: 'login', // 'login' or 'create'
    currentMainView: 'dashboard', // 'dashboard', 'profile', 'admin', 'groups', or 'splits'

    // Groups state
    groups: [],
    groupBalances: {},
    selectedGroupId: null,

    // Budgets state
    budgets: [],

    activeCurrency: 'INR',
    // Email preferences
    emailAlertsEnabled: true,

    // Authentication state
    token: localStorage.getItem('authToken') || null,

    // Chatbot State
    isChatOpen: false,
    isChatThinking: false,
    chatHistory: [{role: 'model', text: 'WELCOME_MESSAGE'}],
    geminiApiKey: null, // To store the fetched Gemini API key
    showBudgetSuggestionPrompt: false,
};

// DOM Element references
const D = {
    mainContent: document.getElementById('main-content'),
    appTitle: document.getElementById('app-title'),
    ledgerTitle: document.getElementById('ledger-title'),
    userIdDisplay: document.getElementById('user-id-display'),
    languageSelector: document.getElementById('language-selector'),
    alertContainer: document.getElementById('alert-container'),
    onboardingContainer: document.getElementById('onboarding-container'),
    logoutBtn: document.getElementById('logout-btn'),
    headerDetails: document.getElementById('header-details'),
    fabContainer: document.getElementById('fab-container'),
    chatWindowContainer: document.getElementById('chat-window-container'),
};

// --- ADMIN CONFIGURATION ---
// Check if current user is admin
// Check if current user is admin
const isAdmin = () => {
    return appState.isAdmin;
};

// --- TRANSLATION DATA (Multi-Language Support) ---
const translations = {
    en: {
            APP_TITLE: "Gamyartha 🚀", LEDGER_TITLE_PRIVATE: "My Private Ledger", LEDGER_TITLE_SHARED: "Shared Community Ledger", TOGGLE_MODE: "Ledger Privacy:", MODE_SHARED: "Community", MODE_PRIVATE: "Private", TOTAL_INCOME: "Total Income", TOTAL_EXPENSE: "Total Expense", NET_BALANCE: "Net Balance", SMART_ENTRY_TITLE: "Smart Entry (AI Powered)", DESCRIPTION_LABEL: "Description (Paste SMS/Note Here)", DESCRIPTION_PLACEHOLDER: "e.g., Paid Rs 550 for electricity bill", AI_ANALYZE_BUTTON: "AI Analyze", THINKING_BUTTON: "Thinking...", CATEGORY_LABEL: "Category", AMOUNT_LABEL: "Amount (₹)", AMOUNT_PLACEHOLDER: "e.g., 550", RECORD_DEBIT: "Record Debit", RECORD_CREDIT: "Record Credit", SAVING_BUTTON: "Saving...", HISTORY_TITLE: "Transaction History", NO_ENTRIES: "No entries in the ledger yet. Start tracking!", EXPENSE: "Expense", INCOME: "Income", GOALS_TITLE: "Savings Goals", OBLIGATIONS_TITLE: "Due Date Alerts", BUSINESS_RELATED: "Business Related?", GST_AMOUNT: "GST Amount (₹)", DUE_DATE: "Due Date", ADD_OBLIGATION: "Add Due Payment", DUE_IN_7_DAYS: "Due in 7 days!", NO_OBLIGATIONS: "No current due payments.", ADD_NEW_GOAL: "Add New Goal", GOAL_NAME: "Goal Name", GOAL_TARGET: "Target Amount (₹)", GOAL_DATE: "Target Date", REQUIRED_DAILY: "Req. Daily Savings", ADD_GOAL_BUTTON: "Add Goal", LANGUAGE: "Language", EXPORT_TAX: "Export Business Ledger (CSV)", VOICE_ENTRY: "Voice Entry", MARK_PAID: "Mark as Paid", SAVE_GOAL_BUTTON: "Save Goal", GOAL_COMPLETED: "Goal Reached!", GOAL_PROGRESS_ALERT: "Goal Progress: Saved %s towards %s.", DUE_TODAY_ALERT: "Due Today: %s payment is due!", LOGIN_TITLE: "Welcome to Gamyartha", CREATE_TITLE: "Create Your Account", LOGIN_BUTTON: "Log In", CREATE_BUTTON: "Sign Up", ALREADY_ACCOUNT: "Already have an account? Log In", NEED_ACCOUNT: "Don't have an account? Sign Up", EMAIL_PLACEHOLDER: "Email Address", PASSWORD_PLACEHOLDER: "Password", LOGOUT: "Logout", FORGOT_PASSWORD_LINK: "Forgot Password?", PASSWORD_RESET_SUCCESS: "If an account exists, a password reset link has been sent to %s.", CHAT_TITLE: "Gamyartha Advisor", CHAT_PLACEHOLDER: "Ask a financial question...", SEND: "Send", WELCOME_MESSAGE: "Hello! I'm Gamyartha Advisor. Ask me anything about budgeting, savings goals, or general finance!", GO_TO_PROFILE: "My Profile", GO_TO_DASHBOARD: "Dashboard", GO_TO_ADMIN: "Admin Panel", PROFILE_TITLE: "User Profile", USER_EMAIL: "Email", USER_ID_FULL: "User ID (UID)", ACCOUNT_TYPE: "Account Type", ACCOUNT_PERMANENT: "Permanent (Email/Password)", ACCOUNT_ANONYMOUS: "Anonymous (Local)", CHANGE_PASSWORD: "Change Password", NEW_PASSWORD_PLACEHOLDER: "New Password (min 6 chars)", AUTH_LOGOUT_PROMPT: "Security requirement: Please logout and login again to change password.", budgets_title: "Budgets", budget: "Budget", spent: "Spent", remaining: "Remaining", add_new_budget: "Add New Budget", budget_category: "Category", budget_amount: "Budget Amount (₹)", add_budget_button: "Add Budget", FIRESTORE_BAD_REQUEST: "Write failed: Check Firebase security rules (status 400).",
    },
    hi: {
        APP_TITLE: "गम्यार्थ 🚀", LEDGER_TITLE_PRIVATE: "मेरा निजी खाता", LEDGER_TITLE_SHARED: "साझा सामुदायिक खाता", TOGGLE_MODE: "खाता मोड बदलें:", MODE_SHARED: "साझा", MODE_PRIVATE: "निजी", TOTAL_INCOME: "कुल आय", TOTAL_EXPENSE: "कुल खर्च", NET_BALANCE: "शुद्ध शेष", SMART_ENTRY_TITLE: "स्मार्ट एंट्री (एआई संचालित)", DESCRIPTION_LABEL: "विवरण (एसएमएस/नोट पेस्ट करें)", DESCRIPTION_PLACEHOLDER: "उदाहरण: बिजली बिल के लिए ₹550 दिए", AI_ANALYZE_BUTTON: "एआई विश्लेषण", THINKING_BUTTON: "सोच रहा है...", CATEGORY_LABEL: "श्रेणी", AMOUNT_LABEL: "राशि (₹)", AMOUNT_PLACEHOLDER: "उदाहरण: 550", RECORD_DEBIT: "खर्च रिकॉर्ड करें", RECORD_CREDIT: "आय रिकॉर्ड करें", SAVING_BUTTON: "सहेजा जा रहा है...", HISTORY_TITLE: "लेन-देन इतिहास", NO_ENTRIES: "अभी तक खाते में कोई प्रविष्टि नहीं है। ट्रैकिंग शुरू करें!", EXPENSE: "खर्च", INCOME: "आय", GOALS_TITLE: "बचत लक्ष्य", OBLIGATIONS_TITLE: "देय तिथि अलर्ट", BUSINESS_RELATED: "व्यवसाय से संबंधित?", GST_AMOUNT: "जीएसटी राशि (₹)", DUE_DATE: "देय तिथि", ADD_OBLIGATION: "देय भुगतान जोड़ें", DUE_IN_7_DAYS: "7 दिनों में देय!", NO_OBLIGATIONS: "कोई वर्तमान देय भुगतान नहीं।", ADD_NEW_GOAL: "नया लक्ष्य जोड़ें", GOAL_NAME: "लक्ष्य का नाम", GOAL_TARGET: "लक्ष्य राशि (₹)", GOAL_DATE: "लक्ष्य तिथि", REQUIRED_DAILY: "आवश्यक दैनिक बचत", ADD_GOAL_BUTTON: "लक्ष्य जोड़ें", LANGUAGE: "भाषा", EXPORT_TAX: "व्यवसाय खाता निर्यात करें (CSV)", VOICE_ENTRY: "वॉयस एंट्री", MARK_PAID: "भुगतान हो गया", SAVE_GOAL_BUTTON: "लक्ष्य सहेजें", GOAL_COMPLETED: "लक्ष्य पूरा!", GOAL_PROGRESS_ALERT: "लक्ष्य प्रगति: %s की ओर %s बचाया गया।", DUE_TODAY_ALERT: "आज देय: %s का भुगतान आज देय है!", LOGIN_TITLE: "गम्यार्थ में आपका स्वागत है", CREATE_TITLE: "अपना खाता बनाएँ", LOGIN_BUTTON: "लॉग इन करें", CREATE_BUTTON: "साइन अप करें", ALREADY_ACCOUNT: "पहले से ही खाता है? लॉग इन करें", NEED_ACCOUNT: "खाता नहीं है? साइन अप करें", EMAIL_PLACEHOLDER: "ईमेल पता", PASSWORD_PLACEHOLDER: "पास् वर्ड", LOGOUT: "लॉग आउट", FORGOT_PASSWORD_LINK: "पासवर्ड भूल गए?", PASSWORD_RESET_SUCCESS: "यदि कोई खाता मौजूद है, तो %s पर एक पासवर्ड रीसेट लिंक भेजा गया है।", CHAT_TITLE: "गम्यार्थ सलाहकार", CHAT_PLACEHOLDER: "एक वित्तीय प्रश्न पूछें...", SEND: "भेजें", WELCOME_MESSAGE: "नमस्ते! मैं गम्यार्थ सलाहकार हूँ। बजट, बचत लक्ष्यों या सामान्य वित्त के बारे में कुछ भी पूछें!", GO_TO_PROFILE: "मेरी प्रोफ़ाइल", GO_TO_DASHBOARD: "डैशबोर्ड", PROFILE_TITLE: "उपयोगकर्ता प्रोफ़ाइल", USER_EMAIL: "ईमेल", USER_ID_FULL: "उपयोगकर्ता आईडी (UID)", ACCOUNT_TYPE: "खाता प्रकार", ACCOUNT_PERMANENT: "स्थायी (ईमेल/पासवर्ड)", ACCOUNT_ANONYMOUS: "गुमनाम (स्थानीय)", CHANGE_PASSWORD: "पासवर्ड बदलें", NEW_PASSWORD_PLACEHOLDER: "नया पासवर्ड डालें (न्यूनतम 6 अक्षर)", AUTH_LOGOUT_PROMPT: "सुरक्षा आवश्यकता: पासवर्ड बदलने से पहले अपनी पहचान सत्यापित करने के लिए कृपया लॉग आउट करें और वापस लॉग इन करें।", FIRESTORE_BAD_REQUEST: "लिखना विफल: अपनी Firebase सुरक्षा नियम जांचें (स्टेटस 400)。",
    },
    te: {
        APP_TITLE: "గమ్యార్థ 🚀", LEDGER_TITLE_PRIVATE: "నా వ్యక్తిగత ఖాతా", LEDGER_TITLE_SHARED: "భాగస్వామ్య కమ్యూనిటీ ఖాతా", TOGGLE_MODE: "ఖాతా మోడ్ టోగుల్ చేయండి:", MODE_SHARED: "భాగస్వామ్యం", MODE_PRIVATE: "వ్యక్తిగత", TOTAL_INCOME: "మొత్తం ఆదాయం", TOTAL_EXPENSE: "మొత్తం ఖర్చు", NET_BALANCE: "నికర నిల్వ", SMART_ENTRY_TITLE: "స్మార్ట్ ఎంట్రీ (AI పవర్డ్)", DESCRIPTION_LABEL: "వివరణ (SMS/గమనికను ఇక్కడ అతికించండి)", DESCRIPTION_PLACEHOLDER: "ఉదాహరణ: విద్యుత్ బిల్లుకు ₹550 చెల్లించారు", AI_ANALYZE_BUTTON: "AI విశ్లేషించు", THINKING_BUTTON: "ఆలోచిస్తోంది...", CATEGORY_LABEL: "వర్గం", AMOUNT_LABEL: "మొత్తం (₹)", AMOUNT_PLACEHOLDER: "ఉదాహరణ: 550", RECORD_DEBIT: "డెబిట్ రికార్డ్ చేయండి", RECORD_CREDIT: "క్రెడిట్ రికార్డ్ చేయండి", SAVING_BUTTON: "సేవింగ్...", HISTORY_TITLE: "లావాదేవీ చరిత్ర", NO_ENTRIES: "ఖాతాలో ఇంకా ఎంట్రీలు లేవు. ట్రాకింగ్ ప్రారంభించండి!", EXPENSE: "ఖర్చు", INCOME: "ఆదాయం", GOALS_TITLE: "పొదుపు లక్ష్యాలు", OBLIGATIONS_TITLE: "గడువు తేదీ హెచ్చరికలు", BUSINESS_RELATED: "వ్యాపార సంబంధితమా?", GST_AMOUNT: "GST మొత్తం (₹)", DUE_DATE: "గడువు తేదీ", ADD_OBLIGATION: "గడువు చెల్లింపును జోడించండి", DUE_IN_7_DAYS: "7 రోజులలో గడువు!", NO_OBLIGATIONS: "ప్రస్తుతం చెల్లించాల్సినవి లేవు.", ADD_NEW_GOAL: "కొత్త లక్ష్యాన్ని జోడించండి", GOAL_NAME: "లక్ష్యం పేరు", GOAL_TARGET: "లక్ష్య మొత్తం (₹)", GOAL_DATE: "లక్ష్యం తేదీ", REQUIRED_DAILY: "అవసరమైన రోజువారీ పొదుపు", ADD_GOAL_BUTTON: "లక్ష్యాన్ని జోడించండి", LANGUAGE: "భాష", EXPORT_TAX: "వ్యాపార ఖాతాను ఎగుమతి చేయండి (CSV)", VOICE_ENTRY: "వాయిస్ ఎంట్రీ", MARK_PAID: "చెల్లించారు అని గుర్తు పెట్టండి", SAVE_GOAL_BUTTON: "లక్ష్యాన్ని సేవ్ చేయండి", GOAL_COMPLETED: "లక్ష్యం చేరుకుంది!", GOAL_PROGRESS_ALERT: "లక్ష్య పురోగతి: %s లక్ష్యం కోసం %s ఆదా చేయబడింది.", DUE_TODAY_ALERT: "ఈ రోజు గడువు: %s చెల్లింపు ఈ రోజు గడువు!", LOGIN_TITLE: "గమ్యార్థకి స్వాగతం", CREATE_TITLE: "మీ ఖాతాను సృష్టించండి", LOGIN_BUTTON: "లాగిన్ చేయండి", CREATE_BUTTON: "సైన్ అప్ చేయండి", ALREADY_ACCOUNT: "ఇప్పటికే ఖాతా ఉందా? లాగిన్ చేయండి", NEED_ACCOUNT: "ఖాతా లేదా? సైన్ అప్ చేయండి", EMAIL_PLACEHOLDER: "ఇమెయిల్ చిరునామా", PASSWORD_PLACEHOLDER: "పాస్‌వర్డ్", LOGOUT: "లాగ్ అవుట్", FORGOT_PASSWORD_LINK: "పాస్వర్డ్ మర్చిపోయారా?", PASSWORD_RESET_SUCCESS: "ఒక ఖాతా ఉంటే, %s కు పాస్వర్డ్ రీసెట్ లింక్ పంపబడింది.", CHAT_TITLE: "గమ్యార్థ సలహాదారు", CHAT_PLACEHOLDER: "ఒక ఆర్థిక ప్రశ్న అడగండి...", SEND: "పంపు", WELCOME_MESSAGE: "నమస్కారం! నేను గమ్యార్థ సలహాదారుని. బడ్జెటింగ్, పొదుపు లక్ష్యాలు లేదా సాధారణ ఆర్థిక విషయాల గురించి ఏదైనా అడగండి!", GO_TO_PROFILE: "నా ప్రొఫైల్", GO_TO_D్యాష్‌బోర్డ్: "డాష్‌బోర్డ్", PROFILE_TITLE: "వినియోగదారు ప్రొఫైల్", USER_EMAIL: "ఇమెయిల్", USER_ID_FULL: "వినియోగదారు ID (UID)", ACCOUNT_TYPE: "ఖాతా రకం", ACCOUNT_PERMANENT: "శాశ్వత (ఇమెయిల్/పాస్‌వర్డ్)", ACCOUNT_ANONYMOUS: "అనామక (స్థానిక)", CHANGE_PASSWORD: "పాస్వర్డ్ మార్చండి", NEW_PASSWORD_PLACEHOLDER: "కొత్త పాస్‌వర్డ్ నమోదు చేయండి (కనీసం 6 అక్షరాలు)", AUTH_LOGOUT_PROMPT: "భద్రతా అవసరం: దయచేసి పాస్‌వర్డ్‌ను మార్చడానికి ముందు మీ గుర్తింపును ధృవీకరించడానికి లాగ్ అవుట్ చేసి మళ్లీ లాగిన్ అవ్వండి。", FIRESTORE_BAD_REQUEST: "రాయడం విఫలమైంది: మీ Firebase భద్రతా నియమాలను తనిఖీ చేయండి (స్థితి 400).",
    },
    ta: {
        APP_TITLE: "கம్యார்த்த 🚀", LEDGER_TITLE_PRIVATE: "எனது தனிப்பட்ட கணக்கு", LEDGER_TITLE_SHARED: "பகிரப்பட்ட சமூக கணக்கு", TOGGLE_MODE: "கணக்கு பயன்முறையை மாற்று:", MODE_SHARED: "பகிரப்பட்டது", MODE_PRIVATE: "தனிப்பட்ட", TOTAL_INCOME: "மொத்த வருமானம்", TOTAL_EXPENSE: "மொத்த வெச்சம்", NET_BALANCE: "நிகர இருப்பு", SMART_ENTRY_TITLE: "ஸ்மார்ட் உள்ளீடு (AI ஆற்றல் பெற்றது)", DESCRIPTION_LABEL: "விளக்கம் (எஸ்எம்எஸ்/குறிப்பை இங்கே ஒட்டு)", DESCRIPTION_PLACEHOLDER: "எ.கா., மின்சார கட்டணத்திற்காக ₹550 செலுத்தப்பட்டது", AI_ANALYZE_BUTTON: "AI பகுப்பாய்வு", THINKING_BUTTON: "யோசிக்கிறது...", CATEGORY_LABEL: "வகை", AMOUNT_LABEL: "தொகை (₹)", AMOUNT_PLACEHOLDER: "எ.கா., 550", RECORD_DEBIT: "பற்றுப் பதிவு செய்", RECORD_CREDIT: "கடன் பதிவு செய்", SAVING_BUTTON: "சேமிக்கிறது...", HISTORY_TITLE: "பரிவர்த்தனை வரலாறு", NO_ENTRIES: "கணக்கில் இன்னும் உள்ளீடுகள் இல்லை. கண்காணிப்பை தொடங்குங்கள்!", EXPENSE: "செலவு", INCOME: "வருமானம்", GOALS_TITLE: "சேமிப்பு இலக்குகள்", OBLIGATIONS_TITLE: "உரிய தேதி விழிப்பூட்டல்கள்", BUSINESS_RELATED: "வணிகம் தொடர்பானது?", GST_AMOUNT: "GST தொகை (₹)", DUE_DATE: "உரிய தேதி", ADD_OBLIGATION: "செலுத்த வேண்டிய தொகையை சேர்", DUE_IN_7_DAYS: "7 நாட்களில் செலுத்த வேண்டும்!", NO_OBLIGATIONS: "தற்போது செலுத்த வேண்டிய தொகைகள் இல்லை.", ADD_NEW_GOAL: "புதிய இலக்கை சேர்", GOAL_NAME: "இலக்கின் பெயர்", GOAL_TARGET: "இலக்கு தொகை (₹)", GOAL_DATE: "இலக்கு தேதி", REQUIRED_DAILY: "தேவையான தினசரி சேமிப்பு", ADD_GOAL_BUTTON: "இலக்கை சேர்", LANGUAGE: "மொழி", EXPORT_TAX: "வணிக கணக்கைப் பதிவிறக்கு (CSV)", VOICE_ENTRY: "குரல் உள்ளீடு", MARK_PAID: "செலுத்தப்பட்டது எனக் குறி", SAVE_GOAL_BUTTON: "இலக்கை சேமி", GOAL_COMPLETED: "இலக்கை அடைந்தது!", GOAL_PROGRESS_ALERT: "இலக்கு முன்னேற்றம்: %s இலக்கை நோக்கி %s சேமிக்கப்பட்டது。", DUE_TODAY_ALERT: "இன்று உரியது: %s கட்டணம் இன்று உரியது!", LOGIN_TITLE: "கம్యார்த்திக்கு வரவேற்கிறோம்", CREATE_TITLE: "உங்கள் கணக்கை உருவாக்கவும்", LOGIN_BUTTON: "உள்நுழை", CREATE_BUTTON: "பதிவு செய்க", ALREADY_ACCOUNT: "ஏற்கனவே ஒரு கணக்கு உள்ளதா? உள்நுழைக", NEED_ACCOUNT: "உங்களுக்கு கணக்கு இல்லையா? பதிவு செய்க", EMAIL_PLACEHOLDER: "மின்னஞ்சல் முகவரி", PASSWORD_PLACEHOLDER: "கடவுச்சொல்", LOGOUT: "வெளியேறு", FORGOT_PASSWORD_LINK: "கடவுச்சொல் மறந்துவிட்டதா?", PASSWORD_RESET_SUCCESS: "ஒரு கணக்கு இருந்தால், %s க்கு கடவுச்சொல் மீட்டமைப்பு இணைப்பு அனுப்பப்பட்டுள்ளது。", CHAT_TITLE: "கம్యார்த்தி ஆலோசகர்", CHAT_PLACEHOLDER: "ஒரு நிதி கேள்வியைக் கேளுங்கள்...", SEND: "அனுப்பு", WELCOME_MESSAGE: "வணக்கம்! நான் கம్యார்த்தி ஆலோசகர். பட்ஜெட், சேமிப்பு இலக்குகள் அல்லது பொதுவான நிதி பற்றி எதையும் கேளுங்கள்!", GO_TO_PROFILE: "எனது சுயவிவரம்", GO_TO_DASHBOARD: "டாஷ்போர்டு", PROFILE_TITLE: "பயனர் சுயவிவரம்", USER_EMAIL: "இமெயில்", USER_ID_FULL: "பயனர் ID (UID)", ACCOUNT_TYPE: "கணக்கு வகை", ACCOUNT_PERMANENT: "நிரந்தர (மின்னஞ்சல்/கடவுச்சொல்)", ACCOUNT_ANONYMOUS: "அநாமதேய (உள்ளூர்)", CHANGE_PASSWORD: "கடவுச்சொல்லை மாற்று", NEW_PASSWORD_PLACEHOLDER: "புதிய கடவுச்சொல்லை உள்ளிடவும் (குறைந்தது 6 எழுத்துக்கள்)", AUTH_LOGOUT_PROMPT: "பாதுகாப்புத் தேவை: கடவுச்சொல்லை மாற்றுவதற்கு முன் உங்கள் அடையாளத்தைச் சரிபார்க்க லாக் அவுட் செய்து மீண்டும் லாக் இன் செய்யவும்。", FIRESTORE_BAD_REQUEST: "எழுதுவது தோல்வியடைந்தது: உங்கள் Firebase பாதுகாப்பு விதிகளைச் சரிபார்க்கவும் (நிலை 400).",
            },
            kn: {
                APP_TITLE: "ಗಮ್ಯಾರ್ಥ 🚀", LEDGER_TITLE_PRIVATE: "ನನ್ನ ಖಾಸಗಿ ಲೆಡ್ಜರ್", LEDGER_TITLE_SHARED: "ಹಂಚಿದ ಸಮುದಾಯ ಲೆಡ್ಜರ್", TOGGLE_MODE: "ಲೆಡ್ಜರ್ ಮೋಡ್ ಟಾಗಲ್ ಮಾಡಿ:", MODE_SHARED: "ಹಂಚಲಾಗಿದೆ", MODE_PRIVATE: "ಖಾಸಗಿ", TOTAL_INCOME: "ಒಟ್ಟು ಆದಾಯ", TOTAL_EXPENSE: "ಒಟ್ಟು ಖರ್ಚು", NET_BALANCE: "ನಿವ್ವಳ ಸಮತೋಲನ", SMART_ENTRY_TITLE: "ಸ್ಮಾರ್ಟ್ ನಮೂದು (AI ಚಾಲಿತ)", DESCRIPTION_LABEL: "ವಿವರಣೆ (SMS/ಟಿಪ್ಪಣಿ ಅಂಟಿಸಿ)", DESCRIPTION_PLACEHOLDER: "ಉದಾಹರಣೆಗೆ, ವಿದ್ಯುತ್ ಬಿಲ್‌ಗೆ ₹550 ಪಾವತಿಸಲಾಗಿದೆ", AI_ANALYZE_BUTTON: "AI ವಿಶ್ಲೇಷಿಸಿ", THINKING_BUTTON: "ಯೋಚಿಸುತ್ತಿದೆ...", CATEGORY_LABEL: "ವರ್ಗ", AMOUNT_LABEL: "ಮೊತ್ತ (₹)", AMOUNT_PLACEHOLDER: "ಉದಾಹರಣೆಗೆ, 550", RECORD_DEBIT: "ಡೆಬಿಟ್ ದಾಖಲಿಸಿ", RECORD_CREDIT: "ಕ್ರೆಡಿಟ್ ದಾಖಲಿಸಿ", SAVING_BUTTON: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...", HISTORY_TITLE: "ವ್ಯವಹಾರ ಇತಿಹಾಸ", NO_ENTRIES: "ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ಇನ್ನೂ ನಮೂದುಗಳಿಲ್ಲ. ಟ್ರ್ಯಾಕಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ!", EXPENSE: "ಖರ್ಚು", INCOME: "ಆದಾಯ", GOALS_TITLE: "ಉಳಿತಾಯ ಗುರಿಗಳು", OBLIGATIONS_TITLE: "ಗಡುವು ದಿನಾಂಕ ಎಚ್ಚರಿಕೆಗಳು", BUSINESS_RELATED: "ವ್ಯಾಪಾರ ಸಂಬಂಧಿತವೇ?", GST_AMOUNT: "GST ಮೊತ್ತ (₹)", DUE_DATE: "ಗಡುವು ದಿನಾಂಕ", ADD_OBLIGATION: "ಬಾಕಿ ಪಾವತಿ ಸೇರಿಸಿ", DUE_IN_7_DAYS: "7 ದಿನಗಳಲ್ಲಿ ಬಾಕಿ!", NO_OBLIGATIONS: "ಪ್ರಸ್ತುತ ಬಾಕಿ ಪಾವತಿಗಳಿಲ್ಲ.", ADD_NEW_GOAL: "ಹೊಸ ಗುರಿಯನ್ನು ಸೇರಿಸಿ", GOAL_NAME: "ಗುರಿಯ ಹೆಸರು", GOAL_TARGET: "ಗುರಿ ಮೊತ್ತ (₹)", GOAL_DATE: "ಗುರಿ ದಿನಾಂಕ", REQUIRED_DAILY: "ಅಗತ್ಯ ದೈನಂದಿನ ಉಳಿತಾಯ", ADD_GOAL_BUTTON: "ಗುರಿ ಸೇರಿಸಿ", LANGUAGE: "ಭಾಷೆ", EXPORT_TAX: "ವ್ಯಾಪಾರ ಲೆಡ್ಜರ್ ರಫ್ತು (CSV)", VOICE_ENTRY: "ಧ್ವನಿ ನಮೂದು", MARK_PAID: "ಪಾವತಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ", SAVE_GOAL_BUTTON: "ಗುರಿ ಉಳಿಸಿ", GOAL_COMPLETED: "ಗುರಿ ತಲುಪಿದೆ!", GOAL_PROGRESS_ALERT: "ಗುರಿ ಪ್ರಗತಿ: %s ಗುರಿಗಾಗಿ %s ಉಳಿಸಲಾಗಿದೆ。", DUE_TODAY_ALERT: "ಇಂದು ಬಾಕಿ: %s ಪಾವತಿ ಇಂದು ಬಾಕಿ ಇದೆ!", LOGIN_TITLE: "ಗಮ್ಯಾರ್ಥಗೆ ಸುಸ್ವಾಗತ", CREATE_TITLE: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ", LOGIN_BUTTON: "ಲಾಗ್ ಇನ್", CREATE_BUTTON: "ಸೈನ್ ಅಪ್ ಮಾಡಿ", ALREADY_ACCOUNT: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಲಾಗ್ ಇನ್ ಮಾಡಿ", NEED_ACCOUNT: "ಖಾತೆ ಇಲ್ಲವೇ? ಸೈನ್ ಅಪ್ ಮಾಡಿ", EMAIL_PLACEHOLDER: "ಇಮೇಲ್ ವಿಳಾಸ", PASSWORD_PLACEHOLDER: "ಪಾಸ್ವರ್ಡ್", LOGOUT: "ಲಾಗ್ ಔಟ್", FORGOT_PASSWORD_LINK: "ಪಾಸ್ವರ್ಡ್ ಮರೆತುಹೋಗಿದೆಯೇ?", PASSWORD_RESET_SUCCESS: "ಒಂದು ಖಾತೆ ಇದ್ದರೆ, %s ಗೆ ಪಾಸ್ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ。", CHAT_TITLE: "ಗಮ್ಯಾರ್ಥ ಸಲಹೆಗಾರ", CHAT_PLACEHOLDER: "ಹಣಕಾಸಿನ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...", SEND: "ಕಳುಹಿಸು", WELCOME_MESSAGE: "ನಮಸ್ಕಾರ! ನಾನು ಗಮ್ಯಾರ್ಥ ಸಲಹೆಗಾರ. ಬಜೆಟ್, ಉಳಿತಾಯ ಗುರಿಗಳು ಅಥವಾ ಸಾಮಾನ್ಯ ಹಣಕಾಸು ಕುರಿತು ಏನೇ ಬೇಕಾದರೂ ಕೇಳಿ!", GO_TO_PROFILE: "ನನ್ನ ಪ್ರೊಫೈಲ್", GO_TO_D್ಯಾಶ್‌ಬೋರ್ಡ್: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", PROFILE_TITLE: "ಬಳಕೆದಾರ ಪ್ರೊಫೈಲ್", USER_EMAIL: "ಇಮೇಲ್", USER_ID_FULL: "ಬಳಕೆದಾರ ID (UID)", ACCOUNT_TYPE: "ಖಾತೆ ಪ್ರಕಾರ", ACCOUNT_PERMANENT: "ಶಾಶ್ವತ (ಇಮೇಲ್/ಪಾಸ್‌ವರ್ಡ್)", ACCOUNT_ANONYMOUS: "ಗುಮನಾಮ (ಸ್ಥಳೀಯ)", CHANGE_PASSWORD: "ಪಾಸ್ವರ್ಡ್ ಬದಲಾಯಿಸಿ", NEW_PASSWORD_PLACEHOLDER: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ (ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು)", AUTH_LOGOUT_PROMPT: "ಭದ್ರತಾ ಅಗತ್ಯ: ದಯವಿಟ್ಟು ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸುವ ಮೊದಲು ನಿಮ್ಮ ಗುರುತನ್ನು ಪರಿಶೀಲಿಸಲು ಲಾಗ್ ಔಟ್ ಮಾಡಿ ಮತ್ತು ಮರು-ಲಾಗ್ ಇನ್ ಮಾಡಿ.", FIRESTORE_BAD_REQUEST: "ಬರವಣಿಗೆ ವಿಫಲವಾಗಿದೆ: ನಿಮ್ಮ Firebase ಭದ್ರತಾ ನಿಯಮಗಳನ್ನು ಪರಿಶೀಲಿಸಿ (ಸ್ಥಿತಿ 400).",
            }
        };

        const T = (key, ...args) => {
            const lang = appState.currentLanguage;
            let text = translations[lang][key] || translations['en'][key] || key;
            args.forEach((arg) => { text = text.replace(`%s`, arg); });
            return text;
        };

        // --- UTILITY FUNCTIONS ---
        const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', minimumFractionDigits: 0
        }).format(amount);
        
        const today = new Date();
        const isDueSoon = (date) => {
            if (!date) return false;
            const due = new Date(date);
            const diffTime = due.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 7;
        };
        const isDueToday = (date) => {
            if (!date) return false;
            const due = new Date(date);
            return due.toDateString() === today.toDateString();
        };

        const getSpeechLocale = (lang) => {
            switch (lang) {
                case 'hi': return 'hi-IN';
                case 'te': return 'te-IN'; 
                case 'ta': return 'ta-IN'; 
                case 'kn': return 'kn-IN'; 
                case 'en': 
                default: return 'en-IN';
            }
        };
        
        // --- ALERT FUNCTIONS ---
        const setAlert = (message, type) => {
            appState.alert = { message, type };
            renderAlertBanner();
            // Automatically dismiss success and temporary alerts after 4 seconds
            if (type === 'success' || type === 'progress') {
                setTimeout(() => {
                    if (appState.alert.message === message) { // Only dismiss if it hasn't been replaced
                        appState.alert = { message: '', type: '' };
                        renderAlertBanner();
                    }
                }, 4000);
            }
        };

        const renderAlertBanner = () => {
            const { message, type } = appState.alert;
            let bgColor = 'bg-yellow-100';
            let borderColor = 'border-yellow-500';
            let textColor = 'text-yellow-800';

            if (type === 'success') {
                bgColor = 'bg-green-100';
                borderColor = 'border-green-500';
                textColor = 'text-green-800';
            } else if (type === 'error') {
                bgColor = 'bg-red-100';
                borderColor = 'border-red-500';
                textColor = 'text-red-800';
            }

            if (!message) {
                D.alertContainer.innerHTML = '';
                return;
            }

            D.alertContainer.innerHTML = `
                <div class="fixed top-0 left-0 right-0 z-50 p-4 shadow-xl ${bgColor} border-b-4 ${borderColor} transition-all duration-300">
                    <div class="flex items-center justify-between">
                        <p class="font-medium ${textColor} text-sm">${message}</p>
                        <button id="dismiss-alert-btn" class="ml-4 ${textColor} opacity-70 hover:opacity-100 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('dismiss-alert-btn').onclick = () => setAlert('', '');
        };
        
        // --- DATA COMPUTATION ---
        const computeSummary = () => {
            let income = 0;
            let expense = 0;
            const catMap = {};

            appState.transactions.forEach(t => {
                const amount = parseFloat(t.amount) || 0;
                if (t.type === 'income') {
                    income += amount;
                } else if (t.type === 'expense') {
                    expense += amount;
                    const cat = t.category || 'Uncategorized';
                    catMap[cat] = (catMap[cat] || 0) + amount;
                }
            });
            
            return {
                totalIncome: income, totalExpense: expense, netBalance: income - expense, expensesByCategory: catMap
            };
        };

        // --- RENDER FUNCTIONS (DOM Manipulation) ---

        const renderHeaderDetails = () => {
            const ledgerTitleText = appState.isShared ? T('LEDGER_TITLE_SHARED') : T('LEDGER_TITLE_PRIVATE');
            let viewButtonText, newView;

            // Simplified navigation: toggle between Dashboard, Profile, and Admin (if applicable)
            if (appState.currentMainView === 'dashboard') {
                viewButtonText = T('GO_TO_PROFILE');
                newView = 'profile';
            } else if (appState.currentMainView === 'profile') {
                viewButtonText = T('GO_TO_DASHBOARD');
                newView = 'dashboard';
            } else if (appState.currentMainView === 'admin' && isAdmin()) {
                viewButtonText = T('GO_TO_DASHBOARD');
                newView = 'dashboard';
            } else {
                viewButtonText = T('GO_TO_DASHBOARD');
                newView = 'dashboard';
            }

            D.ledgerTitle.innerHTML = `
                <span class="font-semibold truncate">${ledgerTitleText}</span>
                <button id="view-toggle-btn" class="ml-2 text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-full font-medium transition duration-150">
                    ${viewButtonText}
                </button>
            `;

            document.getElementById('view-toggle-btn').onclick = () => {
                appState.currentMainView = newView;
                updateUI();
            };
        }
        
        const renderDashboard = () => {
            const summary = computeSummary();
            const dueAlertCount = appState.obligations.filter(o => !o.isPaid && isDueSoon(o.dueDate)).length;

            
            D.logoutBtn.textContent = T('LOGOUT');
            D.logoutBtn.classList.remove('hidden');
            D.headerDetails.classList.remove('hidden');

            // Generate HTML structure
            D.mainContent.innerHTML = `
                <!-- Shared Ledger Toggle -->
                <div class="p-4 bg-white border-b border-gray-200 flex justify-between items-center text-sm">
                    <span class="font-medium text-gray-700">${T('TOGGLE_MODE')}</span>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="shared-toggle" class="sr-only" ${appState.isShared ? 'checked' : ''}>
                            <div class="block ${appState.isShared ? 'bg-teal-500' : 'bg-gray-400'} w-14 h-8 rounded-full transition"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition shadow-md ${appState.isShared ? 'transform translate-x-6' : ''}"></div>
                        </div>
                        <div class="ml-3 text-gray-700 font-semibold">
                            ${appState.isShared ? T('MODE_SHARED') : T('MODE_PRIVATE')}
                        </div>
                    </label>
                </div>

                <!-- Due Date Alert Badge -->
                ${dueAlertCount > 0 ? `
                    <div class="p-3 m-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg font-semibold text-center shadow-md">
                        <span class="animate-pulse mr-2">🔔</span> ${dueAlertCount} ${T('OBLIGATIONS_TITLE')}!
                    </div>
                ` : ''}


                <!-- Summary Cards -->
                <div id="summary-cards" class="p-4 grid grid-cols-3 gap-3 bg-white border-b border-gray-200 shadow-sm">
                    ${renderSummaryCards(summary)}
                </div>

                <!-- Add Transaction Form -->
                ${renderTransactionForm()}
                
                <!-- Goal-Based Savings Tracker -->
                <div id="goals-tracker-container"></div>
                
                <!-- Due Date Alerts (Obligations) -->
                <div id="obligations-tracker-container"></div>

                <!-- Budgets Tracker -->
                <div id="budgets-tracker-container"></div>

                <!-- Split Expenses Section -->
                <div id="split-expenses-container"></div>
                
                <!-- Spending Insights Chart -->
                <div id="chart-container"></div>

                <!-- Transaction History -->
                <div id="history-container" class="p-4"></div>
            `;
            
            // Attach event listeners and render sub-components after injection
            document.getElementById('shared-toggle').onchange = toggleSharedMode;
            document.getElementById('transaction-form').onsubmit = handleAddTransaction;
            document.getElementById('ai-analyze-btn').onclick = analyzeTransaction;
            document.getElementById('voice-entry-btn').onclick = startVoiceRecognition;
            document.getElementById('description-input').oninput = (e) => appState.description = e.target.value;
            document.getElementById('amount-input').oninput = (e) => appState.amount = e.target.value;
            
            // Initialize split expenses feature
            import('./splits.js').then(splitsModule => {
                splitsModule.initSplits({
                    apiBaseUrl: API_BASE_URL,
                    appState: appState,
                    formatCurrency: formatCurrency // Pass the utility function
                });
                // The initSplitFeature() is no longer needed as splits are handled in the profile tab.
            }).catch(error => {
                console.error('Error loading splits module:', error);
            });

            // Initialize groups feature
            import('./js/groups.js').then(groupsModule => {
                groupsModule.initGroups({
                    apiBaseUrl: API_BASE_URL,
                    appState: appState
                });
                // Load groups data
                groupsModule.initializeGroupListeners();
            }).catch(error => {
                console.error('Error loading groups module:', error);
            });
            
            const businessCheckbox = document.getElementById('is-business-checkbox');
            const gstInput = document.getElementById('gst-amount-input');
            if(businessCheckbox) {
                businessCheckbox.onchange = (e) => {
                    appState.isBusiness = e.target.checked;
                    gstInput.disabled = !appState.isBusiness;
                    gstInput.classList.toggle('bg-gray-100', !appState.isBusiness);
                    gstInput.classList.toggle('border-gray-300', appState.isBusiness);
                };
            }
            if(gstInput) {
                gstInput.oninput = (e) => appState.gstAmount = e.target.value;
            }

            renderGoalTracker();
            renderObligationsTracker();
            renderBudgetsTracker();
            if (appState.type === 'expense') renderCategoryChart(summary.expensesByCategory);
            renderTransactionHistory();
        };

        // window.addMoneyToGoal = async (goalId) => {
        //     const input = document.getElementById(`add-money-goal-${goalId}`);
        //     const amountToAdd = parseFloat(input.value);

        //     if (!amountToAdd || amountToAdd <= 0) {
        //         setAlert('Please enter a valid amount to add.', 'error');
        //         return;
        //     }

        //     const goal = appState.goals.find(g => g.id === goalId);
        //     if (!goal) return;

        //     const newSavedAmount = (goal.saved_amount || 0) + amountToAdd;

        //     try {
        //         const response = await fetch(`${API_BASE_URL}/goals/${goalId}/progress`, {
        //             method: 'PUT',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': `Bearer ${appState.token}`
        //             },
        //             body: JSON.stringify({ saved_amount: newSavedAmount })
        //         });

        //         if (!response.ok) throw new Error('Failed to update goal progress.');

        //         // Update state and UI on success
        //         goal.saved_amount = newSavedAmount;
        //         input.value = ''; // Clear input
        //         setAlert(`Successfully added ${formatCurrency(amountToAdd)} to your goal!`, 'success');
        //         renderGoalTracker(); // Re-render just the goals section for efficiency
        //     } catch (error) {
        //         setAlert(error.message, 'error');
        //     }
        // };

window.addMoneyToGoal = async (goalId) => {
    const input = document.getElementById(`add-money-goal-${goalId}`);
    const amountToAdd = parseFloat(input.value);

    if (!amountToAdd || amountToAdd <= 0) {
        setAlert('Please enter a valid amount.', 'error');
        return;
    }

    const goal = appState.goals.find(g => g.id == goalId);
    if (!goal) return;

    const currentSaved = goal.saved_amount || 0;
    const newSavedAmount = currentSaved + amountToAdd;

    try {
        const response = await fetch(`${API_BASE_URL}/goals/${goalId}/progress`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${appState.token}`
            },
            body: JSON.stringify({ saved_amount: newSavedAmount })
        });

        if (!response.ok) throw new Error('Failed to update goal progress.');

        // update local cache
        goal.saved_amount = newSavedAmount;

        input.value = '';
        setAlert(`Added ₹${amountToAdd} to goal ✅`, 'success');

        renderGoalTracker();

    } catch (error) {
        setAlert(error.message, 'error');
    }
};

        window.editBudget = async (id) => {
            const budget = appState.budgets.find(b => b.id === id);
            if (!budget) return;

            const newAmount = prompt(`Enter new budget amount for "${budget.category}":`, budget.amount);
            if (!newAmount || isNaN(parseFloat(newAmount)) || parseFloat(newAmount) <= 0) {
                if (newAmount !== null) setAlert('Please enter a valid positive number.', 'error');
                return;
            }

            const now = new Date();
            const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            try {
                await fetch(`${API_BASE_URL}/budgets`, {
                    method: 'POST', // The backend uses POST for create/update (upsert)
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${appState.token}` },
                    body: JSON.stringify({ category: budget.category, amount: parseFloat(newAmount), monthYear })
                });
                setAlert('Budget updated successfully!', 'success');
                await initializeListeners();
                updateUI();
            } catch (error) {
                console.error('Error updating budget:', error);
                setAlert('Failed to update budget.', 'error');
            }
        };

        window.deleteBudget = async (id) => {
            if (!confirm("Are you sure you want to delete this budget?")) return;

            try {
                await fetch(`${API_BASE_URL}/budgets/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${appState.token}` }
                });
                setAlert('Budget deleted successfully!', 'success');
                await initializeListeners();
                updateUI();
            } catch (error) {
                console.error('Error deleting budget:', error);
                setAlert('Failed to delete budget.', 'error');
            }
        };

        const handleChangePassword = async (e) => {
            e.preventDefault(); // Prevent default form submission
            // This functionality requires a backend endpoint to change password for a logged-in user.
            // The current backend (server.js) only has a password reset endpoint.
            // For now, we will alert the user that this feature is not implemented.
            setAlert("Password change for logged-in users is not yet implemented. Please use the 'Forgot Password' feature if you need to reset it.", 'error');
            document.getElementById('new-password-input').value = ''; // Clear the input
            // Re-enable the button if it was disabled
            const changePasswordBtn = document.getElementById('change-password-btn');
            if (changePasswordBtn) {
                changePasswordBtn.disabled = false;
                changePasswordBtn.textContent = T('CHANGE_PASSWORD');
            }
        };

        const loadProfileTabContent = (section) => {
            // Update active tab style
            document.querySelectorAll('.profile-tab').forEach(tab => tab.classList.remove('active', 'bg-white', 'text-gray-900', 'shadow-sm'));
            document.querySelectorAll('.profile-tab').forEach(tab => {
                tab.classList.add('bg-gray-100', 'text-gray-600');
            });
            const activeTab = document.getElementById(`profile-${section}-tab`);
            if (activeTab) {
                activeTab.classList.add('active', 'bg-white', 'text-gray-900', 'shadow-sm');
                activeTab.classList.remove('bg-gray-100', 'text-gray-600');
            }

            // Load content
            if (section === 'groups') {
                import('./js/groups.js').then(groupsModule => groupsModule.renderGroupsView(document.getElementById('profile-content')));
            } else if (section === 'splits') {
                import('./js/splits.js').then(splitsModule => {
                    // Initialize the module with necessary state and functions
                    splitsModule.initSplits({
                        apiBaseUrl: API_BASE_URL,
                        appState: appState,
                        setAlert: setAlert
                    });
                    // Now render the view
                    splitsModule.renderSplitView(document.getElementById('profile-content'));
                });
            } else {
                renderUserProfileDetails(document.getElementById('profile-content'));
            }
        };

        const fetchUserProfile = async () => {
            const response = await fetch(`${API_BASE_URL}/user/profile`, {
                headers: { 'Authorization': `Bearer ${appState.token}` }
            });
            const data = await response.json();
            appState.emailAlertsEnabled = data.user.email_alerts_enabled;
            // You might want to update other user details in appState here if needed
        };
        
        const handleCurrencyChange = async (e) => {
            const newCurrency = e.target.value;
            appState.activeCurrency = newCurrency;

            try {
                await fetch(`${API_BASE_URL}/user/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.token}`
                    },
                    body: JSON.stringify({
                        full_name: appState.userName,
                        email_alerts_enabled: appState.emailAlertsEnabled,
                        currency: newCurrency
                    })
                });
                setAlert(`Currency updated to ${newCurrency}`, 'success');
                updateUI(); // Re-render the entire UI with the new currency
            } catch (error) {
                setAlert('Failed to update currency preference.', 'error');
            }
        };

        const renderUserProfile = () => { // This is now the main container for profile tabs
            D.mainContent.innerHTML = `
                <div class="p-4 space-y-6">
                    <div class="flex justify-between items-center border-b pb-2 mb-4">
                        <h2 class="text-3xl font-bold text-indigo-700">${T('PROFILE_TITLE')}</h2>
                    </div>

                    <!-- Profile Navigation Tabs -->
                    <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <button id="profile-details-tab" class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition profile-tab active bg-white text-gray-900 shadow-sm">
                            👤 Details
                        </button>
                        <button id="profile-groups-tab" class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition profile-tab bg-gray-100 text-gray-600 hover:bg-white">
                            👥 Groups
                        </button>
                        <button id="profile-splits-tab" class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition profile-tab bg-gray-100 text-gray-600 hover:bg-white">
                            🪓 Splits
                        </button>
                    </div>

                    <!-- Profile Content Container -->
                    <div id="profile-content" class="min-h-[600px]">
                        <!-- Content will be loaded here -->
                    </div>
                </div>
            `;

            document.getElementById('profile-details-tab').onclick = () => loadProfileTabContent('details');
            document.getElementById('profile-groups-tab').onclick = () => loadProfileTabContent('groups');
            document.getElementById('profile-splits-tab').onclick = () => loadProfileTabContent('splits');

            loadProfileTabContent('details'); // Load default content
        };

        const renderUserProfileDetails = (container) => {
            const userEmail = appState.userEmail || T('ACCOUNT_ANONYMOUS');
            // With custom backend, a user is either logged in (permanent) or not.
            const accountType = appState.userEmail ? T('ACCOUNT_PERMANENT') : T('ACCOUNT_ANONYMOUS');
            const isPermanentUser = !!appState.userEmail;

            container.innerHTML = `
                <div class="space-y-6">
                    <!-- Account Type & Details Card (Professional Look) -->
                    <div class="bg-white p-6 rounded-xl shadow-2xl border border-gray-200">
                        <div class="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 class="text-xl font-bold text-gray-800">${T('ACCOUNT_TYPE')}</h3>
                            <span class="text-sm font-semibold px-3 py-1 rounded-full ${isPermanentUser ? 'bg-teal-100 text-teal-700' : 'bg-yellow-100 text-yellow-700'}">
                                ${accountType}
                            </span>
                        </div>

                        <div class="space-y-4">
                            <!-- Email -->
                            <div class="flex justify-between border-b border-dashed pb-2">
                                <span class="font-medium text-gray-600">${T('USER_EMAIL')}</span>
                                <span class="text-indigo-600 font-semibold truncate max-w-[50%]">${userEmail}</span>
                            </div>

                            <!-- User ID -->
                            <div class="flex justify-between items-center">
                                <span class="font-medium text-gray-600">${T('USER_ID_FULL')}</span>
                                <span class="text-gray-500 text-sm break-all max-w-[60%] font-mono">${appState.userId || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Currency Settings -->
                    <div class="bg-white p-6 rounded-xl shadow-2xl border border-gray-200">
                        <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                            Currency Preference
                        </h3>
                        <div class="flex items-center justify-between">
                            <label for="currency-selector" class="font-medium text-gray-600">Display Currency</label>
                            <select id="currency-selector" class="p-2 border border-gray-300 rounded-md">
                                <option value="INR" ${appState.activeCurrency === 'INR' ? 'selected' : ''}>INR (₹)</option>
                                <option value="USD" ${appState.activeCurrency === 'USD' ? 'selected' : ''}>USD ($)</option>
                                <option value="AED" ${appState.activeCurrency === 'AED' ? 'selected' : ''}>AED (د.إ)</option>
                                <option value="EUR" ${appState.activeCurrency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                                <option value="GBP" ${appState.activeCurrency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Email Alerts Settings -->
                    ${isPermanentUser ? `
                        <div class="bg-white p-6 rounded-xl shadow-2xl border border-gray-200">
                            <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                Email Alerts
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h4 class="font-medium text-gray-800">Enable Email Notifications</h4>
                                        <p class="text-sm text-gray-600">Receive alerts for due dates, goal completions, and transactions</p>
                                    </div>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" id="email-alerts-toggle" ${appState.emailAlertsEnabled ? 'checked' : ''}
                                               class="sr-only peer">
                                        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Change Password Card (Only for Permanent Users) -->
                    ${isPermanentUser ? `
                        <div class="bg-white p-6 rounded-xl shadow-2xl border border-gray-200">
                            <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                ${T('CHANGE_PASSWORD')}
                            </h3>
                            <form id="change-password-form" class="space-y-4">
                                <div>
                                    <label for="new-password-input" class="sr-only">New Password</label>
                                    <input type="password" id="new-password-input" required placeholder="${T('NEW_PASSWORD_PLACEHOLDER')}"
                                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-900" />
                                </div>
                                <button type="submit" id="change-password-btn" class="w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition duration-150">
                                    ${T('CHANGE_PASSWORD')}
                                </button>
                            </form>
                        </div>
                    ` : ''}
                </div>
            `;

            // Attach event listeners
            if (isPermanentUser) {
                document.getElementById('change-password-form').onsubmit = handleChangePassword;

                document.getElementById('email-alerts-toggle').onchange = (e) => {
                    appState.emailAlertsEnabled = e.target.checked;
                    setAlert(`Email alerts ${e.target.checked ? 'enabled' : 'disabled'}`, 'success');
                };
                document.getElementById('currency-selector').onchange = handleCurrencyChange;
            }
        };


        const renderAuthUI = () => {
            D.logoutBtn.classList.add('hidden');
            D.headerDetails.classList.add('hidden');
            
            const isLogin = appState.authView === 'login';
            const title = isLogin ? T('LOGIN_TITLE') : T('CREATE_TITLE');
            const buttonText = isLogin ? T('LOGIN_BUTTON') : T('CREATE_BUTTON');
            const linkText = isLogin ? T('NEED_ACCOUNT') : T('ALREADY_ACCOUNT');

            D.mainContent.innerHTML = `
                <div class="flex items-center justify-center min-h-[80vh] px-4">
                    <div class="w-full max-w-sm p-8 mt-12 auth-card rounded-xl" style="animation: flipIn 0.7s ease-out;">
                        <h2 class="text-3xl font-extrabold text-indigo-700 text-center mb-6">${title}</h2>
                        
                        <form id="auth-form" class="space-y-6">
                            <div>
                                <label for="email" class="sr-only">Email</label>
                                <input type="email" id="auth-email" required placeholder="${T('EMAIL_PLACEHOLDER')}"
                                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" />
                            </div>
                            
                            <div>
                                <label for="password" class="sr-only">Password</label>
                                <input type="password" id="auth-password" required placeholder="${T('PASSWORD_PLACEHOLDER')}"
                                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" />
                            </div>
                            
                            <button type="submit" id="auth-submit-btn" class="auth-button w-full py-3 px-4 rounded-lg text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition duration-150">
                                ${buttonText}
                            </button>
                        </form>
                        
                        ${isLogin ? `
                            <div class="mt-4 text-center">
                                <button id="forgot-password-btn" class="text-sm font-medium text-red-500 hover:text-red-700 transition duration-150">
                                    ${T('FORGOT_PASSWORD_LINK')}
                                </button>
                            </div>
                        ` : ''}

                        <div class="mt-6 text-center">
                            <button id="auth-toggle-view" class="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150">
                                ${linkText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Attach Auth Event Listeners
            document.getElementById('auth-toggle-view').onclick = () => {
                appState.authView = isLogin ? 'create' : 'login';
                renderAuthUI();
            };
            document.getElementById('auth-form').onsubmit = (e) => {
                e.preventDefault();
                const email = document.getElementById('auth-email').value;
                const password = document.getElementById('auth-password').value;
                
                // --- FIX: Client-side password validation to prevent auth/weak-password error ---
                if (!isLogin && password.length < 6) {
                    setAlert('Password must be at least 6 characters long.', 'error');
                    return; 
                }
                
                if (isLogin) {
                    handleLogin(email, password);
                } else {
                    handleCreateAccount(email, password);
                }
            };
            
            if (isLogin) {
                 document.getElementById('forgot-password-btn').onclick = handleForgotPassword;
            }
            
            // Hide FAB when on auth screen
            D.fabContainer.innerHTML = '';
            D.chatWindowContainer.innerHTML = '';
        };

        const renderSummaryCards = (summary) => {
            const { totalIncome, totalExpense, netBalance } = summary;
            const balanceColor = netBalance > 0 ? 'text-green-600' : (netBalance < 0 ? 'text-red-600' : 'text-gray-800');
            const balanceSign = netBalance >= 0 ? '₹' : '-₹';
            const balanceValue = formatCurrency(Math.abs(netBalance)).replace('₹', '').trim();

            return `
                <div class="p-3 bg-green-100 rounded-lg text-center shadow-sm card-flip-animation" style="animation-delay: 0s;">
                    <p class="text-xs text-green-700 font-medium">${T('TOTAL_INCOME')}</p>
                    <p class="text-sm sm:text-lg font-bold text-green-600">${formatCurrency(totalIncome)}</p>
                </div>
                <div class="p-3 bg-red-100 rounded-lg text-center shadow-sm card-flip-animation" style="animation-delay: 0.1s;">
                    <p class="text-xs text-red-700 font-medium">${T('TOTAL_EXPENSE')}</p>
                    <p class="text-sm sm:text-lg font-bold text-red-600">${formatCurrency(totalExpense)}</p>
                </div>
                <div class="p-3 rounded-lg text-center shadow-md ${netBalance >= 0 ? 'bg-indigo-100' : 'bg-yellow-100'} card-flip-animation" style="animation-delay: 0.2s;">
                    <p class="text-xs text-gray-700 font-medium">${T('NET_BALANCE')}</p>
                    <p class="text-sm sm:text-lg font-extrabold ${balanceColor}">
                        ${formatCurrency(netBalance)}
                    </p>
                </div>
            `;
        };

        const renderTransactionForm = () => {
            const isExpense = appState.type === 'expense';
            return `
                <form id="transaction-form" class="p-4 bg-white shadow-lg mb-4">
                    <h2 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">${T('SMART_ENTRY_TITLE')}</h2>

                    <!-- Type Selector Tabs -->
                    <div class="flex mb-4">
                        <button type="button" id="type-expense-btn"
                            class="flex-1 py-2 text-center font-medium rounded-l-lg transition ${isExpense ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
                            ${T('EXPENSE')}
                        </button>
                        <button type="button" id="type-income-btn"
                            class="flex-1 py-2 text-center font-medium rounded-r-lg transition ${!isExpense ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
                            ${T('INCOME')}
                        </button>
                    </div>

                    <!-- Description/AI/Voice Input -->
                    <div class="space-y-3">
                        <div>
                            <label for="description-input" class="block text-sm font-medium text-gray-700">${T('DESCRIPTION_LABEL')}</label>
                            <div class="flex space-x-1 sm:space-x-2">
                                <button type="button" id="voice-entry-btn" class="mt-1 flex-shrink-0 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition duration-150 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                                        <path d="M5.5 13.5A4.5 4.5 0 0010 18v-2.5a2.5 2.5 0 01-5 0V13.5zM10 18a4.5 4.5 0 004.5-4.5V13.5a2.5 2.5 0 01-5 0V18zM14.5 13.5a2.5 2.5 0 01-5 0V18a4.5 4.5 0 004.5-4.5z" />
                                    </svg>
                                </button>
                                <input
                                    id="description-input" type="text" value="${appState.description}"
                                    placeholder="${T('DESCRIPTION_PLACEHOLDER')}" required
                                    class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                    type="button" id="ai-analyze-btn" ${appState.isAnalyzing || !appState.description.trim() ? 'disabled' : ''}
                                    class="mt-1 flex-shrink-0 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 text-sm"
                                >
                                    ${appState.isAnalyzing ? T('THINKING_BUTTON') : T('AI_ANALYZE_BUTTON')}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Category & Amount & GST -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <div>
                            <label for="category-display" class="block text-sm font-medium text-gray-700">${T('CATEGORY_LABEL')}</label>
                            <div id="category-display" class="mt-1 block w-full p-3 bg-indigo-50 border border-indigo-300 rounded-md text-sm font-semibold text-indigo-800 truncate">
                                ${appState.category}
                            </div>
                        </div>
                        <div>
                            <label for="amount-input" class="block text-sm font-medium text-gray-700">${T('AMOUNT_LABEL')}</label>
                            <input id="amount-input" type="number" value="${appState.amount}"
                                placeholder="${T('AMOUNT_PLACEHOLDER')}" required min="1"
                                class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                            />
                        </div>
                        
                        <!-- Business & GST Fields -->
                        ${isExpense ? `
                            <div class="flex flex-col justify-end">
                                <label class="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <input type="checkbox" id="is-business-checkbox" ${appState.isBusiness ? 'checked' : ''}
                                        class="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2" />
                                    ${T('BUSINESS_RELATED')}
                                </label>
                                <input type="number" id="gst-amount-input" value="${appState.gstAmount}"
                                    placeholder="${T('GST_AMOUNT')}" ${!appState.isBusiness ? 'disabled' : ''}
                                    class="mt-1 block w-full p-3 border rounded-md text-sm ${!appState.isBusiness ? 'bg-gray-100' : 'border-gray-300 focus:ring-indigo-500'}"
                                />
                            </div>
                        ` : '<div></div>'}
                    </div>
                    
                    <button type="submit" ${appState.isSaving ? 'disabled' : ''}
                        class="mt-6 w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-150"
                    >
                        ${appState.isSaving ? T('SAVING_BUTTON') : T(isExpense ? 'RECORD_DEBIT' : 'RECORD_CREDIT')}
                    </button>
                </form>
            `;
        };

        const renderGoalTracker = () => {
            const container = document.getElementById('goals-tracker-container');
            const [showForm, setShowForm] = [container.dataset.showForm === 'true', (value) => {
                container.dataset.showForm = value;
                renderGoalTracker();
            }];

            const visibleGoals = appState.goals.slice(0, appState.visibleGoalsCount);
            const hasMoreGoals = appState.goals.length > appState.visibleGoalsCount;
            const showLessGoals = appState.visibleGoalsCount > 3;


            const goalCards = visibleGoals.map(goal => {
                const remaining = goal.targetAmount - (goal.saved_amount
 || 0);
                const progress = Math.min(100, ((goal.saved_amount || 0) / goal.targetAmount) * 100);
                const diffDays = Math.max(1, (new Date(goal.targetDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const requiredDaily = (remaining / diffDays);
                const isCompleted = remaining <= 0;

                return `
                    <div class="p-4 rounded-xl shadow-md transition ${isCompleted ? 'bg-teal-100 border-2 border-teal-500' : 'bg-blue-50 border border-blue-200'}">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="font-bold text-lg text-gray-800">${goal.name}</h3>
                            <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${isCompleted ? 'bg-teal-500 text-white' : 'bg-blue-200 text-blue-800'}">
                                ${isCompleted ? T('GOAL_COMPLETED') : new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <p class="text-sm text-gray-600 mb-2">
                            Target: <span class="font-bold">${formatCurrency(goal.targetAmount)}</span>
                        </p>

                        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${progress}%;"></div>
                        </div>
                        <div class="flex justify-between text-xs text-gray-600 mb-3">
                            <span>${formatCurrency(goal.saved_amount || 0)} Saved</span>
                            <span>${formatCurrency(remaining > 0 ? remaining : 0)} Remaining</span>
                        </div>

                        ${!isCompleted ? `
                            <div class="text-center bg-white p-2 rounded-lg border border-dashed border-blue-300">
                                <p class="text-xs font-medium text-blue-700">
                                    ${T('REQUIRED_DAILY')}: <span class="font-extrabold text-base">${formatCurrency(requiredDaily)}</span>
                                </p>
                            </div>
                            <div class="mt-3 text-center">
                                <input id="add-money-goal-${goal.id}" type="number" placeholder="e.g. 200"
                                       class="w-24 border p-1 rounded text-sm mr-2" />
                                <button onclick="addMoneyToGoal('${goal.id}')"
                                        class="bg-green-600 text-white px-3 py-1 rounded text-sm">Add</button>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');

            container.innerHTML = `
                <div class="p-4">
                    <div class="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 class="text-xl font-semibold text-gray-800">${T('GOALS_TITLE')} (${appState.goals.length})</h2>
                        <button id="add-goal-toggle" class="text-sm bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
                            ${showForm ? 'Close' : T('ADD_NEW_GOAL')}
                        </button>
                    </div>

                    <!-- Goal Form -->
                    ${showForm ? `
                        <form id="goal-form" class="p-4 mb-4 bg-white rounded-xl shadow-inner space-y-3">
                            <input name="goalName" placeholder="${T('GOAL_NAME')}" required class="w-full p-2 border rounded" />
                            <input name="targetAmount" type="number" placeholder="${T('GOAL_TARGET')}" required min="1" class="w-full p-2 border rounded" />
                            <label class="text-sm text-gray-600 block mt-2">${T('GOAL_DATE')}</label>
                            <input name="targetDate" type="date" required class="w-full p-2 border rounded" />
                            <button type="submit" class="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">
                                ${T('SAVE_GOAL_BUTTON')}
                            </button>
                        </form>
                    ` : ''}

                    ${appState.goals.length === 0 ? `
                        <p class="text-gray-500 text-center py-4">Set a savings goal to start planning!</p>
                    ` : `
                        <div class="space-y-4">
                            ${goalCards}
                        </div>

                        <!-- Show More/Less Buttons -->
                        <div class="mt-4 flex justify-center space-x-4">
                            ${hasMoreGoals ? `
                                <button id="show-more-goals" class="text-sm font-medium text-blue-600 hover:underline">Show More</button>
                            ` : ''}
                            ${showLessGoals ? `
                                <button id="show-less-goals" class="text-sm font-medium text-gray-600 hover:underline">Show Less</button>
                            ` : ''}
                        </div>

                    `}
                </div>
            `;
            
            // Attach event listeners for Goal Tracker
            document.getElementById('add-goal-toggle').onclick = () => setShowForm(!showForm);
            if (showForm) document.getElementById('goal-form').onsubmit = handleAddGoal;

            if (hasMoreGoals) {
                document.getElementById('show-more-goals').onclick = () => {
                    appState.visibleGoalsCount += 3;
                    renderGoalTracker();
                };
            }
            if (showLessGoals) {
                document.getElementById('show-less-goals').onclick = () => {
                    appState.visibleGoalsCount = 3;
                    renderGoalTracker();
                };
            }
        };

        const renderObligationsTracker = () => {
            const container = document.getElementById('obligations-tracker-container');
            const [showForm, setShowForm] = [container.dataset.showForm === 'true', (value) => {
                container.dataset.showForm = value;
                renderObligationsTracker();
            }];

            const visibleObligations = appState.obligations.slice(0, appState.visibleObligationsCount);
            const hasMoreObligations = appState.obligations.length > appState.visibleObligationsCount;
            const showLessObligations = appState.visibleObligationsCount > 3;


            const obligationCards = visibleObligations.map(obligation => {
                const isAlert = isDueSoon(obligation.dueDate) && !obligation.isPaid;
                const daysLeft = Math.ceil((new Date(obligation.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                return `
                    <div class="p-3 rounded-xl flex justify-between items-center shadow-sm transition ${isAlert ? 'bg-yellow-100 border-l-4 border-yellow-500' : (obligation.isPaid ? 'bg-green-50 border-l-4 border-green-300' : 'bg-white border-l-4 border-gray-300')}">
                        <div>
                            <h3 class="font-semibold text-gray-800">${obligation.description}</h3>
                            <p class="text-sm text-gray-500">
                                ${T('DUE_DATE')}: <span class="font-medium text-red-600">${new Date(obligation.dueDate).toLocaleDateString()}</span>
                                ${!obligation.isPaid && daysLeft >= 0 ? `<span class="ml-2 text-xs font-bold text-yellow-700">(${daysLeft} days left)</span>` : ''}
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="font-extrabold text-lg text-red-600 mb-1">${formatCurrency(obligation.amount)}</p>
                            ${obligation.isPaid ? `
                                <button disabled class="text-xs bg-gray-400 text-white px-3 py-1 rounded-full cursor-not-allowed">
                                    Paid
                                </button>
                            ` : `
                                <button data-id="${obligation.id}" class="mark-paid-btn text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition">
                                    ${T('MARK_PAID')}
                                </button>
                            `}
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = `
                <div class="p-4">
                    <div class="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 class="text-xl font-semibold text-gray-800">${T('OBLIGATIONS_TITLE')} (${appState.obligations.length})</h2>
                        <button id="add-obligation-toggle" class="text-sm bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition">
                            ${showForm ? 'Close' : T('ADD_OBLIGATION')}
                        </button>
                    </div>

                    <!-- Obligation Form -->
                    ${showForm ? `
                        <form id="obligation-form" class="p-4 mb-4 bg-white rounded-xl shadow-inner space-y-3">
                            <input name="obligationDescription" placeholder="What is due? (e.g., Credit Card Bill)" required class="w-full p-2 border rounded" />
                            <input name="obligationAmount" type="number" placeholder="${T('AMOUNT_LABEL')}" required min="1" class="w-full p-2 border rounded" />
                            <label class="text-sm text-gray-600 block mt-2">${T('DUE_DATE')}</label>
                            <input name="obligationDueDate" type="date" required class="w-full p-2 border rounded" />
                            <button type="submit" class="w-full py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700">
                                ${T('ADD_OBLIGATION')}
                            </button>
                        </form>
                    ` : ''}

                    ${appState.obligations.length === 0 ? `
                        <p class="text-gray-500 text-center py-4">${T('NO_OBLIGATIONS')}</p>
                    ` : `
                        <div class="space-y-3">
                            ${obligationCards}
                        </div>

                        <!-- Show More/Less Buttons -->
                        <div class="mt-4 flex justify-center space-x-4">
                            ${hasMoreObligations ? `
                                <button id="show-more-obligations" class="text-sm font-medium text-blue-600 hover:underline">Show More</button>
                            ` : ''}
                            ${showLessObligations ? `
                                <button id="show-less-obligations" class="text-sm font-medium text-gray-600 hover:underline">Show Less</button>
                            ` : ''}
                        </div>

                    `}
                </div>
            `;
            
            // Attach event listeners for Obligations Tracker
            document.getElementById('add-obligation-toggle').onclick = () => setShowForm(!showForm);
            if (showForm) document.getElementById('obligation-form').onsubmit = handleAddObligation;

            if (hasMoreObligations) {
                document.getElementById('show-more-obligations').onclick = () => {
                    appState.visibleObligationsCount += 3;
                    renderObligationsTracker();
                };
            }
            if (showLessObligations) {
                document.getElementById('show-less-obligations').onclick = () => {
                    appState.visibleObligationsCount = 3;
                    renderObligationsTracker();
                };
            }
            
            document.querySelectorAll('.mark-paid-btn').forEach(button => {
                button.onclick = () => {
                    const obligationId = button.dataset.id;
                    const obligation = appState.obligations.find(o => o.id == obligationId);
                    if (obligation) markObligationPaid(obligation);
                };
            });
        };
        
        const renderBudgetsTracker = () => {
            const container = document.getElementById('budgets-tracker-container');
            if (!container) return;
        
            const [showForm, setShowForm] = [container.dataset.showForm === 'true', (value) => {
                container.dataset.showForm = value;
                renderBudgetsTracker();
            }];
        
            const visibleBudgets = (appState.budgets || []).slice(0, appState.visibleBudgetsCount);
            const hasMoreBudgets = (appState.budgets || []).length > appState.visibleBudgetsCount;
            const showLessBudgets = appState.visibleBudgetsCount > 3;

            const budgetCards = visibleBudgets.map(budget => {
                const spent = budget.spent_amount || 0;
                const remaining = budget.amount - spent;
                const progress = Math.min(100, (spent / budget.amount) * 100);
                const isExceeded = remaining < 0;
        
                return `
                    <div class="p-4 rounded-xl shadow-md transition ${isExceeded ? 'bg-red-100 border-2 border-red-500' : 'bg-purple-50 border border-purple-200'}">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="font-bold text-lg text-gray-800">${budget.category}</h3>
                            <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${isExceeded ? 'bg-red-500 text-white' : 'bg-purple-200 text-purple-800'}">
                                ${isExceeded ? 'Exceeded' : 'On Track'}
                            </span>
                        </div>
                        
                        <p class="text-sm text-gray-600 mb-2">
                            Budget: <span class="font-bold">${formatCurrency(budget.amount, budget.currency)}</span>
                        </p>
        
                        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div class="${isExceeded ? 'bg-red-600' : 'bg-purple-600'} h-2.5 rounded-full" style="width: ${progress}%;"></div>
                        </div>
                        <div class="flex justify-between text-xs text-gray-600 mb-3">
                            <span>${formatCurrency(spent, budget.currency)} Spent</span>
                            <span class="${isExceeded ? 'text-red-600 font-bold' : ''}">${formatCurrency(remaining, budget.currency)} Remaining</span>
                        </div>

                        <div class="flex justify-end space-x-3 mt-3 pt-2 border-t border-purple-200">
                           <button class="text-xs text-blue-600 hover:underline" onclick="editBudget(${budget.id})">Edit</button>
                           <button class="text-xs text-red-600 hover:underline" onclick="deleteBudget(${budget.id})">Delete</button>
                        </div>
                    </div>
                `;
            }).join('');
        
            container.innerHTML = `
                <div class="p-4">
                    <div class="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 class="text-xl font-semibold text-gray-800">${T('budgets_title')} (${(appState.budgets || []).length})</h2>
                        <button id="add-budget-toggle" class="text-sm bg-purple-500 text-white px-3 py-1 rounded-full hover:bg-purple-600 transition">
                            ${showForm ? 'Close' : T('add_new_budget')}
                        </button>
                    </div>
        
                    ${showForm ? `
                        <form id="budget-form" class="p-4 mb-4 bg-white rounded-xl shadow-inner space-y-3">
                            <input name="budgetCategory" placeholder="${T('budget_category')}" required class="w-full p-2 border rounded" />
                            <input name="budgetAmount" type="number" placeholder="${T('budget_amount')}" required min="1" class="w-full p-2 border rounded" />
                            <button type="submit" class="w-full py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700">${T('add_budget_button')}</button>
                        </form>
                    ` : ''}
        
                    ${(appState.budgets || []).length === 0 ? `<p class="text-gray-500 text-center py-4">Set a budget to track your spending!</p>` : `
                        <div class="space-y-4">${budgetCards}</div>
                        <!-- Show More/Less Buttons -->
                        <div class="mt-4 flex justify-center space-x-4">
                            ${hasMoreBudgets ? `
                                <button id="show-more-budgets" class="text-sm font-medium text-blue-600 hover:underline">Show More</button>
                            ` : ''}
                            ${showLessBudgets ? `
                                <button id="show-less-budgets" class="text-sm font-medium text-gray-600 hover:underline">Show Less</button>
                            ` : ''}
                        </div>
                    `}
                </div>
            `;
        
            document.getElementById('add-budget-toggle').onclick = () => setShowForm(!showForm);
            if (showForm) document.getElementById('budget-form').onsubmit = handleAddBudget;

            if (hasMoreBudgets) {
                document.getElementById('show-more-budgets').onclick = () => {
                    appState.visibleBudgetsCount += 3;
                    renderBudgetsTracker();
                };
            }
            if (showLessBudgets) {
                document.getElementById('show-less-budgets').onclick = () => {
                    appState.visibleBudgetsCount = 3;
                    renderBudgetsTracker();
                };
            }
        };

        const renderCategoryChart = (expensesByCategory) => {
            const container = document.getElementById('chart-container');
            const categories = Object.keys(expensesByCategory);
            if (categories.length === 0) {
                container.innerHTML = '';
                return;
            }

            // Sort categories by amount and take the top 7
            const sortedCategories = Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 7);

            if (sortedCategories.length === 0) return;

            const maxAmount = sortedCategories[0][1]; // The highest amount is the first one
            const barHeight = 20; 
            const height = sortedCategories.length * (barHeight + 10);

            let chartSVG = sortedCategories.map(([category, amount], index) => {
                const widthPercentage = (amount / maxAmount) * 100;
                const y = index * (barHeight + 10);
                const color = `hsl(${index * 50}, 70%, 50%)`;

                return `
                    <g transform="translate(0, ${y})">
                        <rect 
                            x="90" y="0" 
                            width="${widthPercentage * 2.5}px" 
                            height="${barHeight}" 
                            fill="${color}" rx="5"
                        />
                        <text x="0" y="${barHeight / 2 + 5}" font-size="12" fill="#4b5563" font-weight="bold" class="truncate w-10">${category}</text>
                        <text 
                            x="${95 + (widthPercentage * 2.5)}" y="${barHeight / 2 + 5}" 
                            font-size="12" fill="#1f2937" font-weight="semibold"
                        >
                            ${formatCurrency(amount)}
                        </text>
                    </g>
                `;
            }).join('');
            
            container.innerHTML = `
                <div class="mt-6 p-4 bg-white rounded-xl shadow-inner border border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Spending Distribution (AI Categories)</h3>
                    <svg width="100%" height="${height}" viewBox="0 0 350 ${height}">
                        ${chartSVG}
                    </svg>
                </div>
            `;
        };

        const renderTransactionHistory = () => {
            const container = document.getElementById('history-container');
            
            if (appState.transactions.length === 0) {
                container.innerHTML = `
                    <div class="flex justify-between items-center mb-4 border-b pb-2">
                         <h2 class="text-xl font-semibold text-gray-800 ">${T('HISTORY_TITLE')} (0)</h2>
                         <button id="export-tax-btn" class="text-xs bg-indigo-500 text-white px-3 py-1 rounded-full hover:bg-indigo-600 transition disabled:opacity-50" disabled>
                            ${T('EXPORT_TAX')}
                         </button>
                    </div>
                    <p class="text-gray-500 text-center py-8">${T('NO_ENTRIES')}</p>
                `;
                return;
            }

            const visibleTransactions = appState.transactions.slice(0, appState.visibleTransactionsCount);
            const hasMoreTransactions = appState.transactions.length > appState.visibleTransactionsCount;
            const showLessTransactions = appState.visibleTransactionsCount > 5;

            const historyList = visibleTransactions.map(t => {
                const isIncome = t.type === 'income';
                const colorClass = isIncome ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400';
                const amountColor = isIncome ? 'text-green-600' : 'text-red-600';

                const icon = isIncome 
                    ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>` 
                    : `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>`;

                return `
                    <div class="p-3 rounded-xl flex items-center justify-between shadow-sm transition ${colorClass}">
                        <div class="flex items-center space-x-3">
                            ${icon}
                            <div>
                                <p class="font-semibold text-gray-800 line-clamp-1">${t.description}</p>
                                <p class="text-xs text-gray-500 mt-0.5">
                                    <span class="font-bold text-indigo-700 mr-2">[${t.category || 'Uncategorized'}]</span>
                                    ${t.timestamp.toLocaleDateString()}
                                </p>
                                ${t.isBusiness && !isIncome ? `<p class="text-xs text-yellow-700 font-medium">Business: GST ₹${(t.gstAmount || 0).toFixed(0)}</p>` : ''}
                            </div>
                        </div>
                        <p class="font-extrabold text-lg ${amountColor}">
                            ${formatCurrency(t.amount, t.currency)}
                        </p>
                    </div>
                `;
            }).join('');
            
            container.innerHTML = `
                <div class="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 class="text-xl font-semibold text-gray-800 ">${T('HISTORY_TITLE')} (${appState.transactions.length})</h2>
                    <button id="export-tax-btn" class="text-xs bg-indigo-500 text-white px-3 py-1 rounded-full hover:bg-indigo-600 transition">
                       ${T('EXPORT_TAX')}
                    </button>
                </div>
                <div class="space-y-3 pb-20">
                    ${historyList}

                    <!-- Show More/Less Buttons -->
                    <div class="mt-4 flex justify-center space-x-4">
                        ${hasMoreTransactions ? `
                            <button id="show-more-transactions" class="text-sm font-medium text-blue-600 hover:underline">Show More</button>
                        ` : ''}
                        ${showLessTransactions ? `
                            <button id="show-less-transactions" class="text-sm font-medium text-gray-600 hover:underline">Show Less</button>
                        ` : ''}
                    </div>
                </div>
            `;
            document.getElementById('export-tax-btn').onclick = exportTaxLedger;

            if (hasMoreTransactions) {
                document.getElementById('show-more-transactions').onclick = () => {
                    appState.visibleTransactionsCount += 5;
                    renderTransactionHistory();
                };
            }
            if (showLessTransactions) {
                document.getElementById('show-less-transactions').onclick = () => {
                    appState.visibleTransactionsCount = 5;
                    renderTransactionHistory();
                };
            }
        };
        
        // --- CHATBOT UI & LOGIC ---

        const toggleChat = () => {
            appState.isChatOpen = !appState.isChatOpen;
            updateUI();
        };
        
        const renderChatFAB = () => {
            // If the chat window is open, do not render the FAB.
            if (appState.isChatOpen) {
                D.fabContainer.innerHTML = '';
                return;
            }

            const chatIcon = `
                <div class="logo-container" style="width: 56px; height: 56px;">
                    <div class="fluid-shape">
                        <span class="g-letter" style="font-size: 2rem;">G</span>
                    </div>
                </div>`;
            
            // Get user name, default to 'there' if not available
            const userName = appState.userName ? appState.userName.split(' ')[0] : 'there';
            const helpMessageWords = `Hi ${userName}, how can I help you?`.split(' ');

            D.fabContainer.innerHTML = `
                <div id="chat-fab-wrapper" class="fixed bottom-6 right-6 z-40 flex items-center group">
                    <div class="fab-tooltip">
                        <div class="fab-tooltip-text-container">
                            ${helpMessageWords.map((word, index) => 
                                `<span class="fab-tooltip-word" style="animation-delay: ${index * 0.5}s">${word}</span>`
                            ).join(' ')}
                        </div>
                    </div>
                    <button id="chat-fab" class="rounded-full shadow-lg hover:bg-pink-700 transition duration-150 transform hover:scale-105">
                        ${chatIcon}
                    </button>
                </div>
            `;
            document.getElementById('chat-fab').onclick = toggleChat;
        };
        
        const renderChatWindow = () => {
            if (!appState.isChatOpen) {
                D.chatWindowContainer.innerHTML = '';
                return;
            }

            // Predefined auto-suggestions when chat opens
            const autoSuggestions = [
                'Summarize this month expenses',
                'Suggest monthly budgets',
                'Where am I overspending?',
                'Compare this month vs last month',
                'How much did I spend on groceries?',
            ];

            const suggestionsHTML = `
                <div id="chat-suggestions" class="p-3 border-b border-gray-200 bg-gray-100">
                    <p class="text-xs text-gray-600 font-medium mb-2">Try one of these:</p>
                    <div class="flex flex-wrap gap-2">
                        ${autoSuggestions.map(s => `<button class="suggestion-chip">${s}</button>`).join('')}
                    </div>
                </div>
            `;

            // Ensure the welcome message uses the correct language after render
            const initialHistory = appState.chatHistory.map(m => {
                if (m.role === 'model' && m.text === 'WELCOME_MESSAGE') {
                    return { role: 'model', text: T('WELCOME_MESSAGE') };
                }
                return m;
            });
            
            let chatBubbles = initialHistory.map(message => {
                const isUser = message.role === 'user';
                const alignment = isUser ? 'items-end' : 'items-start';
                const bubbleClass = isUser ? 'user-bubble' : 'ai-bubble';
                const margin = isUser ? 'ml-auto' : 'mr-auto';

                return `
                    <div class="flex ${alignment} mb-4">
                        <div class="max-w-xs sm:max-w-md p-3 shadow-md ${bubbleClass} ${margin}">
                            <p class="text-sm whitespace-pre-wrap">${message.text}</p>
                        </div>
                    </div>
                `;
            }).join('');

            // Add budget suggestion prompt if triggered
            if (appState.showBudgetSuggestionPrompt) {
                const suggestionBubble = `
                    <div class="flex items-start mb-4">
                        <div class="max-w-xs sm:max-w-md p-3 ai-bubble mr-auto">
                            <p class="text-sm">I see you have a few transactions but no budgets. Would you like me to suggest some based on your spending?</p>
                            <button id="suggest-budgets-btn" class="mt-2 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition">
                                Yes, suggest budgets
                            </button>
                        </div>
                    </div>
                `;
                chatBubbles += suggestionBubble;
                // Reset the prompt after showing
                appState.showBudgetSuggestionPrompt = false;
            }

            // Add thinking bubble if AI is processing
            if (appState.isChatThinking) {
                const thinkingText = T('THINKING_BUTTON');
                 const thinkingBubble = `
                    <div class="flex items-start mb-4">
                        <div class="max-w-xs sm:max-w-md p-3 ai-bubble mr-auto opacity-70">
                            <p class="text-sm animate-pulse">${thinkingText}</p>
                        </div>
                    </div>
                `;
                chatBubbles += thinkingBubble;
            }


            D.chatWindowContainer.innerHTML = `
                <div class="fixed inset-0 z-50 bg-gray-50 flex flex-col max-w-lg mx-auto shadow-2xl">
                    <!-- Chat Header -->
                    <div class="bg-indigo-700 text-white p-4 flex justify-between items-center shadow-md">
                        <h2 class="text-xl font-bold">${T('CHAT_TITLE')}</h2>
                        <button id="close-chat-btn" class="text-white hover:text-indigo-200 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <!-- Auto Suggestions -->
                    ${suggestionsHTML}

                    <!-- Chat Body (Messages) -->
                    <div id="chat-body" class="flex-1 overflow-y-auto p-4 space-y-4">
                        ${chatBubbles}
                    </div>

                    <!-- Chat Input -->
                    <form id="chat-input-form" class="p-4 bg-white border-t border-gray-200">
                        <div class="flex space-x-2">
                            <input
                                type="text" id="chat-input"
                                placeholder="${T('CHAT_PLACEHOLDER')}"
                                class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                ${appState.isChatThinking ? 'disabled' : ''}
                            />
                            <button
                                type="submit" id="chat-send-btn"
                                class="bg-teal-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition"
                                ${appState.isChatThinking ? 'disabled' : ''}
                            >
                                ${T('SEND')}
                            </button>
                        </div>
                    </form>
                </div>
            `;
            
            // Attach event listeners
            document.getElementById('close-chat-btn').onclick = toggleChat;
            document.getElementById('chat-input-form').onsubmit = handleChatQuery;
            
            // Attach listener for the budget suggestion button if it exists
            const suggestBudgetsBtn = document.getElementById('suggest-budgets-btn');
            if (suggestBudgetsBtn) {
                suggestBudgetsBtn.onclick = handleSuggestBudgets;
            }

            // Attach listeners for auto-suggestion chips
            document.querySelectorAll('#chat-suggestions .suggestion-chip').forEach(btn => {
                btn.addEventListener('click', () => {
                    const text = btn.textContent.trim();

                    // Map friendly text to commands
                    const commandMap = {
                        'Where am I overspending?': '/overspending',
                        'Suggest monthly budgets': '/suggest_budget',
                        'Summarize this month expenses': '/month_summary',
                        'Compare this month vs last month': '/compare_last_month',
                    };

                    const input = document.getElementById('chat-input');
                    if (input) {
                        input.value = commandMap[text] || text; // default normal text
                        input.focus();
                    }
                });
            });

            setTimeout(() => {
                const chatBody = document.getElementById('chat-body');
                if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
            }, 10);
        };

        const generateBudgetSuggestions = () => {
            const categorySpending = {};
            appState.transactions.forEach(t => {
                if (t.type === 'expense') {
                    const cat = t.category || 'Uncategorized';
                    categorySpending[cat] = (categorySpending[cat] || 0) + t.amount;
                }
            });

            const existingBudgets = new Set(appState.budgets.map(b => b.category));
            const suggestions = [];

            Object.entries(categorySpending).forEach(([category, spent]) => {
                if (!existingBudgets.has(category) && spent > 1000) { // Suggest for categories with >1000 spent and no budget
                    const suggestedAmount = Math.ceil(spent * 1.2 / 100) * 100; // Round up to nearest 100
                    suggestions.push({ category, suggestedAmount, spent });
                }
            });

            return suggestions;
        };

        const attachBudgetSuggestionListeners = () => {
            document.querySelectorAll('.apply-budget-btn').forEach(btn => {
                btn.onclick = async () => {
                    const category = btn.dataset.category;
                    const amount = parseFloat(btn.dataset.amount);
                    await applyBudget(category, amount, btn);
                };
            });

            const applyAllBtn = document.getElementById('apply-all-budgets-btn');
            if (applyAllBtn) {
                applyAllBtn.onclick = async () => {
                    const buttons = document.querySelectorAll('.apply-budget-btn');
                    applyAllBtn.disabled = true;
                    applyAllBtn.textContent = 'Applying...';
                    for (const btn of buttons) {
                        if (!btn.disabled) {
                            const category = btn.dataset.category;
                            const amount = parseFloat(btn.dataset.amount);
                            await applyBudget(category, amount, btn);
                        }
                    }
                    applyAllBtn.textContent = 'All Applied!';
                };
            }

            // Dismiss budget suggestion prompt
            const dismissBtn = document.getElementById('dismiss-budget-suggestions');
            if (dismissBtn) {
                dismissBtn.onclick = () => {
                    appState.showBudgetSuggestionPrompt = false;
                    renderChatWindow();
                };
            }
        };

        const applyBudget = async (category, amount, buttonElement) => {
            try {
                const now = new Date();
                const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                await fetch(`${API_BASE_URL}/budgets`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${appState.token}` },
                    body: JSON.stringify({ category, amount, monthYear })
                });
                if (buttonElement) {
                    buttonElement.textContent = 'Applied!';
                    buttonElement.disabled = true;
                    buttonElement.classList.remove('bg-green-600', 'hover:bg-green-700');
                    buttonElement.classList.add('bg-gray-400', 'cursor-not-allowed');
                }
            } catch (error) {
                console.error(`Failed to apply budget for ${category}:`, error);
                if (buttonElement) buttonElement.textContent = 'Failed!';
            }
        };

        const handleChatQuery = async (e, fixedMessage = null) => {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const queryText = fixedMessage || (input ? input.value.trim() : '');
            if (!queryText) return;

            // 1. Add user message and clear input
            appState.chatHistory.push({ role: 'user', text: queryText });
            if (input) input.value = '';

            // 2. Set thinking state and re-render
            appState.isChatThinking = true;
            renderChatWindow();

            // Add a timeout to the fetch request for better error handling
            const controller = new AbortController();
            const timeoutMs = 20000; // 20 seconds
            const timeout = setTimeout(() => controller.abort(), timeoutMs);


            // Prepare conversation with proper translation for welcome message
            const conversation = appState.chatHistory.map(msg => {
                let text = msg.text;
                if (msg.role === 'model' && text === 'WELCOME_MESSAGE') {
                    text = T('WELCOME_MESSAGE');
                }
                return { role: msg.role, text: text };
            });

            // 3. Call our new backend endpoint
            try {
                const response = await fetch(`${API_BASE_URL}/chat/query`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.token}`
                    },
                    body: JSON.stringify({
                        message: queryText,
                        history: conversation,
                        language: appState.currentLanguage
                    }),
                    signal: controller.signal // Attach the abort signal
                });

                clearTimeout(timeout); // Clear the timeout if we get a response

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `API error: ${response.status}`);
                }

                const result = await response.json();
                const aiText = result.text || T("Sorry, I couldn't process that. Please try rephrasing.");

                // 4. Add AI response to history
                appState.chatHistory.push({ role: 'model', text: aiText });

            } catch (error) {
                if (error.name === 'AbortError') {
                    console.error("Chatbot request timed out");
                    appState.chatHistory.push({ role: 'model', text: "The request took too long to respond. Please try a simpler question or check your network." });
                } else {
                    console.error("Chatbot API Failed:", error);
                    appState.chatHistory.push({ role: 'model', text: "I'm sorry, I'm having trouble connecting to the network right now. Please try again later." });
                }
            } finally {
                clearTimeout(timeout);
                appState.isChatThinking = false;
                renderChatWindow();
            }
        };

        const handleSuggestBudgets = () => {
            // This function will mimic handleChatQuery with a fixed message
            handleChatQuery({ preventDefault: () => {} }, '/suggest_budget');
        };

        // Main function to re-render the entire dynamic UI
        const updateUI = () => {
            if (appState.isLoading) {
                // Show loading screen, do nothing else
                return;
            }

    if (!appState.userId) { // Check if user is logged in
         renderAuthUI();
         // Ensure chat is closed on auth screen
         appState.isChatOpen = false;
         renderChatWindow();
         return;
    }
            
            // If logged in, render the main app container elements (header/fab)
            renderHeaderDetails(); 
            renderChatFAB(); // Always render FAB when logged in

            // New logic to switch main views
            if (appState.currentMainView === 'profile') {
                renderUserProfile();
            } else if (appState.currentMainView === 'admin' && isAdmin()) {
                renderAdminPanel();
            } else {
            // If logged in and not on profile/admin/groups view, render the dashboard
                renderDashboard();

                // Show admin button if user is admin
                const adminBtn = document.getElementById('admin-btn');
                if (adminBtn) {
                    adminBtn.style.display = appState.isAdmin ? 'inline-block' : 'none';
                }
            }
            
            renderChatWindow(); // Ensure chat window updates on language/thinking state change
            
            // Check for obligations due TODAY
            const dueToday = appState.obligations.find(o => isDueToday(o.dueDate) && !o.isPaid);
            if (dueToday) {
                setAlert(T('DUE_TODAY_ALERT').replace('%s', dueToday.description), 'error');
            } else {
                 // Clear error alert if no obligations are due today
                 if (appState.alert.type === 'error') setAlert('', '');
            }

            // Check for goals completed (simple check to trigger alert)
            const completedGoals = appState.goals.filter(g => g.savedAmount >= g.targetAmount);
            if (completedGoals.length > 0) {
                 setAlert(T('GOAL_COMPLETED') + `: ${completedGoals[0].name}!`, 'success');
                 // Send email alert for completed goals
                 sendGoalCompletionAlertEmail(completedGoals[0]);
            }
            renderAlertBanner();
        };

        // --- ONBOARDING TOUR LOGIC ---
        const tourSteps = [
            {
                element: '#transaction-form',
                title: 'Welcome to Gamyartha!',
                text: 'This is the Smart Entry form. You can add expenses or income here. Use the "AI Analyze" button to automatically fill details from a text message or note!',
                position: 'bottom'
            },
            {
                element: '#summary-cards',
                title: 'Your Financial Summary',
                text: 'Quickly see your total income, expenses, and net balance for the current period at a glance.',
                position: 'bottom'
            },
            {
                element: '#obligations-tracker-container',
                title: 'Due Date Alerts',
                text: 'Never miss a bill payment again! Add your credit card bills, rent, or any recurring payments here to get timely reminders.',
                position: 'top'
            },
            {
                element: '#goals-tracker-container',
                title: 'Savings Goals',
                text: 'Planning for a vacation or a new gadget? Set your savings goals here and track your progress towards achieving them.',
                position: 'top'
            },
            {
                element: '#budgets-tracker-container',
                title: 'Monthly Budgets',
                text: 'Set monthly spending limits for different categories to keep your finances in check. We\'ll warn you if you\'re about to go over!',
                position: 'top'
            },
            {
                element: '#history-container',
                title: 'Transaction History',
                text: 'All your recorded income and expenses will appear here. You can see your full financial history at a glance.',
                position: 'top'
            },
            {
                element: '#chat-fab-wrapper',
                title: 'Your AI Financial Advisor',
                text: 'This is Gamyartha, your personal AI assistant. Click here to ask financial questions, get budget suggestions, or analyze your spending habits.',
                position: 'left'
            }
        ];

    const waitForElement = (selector, callback) => {
        const element = document.querySelector(selector);
        if (element) {
            callback();
        } else {
            let attempts = 0;
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                attempts++;
                if (el) {
                    clearInterval(interval);
                    callback();
                } else if (attempts > 20) { // Give up after 2 seconds
                    clearInterval(interval);
                    console.warn(`Onboarding tour could not find element: ${selector}`);
                }
            }, 100);
        }
    };

        let currentTourStep = 0;

        const startOnboardingTour = () => {
            currentTourStep = 0;
            showTourStep(currentTourStep);
        };

        const showTourStep = (stepIndex) => {
            if (stepIndex >= tourSteps.length) {
                endOnboardingTour();
                return;
            }

            const step = tourSteps[stepIndex];
            
            // Use the waitForElement utility to prevent race conditions
            waitForElement(step.element, () => {
                const targetElement = document.querySelector(step.element);

                if (!targetElement) {
                    // If element still doesn't exist after waiting, skip to next step
                    showTourStep(stepIndex + 1);
                    return;
                }

                const rect = targetElement.getBoundingClientRect();
                
                let popoverStyle = '';
                switch(step.position) {
                    case 'bottom': popoverStyle = `top: ${rect.bottom + 15}px; left: ${rect.left}px;`; break;
                    case 'top': popoverStyle = `bottom: ${window.innerHeight - rect.top + 15}px; left: ${rect.left}px;`; break;
                    case 'left': popoverStyle = `top: ${rect.top}px; right: ${window.innerWidth - rect.left + 15}px;`; break;
                    case 'right': popoverStyle = `top: ${rect.top}px; left: ${rect.right + 15}px;`; break;
                }

                D.onboardingContainer.innerHTML = `
                    <div class="onboarding-overlay"></div>
                    <div class="onboarding-popover" style="${popoverStyle}">
                        <h3>${step.title}</h3>
                        <p>${step.text}</p>
                        <div class="mt-4 flex justify-between items-center">
                            <button id="skip-tour-btn" class="text-xs text-gray-500 hover:underline">Skip Tour</button>
                            <button id="next-tour-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
                                ${stepIndex === tourSteps.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>
                `;

                targetElement.classList.add('onboarding-highlight');

                document.getElementById('next-tour-btn').onclick = () => {
                    targetElement.classList.remove('onboarding-highlight');
                    showTourStep(stepIndex + 1);
                };
                document.getElementById('skip-tour-btn').onclick = () => {
                    targetElement.classList.remove('onboarding-highlight');
                    endOnboardingTour();
                };
            });
        };

        const endOnboardingTour = () => {
            D.onboardingContainer.innerHTML = '';
            localStorage.setItem('hasVisitedGamyartha', 'true');
        };


        // --- AUTH LOGIC (Error handling updated) ---

        const handleLogin = async (email, password) => {
            const submitBtn = document.getElementById('auth-submit-btn');
            // Defensive: if button not present, bail out
            if (!submitBtn) return;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging In...';

            // Use AbortController to timeout the fetch if server doesn't respond
            const controller = new AbortController();
            const timeoutMs = 10000; // 10 seconds
            const timeout = setTimeout(() => controller.abort(), timeoutMs);

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                    signal: controller.signal
                });

                // Clear timeout once we have a response
                clearTimeout(timeout);

                // Try to parse JSON safely
                let data;
                try {
                    data = await response.json();
                } catch (parseErr) {
                    throw new Error('Invalid server response');
                }

                if (!response.ok) {
                    throw new Error(data.error || 'Login failed');
                }

                // Store token and user data
                appState.token = data.token;
                appState.userId = data.user.id;
                appState.userEmail = data.user.email;
                appState.userName = data.user.full_name;
                appState.isAdmin = data.user.is_admin;

                localStorage.setItem('authToken', data.token);

                setAlert('Login successful! Welcome back.', 'success');

                // Show welcome message in chat
                const welcomeMessage = T('WELCOME_MESSAGE');
                appState.chatHistory = [{role: 'model', text: welcomeMessage}];
                renderChatWindow();

                await initializeListeners(); // Fetch user data after successful login

                // Check for first-time visit
                if (!localStorage.getItem('hasVisitedGamyartha')) {
                    // Add a small delay to ensure the dashboard is fully rendered before starting the tour
                    setTimeout(startOnboardingTour, 500);
                }

                updateUI(); // Re-render the UI to show the dashboard

            } catch (error) {
                // Differentiate abort from other errors
                if (error.name === 'AbortError') {
                    console.error('Login request timed out');
                    setAlert('Login timed out. Please check your network or backend server and try again.', 'error');
                } else {
                    console.error('Login Error:', error.message || error);
                    setAlert(error.message || 'Login failed. Please check your credentials.', 'error');
                }
            } finally {
                // Ensure button is always re-enabled and text restored
                clearTimeout(timeout);
                submitBtn.disabled = false;
                submitBtn.textContent = T('LOGIN_BUTTON');
            }
        };

        const handleCreateAccount = async (email, password) => {
            const submitBtn = document.getElementById('auth-submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Account...';

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        full_name: email.split('@')[0]
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Account creation failed');
                }

                // Store token and user data
                appState.token = data.token;
                appState.userId = data.user.id;
                appState.userEmail = data.user.email;
                appState.userName = data.user.full_name;
                appState.isAdmin = data.user.is_admin;

                localStorage.setItem('authToken', data.token);

                setAlert('Account created successfully! Welcome email sent.', 'success');

                // Show welcome message in chat
                const welcomeMessage = T('WELCOME_MESSAGE');
                appState.chatHistory = [{role: 'model', text: welcomeMessage}];
                renderChatWindow();

                await initializeListeners(); // Fetch user data after successful account creation

                // Start onboarding for new users
                // Add a small delay to ensure the dashboard is fully rendered before starting the tour
                setTimeout(startOnboardingTour, 500);

                updateUI(); // Re-render the UI to show the dashboard
            } catch (error) {
                console.error("Create Account Error:", error.message);
                setAlert(error.message || 'Account creation failed.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = T('CREATE_BUTTON');
            }
        };

        const handleForgotPassword = async () => {
            const emailInput = document.getElementById('auth-email');
            const email = emailInput ? emailInput.value : '';

            if (!email) {
                setAlert("Please enter your email address to reset your password.", 'error');
                return;
            }

            const forgotBtn = document.getElementById('forgot-password-btn');
            forgotBtn.disabled = true;
            forgotBtn.textContent = 'Sending Code...';

            try {
                const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to send reset code');
                }

                console.log('Password reset code sent successfully');

                // Store email and code for verification
                sessionStorage.setItem('resetEmail', email);
                sessionStorage.setItem('resetCode', data.resetCode); // Store the code

                setAlert(`Password reset code sent. In development, your code is: ${data.resetCode}`, 'success');

                // Show code input field
                showPasswordResetCodeInput(email);

            } catch (error) {
                console.error('Forgot password error:', error);
                setAlert(error.message || 'Failed to send reset code. Please try again.', 'error');
            } finally {
                forgotBtn.disabled = false;
                forgotBtn.textContent = T('FORGOT_PASSWORD_LINK');
            }
        };

        const showPasswordResetCodeInput = (email) => {
            const authForm = document.getElementById('auth-form');
            const existingCodeInput = document.getElementById('reset-code-input');

            if (existingCodeInput) return; // Already showing

            // Retrieve the code from session storage to pre-fill the input
            const resetCode = sessionStorage.getItem('resetCode') || '';

            // Add code input field
            const codeInputHTML = `
                <div id="reset-code-section" class="space-y-4 mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 class="text-lg font-semibold text-blue-800">Enter Reset Code</h3>
                    <p class="text-sm text-blue-600">Check your email for the 6-digit code sent to ${email}</p>
                    <div>
                        <label for="reset-code-input" class="sr-only">Reset Code</label>
                        <input type="text" id="reset-code-input" value="${resetCode}" required placeholder="Enter 6-digit code"
                               class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center text-2xl font-mono tracking-widest" maxlength="6" />
                    </div>
                    <div>
                        <label for="new-password-input" class="sr-only">New Password</label>
                        <input type="password" id="new-password-input" required placeholder="Enter new password (min 6 chars)"
                               class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <button type="button" id="verify-reset-code-btn" class="w-full py-3 px-4 rounded-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition duration-150">
                        Reset Password
                    </button>
                    <button type="button" id="cancel-reset-btn" class="w-full py-2 px-4 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 transition duration-150">
                        Cancel
                    </button>
                </div>
            `;

            authForm.insertAdjacentHTML('afterend', codeInputHTML);

            // Attach event listeners
            document.getElementById('verify-reset-code-btn').onclick = () => verifyResetCode(email);
            document.getElementById('cancel-reset-btn').onclick = hidePasswordResetCodeInput;
        };

        const hidePasswordResetCodeInput = () => {
            const resetSection = document.getElementById('reset-code-section');
            if (resetSection) {
                resetSection.remove();
            }
        };

        const verifyResetCode = async (email) => {
            const codeInput = document.getElementById('reset-code-input');
            const newPasswordInput = document.getElementById('new-password-input');
            const verifyBtn = document.getElementById('verify-reset-code-btn');

            const enteredCode = codeInput.value.trim();
            const newPassword = newPasswordInput.value;

            if (!enteredCode || enteredCode.length !== 6) {
                setAlert('Please enter a valid 6-digit code.', 'error');
                return;
            }

            if (newPassword.length < 6) {
                setAlert('New password must be at least 6 characters long.', 'error');
                return;
            }

            verifyBtn.disabled = true;
            verifyBtn.textContent = 'Resetting...';

            try {
                const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        reset_code: enteredCode,
                        new_password: newPassword
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Password reset failed');
                }

                setAlert('Password reset successfully! You are now logged in.', 'success');

                // Clear reset data
                sessionStorage.removeItem('resetEmail');
                sessionStorage.removeItem('resetCode');

                hidePasswordResetCodeInput();

                // Show welcome message
                const welcomeMessage = T('WELCOME_MESSAGE');
                appState.chatHistory = [{role: 'model', text: welcomeMessage}];
                renderChatWindow();

            } catch (error) {
                console.error('Password reset error:', error);
                setAlert(error.message || 'Failed to reset password. Please try again.', 'error');
            } finally {
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Reset Password';
            }
        };

        const handleLogout = async () => {
            try {
                // Clear state related to the current user before signing out
                appState.transactions = [];
                appState.goals = [];
                appState.obligations = [];
                appState.userId = null;
                appState.userEmail = null;
                appState.userName = null;
                appState.isAdmin = false;
                appState.token = null;
                appState.isShared = false;
                appState.isChatOpen = false; // Also close chat
                appState.currentMainView = 'dashboard'; // Reset view

                // Clear stored token
                localStorage.removeItem('authToken');

                setAlert('You have been logged out successfully.', 'success');

                // Update UI to show login page
                updateUI();
            } catch (error) {
                // If there was an issue clearing local storage or state, log it.
                console.error("Logout Error:", error.message);
                setAlert('Logout failed. Try again.', 'error');
            }
        };


        // --- EVENT HANDLERS & API LOGIC (CONTINUED) ---
        
        const toggleSharedMode = async () => {
            appState.isShared = !appState.isShared;
            
            // Persist the mode change on the backend
            try {
                await fetch(`${API_BASE_URL}/user/settings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.token}`
                    },
                    body: JSON.stringify({ key: 'current_mode', value: appState.isShared ? 'shared' : 'private' })
                });
            } catch (error) {
                console.error('Failed to set user mode:', error);
                setAlert('Could not switch mode. Please try again.', 'error');
            }

            updateUI();
        };
        
        D.languageSelector.onchange = (e) => {
            appState.currentLanguage = e.target.value;
            updateUI();
        };
        
        const updateFormType = (newType) => {
            if (appState.type !== newType) {
                appState.type = newType;
                appState.category = 'Uncategorized';
                appState.isBusiness = false;
                appState.gstAmount = '';
                updateUI(); 
            }
        };
        document.addEventListener('click', (e) => {
            if (e.target.id === 'type-expense-btn') updateFormType('expense');
            if (e.target.id === 'type-income-btn') updateFormType('income');
            // Correctly target the logout button, including cases where a child element is clicked
            if (e.target.closest('#logout-btn')) {
                handleLogout();
            }
            // Handle admin button click
            if (e.target.closest('#admin-btn')) {
                window.location.href = 'admin.html';
            }
        });

        const analyzeTransaction = async () => {
            if (appState.isAnalyzing || !appState.description.trim()) return;

            appState.isAnalyzing = true;
            updateUI();
            
            // Exponential backoff logic would be implemented here for real API calls
            try {
                const systemPrompt = "You are an expert financial AI assistant (Gamyartha). Analyze the user's transaction description, categorize it accurately for a personal budget tracker (e.g., Groceries, Transport, Bills, Rent, Entertainment, Salary, Loan). Infer the amount if present, otherwise use 0. Provide a concise JSON response.";
                const userQuery = `Analyze this transaction description in ${appState.currentLanguage}: "${appState.description.trim()}"`;
                
                const payload = {
                    contents: [{ parts: [{ text: userQuery }] }],
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "object",
                            properties: {
                                category: { type: "STRING", description: "The single best category (e.g., Groceries, Transport, Bills)." },
                                suggestedAmount: { type: "NUMBER", description: "The amount found in the text, or 0 if none is clear." },
                                notes: { type: "STRING", description: "A cleaned-up, concise description." }
                            },
                            required: ["category", "notes"],
                            propertyOrdering: ["category", "suggestedAmount", "notes"]
                        }
                    }
                };

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${appState.geminiApiKey}`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                });
                
                if (!response.ok) throw new Error(`API error: ${response.status}`);
                const result = await response.json();
                const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (jsonText) {
                    const parsedJson = JSON.parse(jsonText);
                    if (parsedJson.category) appState.category = parsedJson.category;
                    if (parsedJson.notes) appState.description = parsedJson.notes;
                    if (parsedJson.suggestedAmount && parsedJson.suggestedAmount > 0) {
                        appState.amount = parsedJson.suggestedAmount.toString();
                    }
                }
            } catch (error) {
                console.error("AI Analysis Failed:", error);
                appState.category = T('Analysis Failed');
            } finally {
                appState.isAnalyzing = false;
                updateUI(); 
            }
        };

        const startVoiceRecognition = () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                setAlert(T('VOICE_ENTRY') + " not supported in this browser.", 'error');
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = getSpeechLocale(appState.currentLanguage);
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.start();
            appState.description = T('THINKING_BUTTON');
            updateUI();

            recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                appState.description = speechResult;
                updateUI();
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event);
                appState.description = '';
                updateUI();
            };
            recognition.onend = () => {
                 if (appState.description === T('THINKING_BUTTON')) appState.description = '';
                 updateUI();
            };
        };
        
        const updateGoalProgress = async (amountSaved) => {
            if (!appState.token || amountSaved <= 0 || appState.goals.length === 0) return;

            const goal = appState.goals.find(g => (g.savedAmount || 0) < g.targetAmount);
            if (!goal) return;

            try {
                const response = await fetch(`${API_BASE_URL}/goals/${goal.id}/progress`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.token}`
                    },
                    body: JSON.stringify({
                        saved_amount: (goal.saved_amount || 0) + amountSaved
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to update goal progress');
                }

                // Update local state
                goal.saved_amount = (goal.saved_amount || 0) + amountSaved;

                setAlert(`Goal progress updated: Saved ${formatCurrency(amountSaved)} towards ${goal.name}.`, 'success');
            } catch (e) {
                console.error("Goal update failed: ", e);
                setAlert(e.message || "Failed to update goal progress.", 'error');
            }
        };

        const handleAddTransaction = async (e) => {
            e.preventDefault();

            const numericAmount = parseFloat(appState.amount);
            const numericGst = appState.isBusiness ? parseFloat(appState.gstAmount || 0) : 0;
            if (!numericAmount || numericAmount <= 0 || !appState.description.trim() || !appState.token) {
                setAlert("Please fill out all fields correctly.", 'error');
                return;
            }

            appState.isSaving = true;
            updateUI(); // Show "Saving..."

            try {
                const response = await fetch(`${API_BASE_URL}/transactions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.token}`
                    },
                    body: JSON.stringify({
                        amount: numericAmount,
                        description: appState.description.trim(),
                        category: appState.category,
                        type: appState.type,
                        is_business: appState.isBusiness,
                        gst_amount: numericGst
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to add transaction');
                }

                const data = await response.json();

                // Add to local state immediately for UI update
                const newTransaction = {
                    id: data.transactionId,
                    amount: numericAmount,
                    description: appState.description.trim(),
                    category: appState.category,
                    type: appState.type,
                    isBusiness: appState.isBusiness,
                    gstAmount: numericGst,
                    timestamp: new Date()
                };
                appState.transactions.unshift(newTransaction);

                if (appState.type === 'income') {
                    await updateGoalProgress(numericAmount);
                }

                // Send email alert if enabled
                if (appState.emailAlertsEnabled && appState.userEmail) {
                    try { // This is the correct EMAIL_SERVER_URL
                        const response = await fetch(EMAIL_SERVER_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                type: 'transactionAlert', // Correctly use the generic template name
                                to_email: appState.userEmail,
                                user_name: appState.userName || appState.userEmail.split('@')[0],
                                amount: numericAmount,
                                description: appState.description.trim(),
                                category: appState.category,
                                transaction_type: appState.type
                            })
                        });

                        if (response.ok) {
                            console.log('Transaction alert email sent successfully');
                        } else {
                            console.error('Failed to send transaction email alert');
                        }
                    } catch (emailError) {
                        console.error('Failed to send transaction email alert:', emailError.message);
                        // Don't fail the transaction if email fails
                    }
                }

                // Clear form fields on success
                appState.amount = ''; appState.description = ''; appState.type = 'expense'; appState.category = 'Uncategorized';
                appState.isBusiness = false; appState.gstAmount = '';
                setAlert('Transaction recorded successfully!', 'success');

                // Reload data to update budgets and re-render the dashboard
                await initializeListeners();
                renderDashboard();

            } catch (error) {
                console.error("Error adding transaction:", error);
                setAlert(error.message || "Failed to record transaction.", 'error');
            } finally {
                appState.isSaving = false;
                updateUI();
            }
        };

        const handleAddGoal = async (e) => {
            e.preventDefault();
            const form = e.target;
            const goalName = form.goalName.value.trim();
            const targetAmount = parseFloat(form.targetAmount.value);
            const targetDate = form.targetDate.value;

            if (!goalName || !targetAmount || !targetDate || !appState.token) {
                setAlert("Please fill out all goal fields.", 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/goals`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.token}`
                    },
                    body: JSON.stringify({
                        name: goalName,
                        target_amount: targetAmount,
                        target_date: targetDate
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to add goal');
                }

                const data = await response.json();

                // Add to local state immediately
                const newGoal = {
                    id: data.goalId,
                    name: goalName,
                    targetAmount: targetAmount,
                    savedAmount: 0,
                    targetDate: new Date(targetDate)
                };
                appState.goals.push(newGoal);

                form.reset();
                setAlert('Goal created successfully!', 'success');
            } catch (error) {
                console.error("Error adding goal:", error);
                setAlert(error.message || "Failed to add goal.", 'error');
            }
            // Re-render to close form/update list
            document.getElementById('goals-tracker-container').dataset.showForm = 'false';
            renderGoalTracker();
        };
        
        const handleAddObligation = async (e) => {
            e.preventDefault();
            const form = e.target;
            const obligationAmount = parseFloat(form.obligationAmount.value);
            const obligationDescription = form.obligationDescription.value.trim();
            const obligationDueDate = form.obligationDueDate.value;

            if (!obligationAmount || !obligationDescription || !obligationDueDate || !appState.token) {
                setAlert("Please fill out all obligation fields.", 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/obligations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.token}`
                    },
                    body: JSON.stringify({
                        description: obligationDescription,
                        amount: obligationAmount,
                        due_date: obligationDueDate
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to add obligation');
                }

                const data = await response.json();

                // Add to local state immediately
                const newObligation = {
                    id: data.obligationId,
                    description: obligationDescription,
                    amount: obligationAmount,
                    dueDate: new Date(obligationDueDate),
                    isPaid: false
                };
                appState.obligations.push(newObligation);

                form.reset();
                setAlert('Payment obligation added!', 'success');
            } catch (error) {
                console.error("Error adding obligation:", error);
                setAlert(error.message || "Failed to add obligation.", 'error');
            }
            // Re-render to close form/update list
            document.getElementById('obligations-tracker-container').dataset.showForm = 'false';
            renderObligationsTracker();
        };

        async function handleAddBudget(e) {
            e.preventDefault();
            const form = e.target;
            const category = form.budgetCategory.value.trim();
            const amount = parseFloat(form.budgetAmount.value);

            if (!category || isNaN(amount) || amount <= 0) return alert("Enter valid budget data");
        
            try {
                const now = new Date();
                const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
                const response = await fetch(`${API_BASE_URL}/budgets`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.token}`
                    },
                    body: JSON.stringify({ category, amount, monthYear })
                });
        
                const res = await response.json();
        
                if (!response.ok) {
                    throw new Error(res.error || 'Failed to add budget');
                }
        
                setAlert('Budget added successfully!', 'success');
                await initializeListeners(); // Reload all data
        
                // Hide form and re-render the budget tracker
                const container = document.getElementById('budgets-tracker-container');
                if (container) container.dataset.showForm = 'false';
                renderBudgetsTracker();
            } catch (error) {
                console.error("Error adding budget:", error);
                setAlert(error.message || "Failed to add budget", 'error');
            }
        }

        const markObligationPaid = async (obligation) => {
            if (!appState.token) return;

            try {
                // Mark obligation as paid via API
                const response = await fetch(`${API_BASE_URL}/obligations/${obligation.id}/pay`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${appState.token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to mark obligation as paid');
                }

                // Record the payment as a new transaction (expense)
                const transactionResponse = await fetch(`${API_BASE_URL}/transactions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.token}`
                    },
                    body: JSON.stringify({
                        amount: obligation.amount,
                        description: `[Payment] ${obligation.description}`,
                        category: 'Bills/Payments',
                        type: 'expense',
                        is_business: false,
                        gst_amount: 0
                    })
                });

                if (transactionResponse.ok) {
                    const transactionData = await transactionResponse.json();
                    // Add transaction to local state
                    const newTransaction = {
                        id: transactionData.transactionId,
                        amount: obligation.amount,
                        description: `[Payment] ${obligation.description}`,
                        category: 'Bills/Payments',
                        type: 'expense',
                        isBusiness: false,
                        gstAmount: 0,
                        timestamp: new Date()
                    };
                    appState.transactions.unshift(newTransaction);
                }

                // Update local obligation state
                obligation.isPaid = true;

                setAlert(`Payment of ${formatCurrency(obligation.amount)} recorded and obligation cleared.`, 'success');

                // Re-render the entire dashboard to update the alert count and all sections
                renderDashboard();

            } catch (error) {
                 console.error("Error marking obligation paid:", error);
                 setAlert(error.message || "Failed to mark obligation paid.", 'error');
            }
        };

        // --- ADMIN PANEL FUNCTIONS ---

        const renderAdminPanel = () => {
            D.mainContent.innerHTML = `
                <div class="p-4 space-y-6">
                    <div class="flex justify-between items-center border-b pb-2 mb-4">
                        <h2 class="text-3xl font-bold text-red-700">🔧 Admin Panel</h2>
                        <span class="text-sm text-gray-600">System Management</span>
                    </div>

                    <!-- Admin Navigation Tabs -->
                    <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <button id="admin-users-tab" class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition admin-tab active bg-white text-gray-900 shadow-sm">
                            👥 Users
                        </button>
                        <button id="admin-transactions-tab" class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition admin-tab bg-gray-100 text-gray-600 hover:bg-white">
                            💰 Transactions
                        </button>
                        <button id="admin-goals-tab" class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition admin-tab bg-gray-100 text-gray-600 hover:bg-white">
                            🎯 Goals
                        </button>
                        <button id="admin-obligations-tab" class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition admin-tab bg-gray-100 text-gray-600 hover:bg-white">
                            📅 Obligations
                        </button>
                        <button id="admin-reports-tab" class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition admin-tab bg-gray-100 text-gray-600 hover:bg-white">
                            📊 Reports
                        </button>
                    </div>

                    <!-- Admin Content Container -->
                    <div id="admin-content" class="bg-white rounded-xl shadow-2xl border border-gray-200 min-h-[600px]">
                        <!-- Content will be loaded here -->
                    </div>
                </div>
            `;

            // Set up tab event listeners
            document.getElementById('admin-users-tab').onclick = () => loadAdminContent('users');
            document.getElementById('admin-transactions-tab').onclick = () => loadAdminContent('transactions');
            document.getElementById('admin-goals-tab').onclick = () => loadAdminContent('goals');
            document.getElementById('admin-obligations-tab').onclick = () => loadAdminContent('obligations');
            document.getElementById('admin-reports-tab').onclick = () => loadAdminContent('reports');

            // Load default content (users)
            loadAdminContent('users');
        };

        const loadAdminContent = async (section) => {
            // Update active tab
            document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active', 'bg-white', 'text-gray-900', 'shadow-sm'));
            document.querySelectorAll('.admin-tab').forEach(tab => {
                tab.classList.add('bg-gray-100', 'text-gray-600');
            });
            document.getElementById(`admin-${section}-tab`).classList.add('active', 'bg-white', 'text-gray-900', 'shadow-sm');
            document.getElementById(`admin-${section}-tab`).classList.remove('bg-gray-100', 'text-gray-600');

            const content = document.getElementById('admin-content');

            switch (section) {
                case 'users':
                    await renderAdminUsers(content);
                    break;
                case 'transactions':
                    await renderAdminTransactions(content);
                    break;
                case 'goals':
                    await renderAdminGoals(content);
                    break;
                case 'obligations':
                    await renderAdminObligations(content);
                    break;
                case 'reports':
                    await renderAdminReports(content);
                    break;
            }
        };

        const renderAdminUsers = async (container) => {
            container.innerHTML = '<div class="p-6 text-center">Loading users...</div>';

            try {
                // Get all users from Firestore (this requires admin privileges)
                const usersSnapshot = await getDocs(collection(appState.db, 'users'));
                const users = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const userRows = users.map(user => `
                    <tr class="border-b border-gray-200 hover:bg-gray-50">
                        <td class="px-4 py-3 text-sm font-mono text-gray-600">${user.id}</td>
                        <td class="px-4 py-3 text-sm">${user.email || 'N/A'}</td>
                        <td class="px-4 py-3 text-sm">
                            <span class="px-2 py-1 text-xs rounded-full ${user.isAnonymous ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
                                ${user.isAnonymous ? 'Anonymous' : 'Permanent'}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-500">
                            ${user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                        </td>
                        <td class="px-4 py-3 text-sm">
                            <button onclick="editUser('${user.id}')" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                            <button onclick="deleteUser('${user.id}')" class="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                    </tr>
                `).join('');

                container.innerHTML = `
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold text-gray-800">User Management</h3>
                            <span class="text-sm text-gray-600">${users.length} total users</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full bg-white admin-table">
                                <thead>
                                    <tr>
                                        <th class="px-4 py-3 text-left">User ID</th>
                                        <th class="px-4 py-3 text-left">Email</th>
                                        <th class="px-4 py-3 text-left">Type</th>
                                        <th class="px-4 py-3 text-left">Created</th>
                                        <th class="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>${userRows}</tbody>
                            </table>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error loading users:', error);
                container.innerHTML = '<div class="p-6 text-center text-red-600">Error loading users</div>';
            }
        };

        const renderAdminTransactions = async (container) => {
            container.innerHTML = '<div class="p-6 text-center">Loading transactions...</div>';

            try {
                // Get all transactions from all users (requires admin read access)
                const allTransactions = [];
                const usersSnapshot = await getDocs(collection(appState.db, 'users'));

                for (const userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id;
                    const transactionsSnapshot = await getDocs(collection(appState.db, `users/${userId}/transactions`));
                    transactionsSnapshot.docs.forEach(doc => {
                        allTransactions.push({
                            id: doc.id,
                            userId: userId,
                            ...doc.data(),
                            timestamp: doc.data().timestamp?.toDate() || new Date()
                        });
                    });
                }

                const transactionRows = allTransactions.slice(0, 100).map(t => `
                    <tr class="border-b border-gray-200 hover:bg-gray-50">
                        <td class="px-4 py-3 text-sm font-mono text-gray-600">${t.userId}</td>
                        <td class="px-4 py-3 text-sm">${t.description}</td>
                        <td class="px-4 py-3 text-sm">${t.category}</td>
                        <td class="px-4 py-3 text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                            ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-500">${t.timestamp.toLocaleDateString()}</td>
                        <td class="px-4 py-3 text-sm">
                            <button onclick="editTransaction('${t.id}', '${t.userId}')" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                            <button onclick="deleteTransaction('${t.id}', '${t.userId}')" class="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                    </tr>
                `).join('');

                container.innerHTML = `
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold text-gray-800">Transaction Management</h3>
                            <span class="text-sm text-gray-600">${allTransactions.length} total transactions</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full bg-white admin-table">
                                <thead>
                                    <tr>
                                        <th class="px-4 py-3 text-left">User</th>
                                        <th class="px-4 py-3 text-left">Description</th>
                                        <th class="px-4 py-3 text-left">Category</th>
                                        <th class="px-4 py-3 text-left">Amount</th>
                                        <th class="px-4 py-3 text-left">Date</th>
                                        <th class="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>${transactionRows}</tbody>
                            </table>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error loading transactions:', error);
                container.innerHTML = '<div class="p-6 text-center text-red-600">Error loading transactions</div>';
            }
        };

        const renderAdminGoals = async (container) => {
            container.innerHTML = '<div class="p-6 text-center">Loading goals...</div>';

            try {
                const allGoals = [];
                const usersSnapshot = await getDocs(collection(appState.db, 'users'));

                for (const userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id;
                    const goalsSnapshot = await getDocs(collection(appState.db, `users/${userId}/goals`));
                    goalsSnapshot.docs.forEach(doc => {
                        allGoals.push({
                            id: doc.id,
                            userId: userId,
                            ...doc.data(),
                            targetDate: doc.data().targetDate?.toDate() || new Date()
                        });
                    });
                }

                const goalRows = allGoals.map(g => `
                    <tr class="border-b border-gray-200 hover:bg-gray-50">
                        <td class="px-4 py-3 text-sm font-mono text-gray-600">${g.userId}</td>
                        <td class="px-4 py-3 text-sm">${g.name}</td>
                        <td class="px-4 py-3 text-sm">${formatCurrency(g.targetAmount)}</td>
                        <td class="px-4 py-3 text-sm">${formatCurrency(g.savedAmount || 0)}</td>
                        <td class="px-4 py-3 text-sm text-gray-500">${g.targetDate.toLocaleDateString()}</td>
                        <td class="px-4 py-3 text-sm">
                            <button onclick="editGoal('${g.id}', '${g.userId}')" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                            <button onclick="deleteGoal('${g.id}', '${g.userId}')" class="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                    </tr>
                `).join('');

                container.innerHTML = `
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold text-gray-800">Goals Management</h3>
                            <span class="text-sm text-gray-600">${allGoals.length} total goals</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full bg-white admin-table">
                                <thead>
                                    <tr>
                                        <th class="px-4 py-3 text-left">User</th>
                                        <th class="px-4 py-3 text-left">Goal Name</th>
                                        <th class="px-4 py-3 text-left">Target</th>
                                        <th class="px-4 py-3 text-left">Saved</th>
                                        <th class="px-4 py-3 text-left">Due Date</th>
                                        <th class="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>${goalRows}</tbody>
                            </table>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error loading goals:', error);
                container.innerHTML = '<div class="p-6 text-center text-red-600">Error loading goals</div>';
            }
        };

        const renderAdminObligations = async (container) => {
            container.innerHTML = '<div class="p-6 text-center">Loading obligations...</div>';

            try {
                const allObligations = [];
                const usersSnapshot = await getDocs(collection(appState.db, 'users'));

                for (const userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id;
                    const obligationsSnapshot = await getDocs(collection(appState.db, `users/${userId}/obligations`));
                    obligationsSnapshot.docs.forEach(doc => {
                        allObligations.push({
                            id: doc.id,
                            userId: userId,
                            ...doc.data(),
                            dueDate: doc.data().dueDate?.toDate() || new Date()
                        });
                    });
                }

                const obligationRows = allObligations.map(o => `
                    <tr class="border-b border-gray-200 hover:bg-gray-50">
                        <td class="px-4 py-3 text-sm font-mono text-gray-600">${o.userId}</td>
                        <td class="px-4 py-3 text-sm">${o.description}</td>
                        <td class="px-4 py-3 text-sm">${formatCurrency(o.amount)}</td>
                        <td class="px-4 py-3 text-sm text-gray-500">${o.dueDate.toLocaleDateString()}</td>
                        <td class="px-4 py-3 text-sm">
                            <span class="px-2 py-1 text-xs rounded-full ${o.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                ${o.isPaid ? 'Paid' : 'Pending'}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm">
                            <button onclick="editObligation('${o.id}', '${o.userId}')" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                            <button onclick="deleteObligation('${o.id}', '${o.userId}')" class="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                    </tr>
                `).join('');

                container.innerHTML = `
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold text-gray-800">Obligations Management</h3>
                            <span class="text-sm text-gray-600">${allObligations.length} total obligations</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full bg-white admin-table">
                                <thead>
                                    <tr>
                                        <th class="px-4 py-3 text-left">User</th>
                                        <th class="px-4 py-3 text-left">Description</th>
                                        <th class="px-4 py-3 text-left">Amount</th>
                                        <th class="px-4 py-3 text-left">Due Date</th>
                                        <th class="px-4 py-3 text-left">Status</th>
                                        <th class="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>${obligationRows}</tbody>
                            </table>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error loading obligations:', error);
                container.innerHTML = '<div class="p-6 text-center text-red-600">Error loading obligations</div>';
            }
        };

        const renderAdminReports = async (container) => {
            container.innerHTML = `
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">System Reports</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-blue-800 mb-2">Export All Data</h4>
                            <p class="text-sm text-blue-600 mb-3">Download complete system data as CSV</p>
                            <button onclick="exportAllData()" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                                Export CSV
                            </button>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-green-800 mb-2">User Statistics</h4>
                            <p class="text-sm text-green-600 mb-3">View user registration and activity stats</p>
                            <button onclick="showUserStats()" class="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                                View Stats
                            </button>
                        </div>
                    </div>
                </div>
            `;
        };

        // Admin CRUD functions
        const editUser = (userId) => {
            // TODO: Implement user editing modal
            alert(`Edit user: ${userId}`);
        };

        const deleteUser = async (userId) => {
            if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

            try {
                // Delete user data (this is complex and requires careful consideration)
                // For now, just show a message
                setAlert('User deletion not implemented yet', 'error');
            } catch (error) {
                console.error('Error deleting user:', error);
                setAlert('Failed to delete user', 'error');
            }
        };

        const editTransaction = (transactionId, userId) => {
            // TODO: Implement transaction editing modal
            alert(`Edit transaction: ${transactionId} for user: ${userId}`);
        };

        const deleteTransaction = async (transactionId, userId) => {
            if (!confirm('Are you sure you want to delete this transaction?')) return;

            try {
                await deleteDoc(doc(appState.db, `users/${userId}/transactions`, transactionId));
                setAlert('Transaction deleted successfully', 'success');
                loadAdminContent('transactions'); // Refresh
            } catch (error) {
                console.error('Error deleting transaction:', error);
                setAlert('Failed to delete transaction', 'error');
            }
        };

        const editGoal = (goalId, userId) => {
            // TODO: Implement goal editing modal
            alert(`Edit goal: ${goalId} for user: ${userId}`);
        };

        const deleteGoal = async (goalId, userId) => {
            if (!confirm('Are you sure you want to delete this goal?')) return;

            try {
                await deleteDoc(doc(appState.db, `users/${userId}/goals`, goalId));
                setAlert('Goal deleted successfully', 'success');
                loadAdminContent('goals'); // Refresh
            } catch (error) {
                console.error('Error deleting goal:', error);
                setAlert('Failed to delete goal', 'error');
            }
        };

        const editObligation = (obligationId, userId) => {
            // TODO: Implement obligation editing modal
            alert(`Edit obligation: ${obligationId} for user: ${obligationId}`);
        };

        const deleteObligation = async (obligationId, userId) => {
            if (!confirm('Are you sure you want to delete this obligation?')) return;

            try {
                await deleteDoc(doc(appState.db, `users/${userId}/obligations`, obligationId));
                setAlert('Obligation deleted successfully', 'success');
                loadAdminContent('obligations'); // Refresh
            } catch (error) {
                console.error('Error deleting obligation:', error);
                setAlert('Failed to delete obligation', 'error');
            }
        };

        const exportAllData = async () => {
            // TODO: Implement full data export
            alert('Full data export not implemented yet');
        };

        const showUserStats = async () => {
            // TODO: Implement user statistics
            alert('User statistics not implemented yet');
        };

        // Make admin functions globally available
        window.editUser = editUser;
        window.deleteUser = deleteUser;
        window.editTransaction = editTransaction;
        window.deleteTransaction = deleteTransaction;
        window.editGoal = editGoal;
        window.deleteGoal = deleteGoal;
        window.editObligation = editObligation;
        window.deleteObligation = deleteObligation;
        window.exportAllData = exportAllData;
        window.showUserStats = showUserStats;

        // Send goal completion alert email using backend server
        const sendGoalCompletionAlertEmail = async (goal) => {
            if (!appState.emailAlertsEnabled || !appState.userEmail) return;

            try {
                const response = await fetch(EMAIL_SERVER_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'goalCompleted',
                        to_email: appState.userEmail,
                        user_name: appState.userName || appState.userEmail.split('@')[0],
                        goalName: goal.name,
                        targetAmount: goal.targetAmount
                    })
                });

                if (response.ok) {
                    console.log('Goal completion alert email sent successfully');
                } else {
                    console.error('Failed to send goal completion email');
                }
            } catch (error) {
                console.error('Failed to send goal completion email alert:', error);
            }
        };

        const exportTaxLedger = () => {
            const businessData = appState.transactions.filter(t => t.isBusiness);

            if (businessData.length === 0) {
                setAlert("No business-related transactions to export!", 'error');
                return;
            }

            let csv = [
                ["Date", "Description", "Type", "Category", "Amount", "GST_Amount", "Net_Amount", "Business_Related"].join(",")
            ];

            businessData.forEach(t => {
                const row = [
                    t.timestamp.toISOString().split('T')[0],
                    `"${t.description.replace(/"/g, '""')}"`,
                    t.type.toUpperCase(),
                    t.category,
                    t.amount.toFixed(2),
                    (t.gstAmount || 0).toFixed(2),
                    (t.amount - (t.gstAmount || 0)).toFixed(2),
                    "TRUE"
                ].join(",");
                csv.push(row);
            });

            const csvContent = csv.join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a'); // Renamed from Gamyartha to Gamyartha
            link.setAttribute('href', url);
            link.setAttribute('download', `Gamyartha_Tax_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
            link.click();
        };

        // --- FIREBASE INITIALIZATION AND LISTENERS ---

        let unsubscribers = [];
        // Define EMAIL_SERVER_URL using the global config
        const EMAIL_SERVER_URL = `${window.ENV.BACKEND_API}/api/send-email`;

        const initializeListeners = async () => {
            if (!appState.token || !appState.userId) return;

            try {
                // Load transactions
                const transactionsResponse = await fetch(`${API_BASE_URL}/transactions`, {
                    headers: {
                        'Authorization': `Bearer ${appState.token}`
                    }
                });

                if (transactionsResponse.ok) {
                    const data = await transactionsResponse.json();
                    appState.transactions = data.transactions.map(t => ({
                        id: t.id,
                        amount: parseFloat(t.amount) || 0,
                        description: t.description,
                        category: t.category,
                        type: t.type,
                        isBusiness: t.is_business,
                        gstAmount: t.gst_amount,
                        currency: t.currency,
                        timestamp: new Date(t.transaction_date)
                    }));
                }

                // Load goals
                const goalsResponse = await fetch(`${API_BASE_URL}/goals`, {
                    headers: {
                        'Authorization': `Bearer ${appState.token}`
                    }
                });

                if (goalsResponse.ok) {
                    const data = await goalsResponse.json();
                    appState.goals = data.goals.map(g => ({
                        id: g.id,
                        name: g.name,
                        targetAmount: g.target_amount,
                        savedAmount: g.saved_amount,
                        targetDate: new Date(g.target_date)
                    }));
                }

                // Load obligations
                const obligationsResponse = await fetch(`${API_BASE_URL}/obligations`, {
                    headers: {
                        'Authorization': `Bearer ${appState.token}`
                    }
                });

                if (obligationsResponse.ok) {
                    const data = await obligationsResponse.json();
                    appState.obligations = data.obligations.map(o => ({
                        id: o.id,
                        description: o.description,
                        amount: o.amount,
                        dueDate: new Date(o.due_date),
                        isPaid: o.is_paid
                    }));
                }

                // Load budgets
                const budgetsResponse = await fetch(`${API_BASE_URL}/budgets`, {
                    headers: {
                        'Authorization': `Bearer ${appState.token}`
                    }
                });

                if (budgetsResponse.ok) {
                    const data = await budgetsResponse.json();
                    appState.budgets = data.budgets.map(b => ({
                        id: b.id,
                        category: b.category,
                        amount: b.amount,
                        currency: b.currency,
                        spent_amount: b.spent_amount,
                        remaining: b.amount - (b.spent_amount || 0)
                    }));
                }

                // Check for automatic budget suggestion trigger
                if (appState.budgets.length === 0 && appState.transactions.length > 8) {
            // Only set the prompt if the chat is not already open.
            if (!appState.isChatOpen) {
                appState.showBudgetSuggestionPrompt = true;
            }
                }

                updateUI();
            } catch (error) {
                console.error("Failed to load data:", error);
            }
        };


        const initializeAppAndAuth = async () => {
            try {
                // Check if user is already logged in via stored token
                const storedToken = localStorage.getItem('authToken');
                if (storedToken) {
                    try {
                        // Verify token with backend
                        const response = await fetch(`${API_BASE_URL}/user/profile`, {
                            headers: {
                                'Authorization': `Bearer ${storedToken}`
                            }
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (data.user && data.user.id) {
                                appState.token = storedToken;
                                appState.userId = data.user.id;
                                appState.userEmail = data.user.email;
                                appState.userName = data.user.full_name;
                                appState.emailAlertsEnabled = data.user.email_alerts_enabled;
                                appState.activeCurrency = data.user.currency || 'INR';
                                appState.isAdmin = data.user.is_admin;
                                appState.geminiApiKey = data.geminiApiKey;
                                // Successfully validated token and loaded user data
                                console.log('Token validated and user session restored');
                            } else {
                                throw new Error('Invalid user data in response');
                            }
                        } else if (response.status === 401 || response.status === 403) {
                            // Token is invalid or expired, clear it
                            console.error('Token is invalid, clearing session');
                            localStorage.removeItem('authToken');
                            appState.token = null;
                            appState.userId = null;
                            appState.userEmail = null;
                            appState.userName = null;
                            appState.isAdmin = false;
                        } else {
                            // Other server error, don't clear token (might be temporary network issue)
                            console.error('Failed to verify token due to server error, keeping session:', response.status);
                        }
                    } catch (error) {
                        // Network error or other issue, don't clear token
                        console.error('Token verification failed due to network error, keeping session:', error);
                    }
                }

                appState.isLoading = false;
                initializeListeners();
                updateUI();
            } catch (e) {
                console.error("App Initialization Error:", e);
                appState.isLoading = false;
                appState.userId = null;
                updateUI();
            }
        };

        // --- RUN APP ---
        window.onload = () => {
            initThreeJS();
            initializeAppAndAuth();
        };
