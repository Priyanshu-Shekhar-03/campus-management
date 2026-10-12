// ============================================================
// DATA LAYER
// All Firestore reads/writes go through here. When FIREBASE_ENABLED
// is false (see firebase-config.js) these functions read/write an
// in-memory demo array instead, so the UI is fully clickable before
// you connect a real Firebase project.
// ============================================================

const DEMO_EVENTS = [
  {
    id: "tedx-lnct-2026",
    title: "TEDx LNCT Bhopal",
    category: "TEDx",
    date: "2026-08-14",
    time: "10:00 AM",
    venue: "Main Auditorium, LNCT",
    capacity: 300,
    registered: 214,
    description: "An afternoon of independent talks from founders, researchers and student innovators, organized under the TEDx license. Expect five speakers, live Q&A, and a networking break."
  },
  {
    id: "placement-drive-infosys",
    title: "Infosys Campus Placement Drive",
    category: "Placement Drive",
    date: "2026-08-02",
    time: "9:00 AM",
    venue: "Placement Cell, Block C",
    capacity: 150,
    registered: 148,
    description: "Pre-placement talk followed by online assessment and technical interviews for final-year CSE and IT students. Carry two copies of your resume and a valid college ID."
  },
  {
    id: "cultural-fest-udaan",
    title: "Udaan — Annual Cultural Fest",
    category: "Cultural Fest",
    date: "2026-09-05",
    time: "4:00 PM",
    venue: "Open Air Theatre",
    capacity: 500,
    registered: 96,
    description: "Two days of music, dance, and street-play competitions across departments, closing with a live band performance."
  }
];

const DEMO_REGISTRATIONS = {
  "tedx-lnct-2026": [
    { name: "Ananya Rao", email: "ananya.r@example.com", phone: "9876543210", branch: "CSE, 3rd Year" }
  ]
};

function loadDemoState() {
  const saved = localStorage.getItem("campusEventsDemo");
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed;
  }
  return { events: DEMO_EVENTS, registrations: DEMO_REGISTRATIONS };
}

function saveDemoState(state) {
  localStorage.setItem("campusEventsDemo", JSON.stringify(state));
}

// ---------- Public API ----------

async function fetchEvents() {
  if (FIREBASE_ENABLED) {
    const snap = await db.collection("events").orderBy("date").get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  const state = loadDemoState();
  return [...state.events].sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchEvent(id) {
  if (FIREBASE_ENABLED) {
    const doc = await db.collection("events").doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }
  const state = loadDemoState();
  return state.events.find(e => e.id === id) || null;
}

async function createEvent(event) {
  if (FIREBASE_ENABLED) {
    const ref = await db.collection("events").add({ ...event, registered: 0 });
    return ref.id;
  }
  const state = loadDemoState();
  const id = event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) + "-" + Date.now().toString(36);
  state.events.push({ id, ...event, registered: 0 });
  saveDemoState(state);
  return id;
}

async function registerForEvent(eventId, registrant) {
  if (FIREBASE_ENABLED) {
    const eventRef = db.collection("events").doc(eventId);
    await db.runTransaction(async (tx) => {
      const doc = await tx.get(eventRef);
      const data = doc.data();
      if (data.registered >= data.capacity) throw new Error("FULL");
      tx.update(eventRef, { registered: (data.registered || 0) + 1 });
      tx.set(eventRef.collection("registrants").doc(), { ...registrant, registeredAt: new Date().toISOString() });
    });
    return;
  }
  const state = loadDemoState();
  const ev = state.events.find(e => e.id === eventId);
  if (!ev) throw new Error("NOT_FOUND");
  if (ev.registered >= ev.capacity) throw new Error("FULL");
  ev.registered += 1;
  if (!state.registrations[eventId]) state.registrations[eventId] = [];
  state.registrations[eventId].push(registrant);
  saveDemoState(state);
}

async function fetchRegistrants(eventId) {
  if (FIREBASE_ENABLED) {
    const snap = await db.collection("events").doc(eventId).collection("registrants").get();
    return snap.docs.map(d => d.data());
  }
  const state = loadDemoState();
  return state.registrations[eventId] || [];
}
