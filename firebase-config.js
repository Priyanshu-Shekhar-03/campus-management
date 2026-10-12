// ============================================================
// FIREBASE CONFIG
// ------------------------------------------------------------
// 1. Go to https://console.firebase.google.com -> Create project
// 2. Project settings -> General -> "Your apps" -> Add a Web App
// 3. Copy the config object Firebase gives you and paste it below
// 4. Enable Firestore Database (test mode is fine to start)
// 5. Enable Authentication -> Sign-in method -> Email/Password
//    (this is how YOU log into admin.html to manage events)
// ============================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Set this to true only after you've pasted real keys above.
// While false, the site runs on local demo data so you can see
// and build the UI before wiring up Firebase.
const FIREBASE_ENABLED = false;

let db = null;
let auth = null;

if (FIREBASE_ENABLED) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  auth = firebase.auth();
}
