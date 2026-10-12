# Notice Board — Campus Event Management System

A web app for creating, browsing, and registering for campus events — inspired by
real experience coordinating TEDx and placement drives as Student Coordinator,
Training & Placement Department, LNCT Bhopal.

**Live without any setup:** open `index.html` in a browser. It runs on local demo
data (stored in `localStorage`) until you connect Firebase, so you can build and
test the whole flow immediately.

## Features (Stage 1 — MVP)
- Home page listing all events as ticket-style cards, filterable by category
- Event detail page with a registration form (name, email, phone, branch/year)
- Live seat-capacity tracking — registrations are blocked once an event is full
- Organizer panel: log in, publish new events, view registrants per event

## Project structure
```
campus-events/
├── index.html          # Home page — event listing
├── event.html           # Event detail + registration form
├── admin.html            # Organizer login, event creation, registrant lists
├── css/style.css          # All styling (ticket/notice-board visual identity)
└── js/
    ├── firebase-config.js  # Your Firebase project keys go here
    ├── data.js              # Data layer (Firestore or local demo data)
    ├── home.js                # Home page logic
    ├── event.js                # Event detail page logic
    └── admin.js                  # Organizer panel logic
```

## Connecting real Firebase (do this before deploying)

1. Go to the [Firebase console](https://console.firebase.google.com) → **Create project**.
2. **Project settings → General → Your apps → Add a web app.** Copy the config object.
3. Paste it into `js/firebase-config.js`, replacing the placeholder values, and set:
   ```js
   const FIREBASE_ENABLED = true;
   ```
4. **Build → Firestore Database → Create database** (start in test mode for development).
5. **Build → Authentication → Sign-in method → Email/Password → Enable.**
   Then add yourself as a user under the **Users** tab — that's your organizer login.
6. Set Firestore security rules so only signed-in organizers can write events
   (Firestore → Rules):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /events/{eventId} {
         allow read: if true;
         allow write: if request.auth != null;
         match /registrants/{regId} {
           allow read: if request.auth != null;
           allow create: if true;
         }
       }
     }
   }
   ```
   This lets anyone browse and register for events, but only a logged-in organizer
   can create events or view the registrant list.

## Deploying (free, gives you a live demo link)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting     # select "Use an existing project", public dir = .
firebase deploy
```
You'll get a live URL like `https://your-project.web.app` — put this on your resume.

## Stage 2 ideas (next milestones)
- Search bar across event titles/venues
- Email confirmation on registration via [EmailJS](https://www.emailjs.com) (no backend needed)
- QR code per registration for event-day check-in (`qrcode` npm package, client-side only)

## Resume bullet
> Built and deployed a full-stack event management web app using JavaScript and
> Firebase, enabling event creation, registration, and live capacity tracking —
> inspired by real experience coordinating TEDx and campus placement drives at LNCT Bhopal.
