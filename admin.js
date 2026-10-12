function setLoggedIn(isIn) {
  document.getElementById("loginBox").style.display = isIn ? "none" : "block";
  document.getElementById("panel").style.display = isIn ? "block" : "none";
  document.getElementById("logoutLink").style.display = isIn ? "inline" : "none";
  if (isIn) loadManageList();
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("aEmail").value.trim();
  const pass = document.getElementById("aPass").value;
  const msg = document.getElementById("loginMsg");

  if (FIREBASE_ENABLED) {
    try {
      await auth.signInWithEmailAndPassword(email, pass);
      setLoggedIn(true);
    } catch (err) {
      msg.textContent = "Login failed: " + err.message;
      msg.className = "form-msg show err";
    }
  } else {
    if (!email || !pass) {
      msg.textContent = "Enter an email and password.";
      msg.className = "form-msg show err";
      return;
    }
    sessionStorage.setItem("demoAdmin", "true");
    setLoggedIn(true);
  }
});

document.getElementById("logoutLink").addEventListener("click", async (e) => {
  e.preventDefault();
  if (FIREBASE_ENABLED) await auth.signOut();
  sessionStorage.removeItem("demoAdmin");
  setLoggedIn(false);
});

document.getElementById("createForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("createMsg");
  const event = {
    title: document.getElementById("cTitle").value.trim(),
    category: document.getElementById("cCategory").value,
    date: document.getElementById("cDate").value,
    time: document.getElementById("cTime").value.trim(),
    venue: document.getElementById("cVenue").value.trim(),
    capacity: parseInt(document.getElementById("cCapacity").value, 10),
    description: document.getElementById("cDescription").value.trim()
  };
  try {
    await createEvent(event);
    msg.textContent = "Event published. It's now live on the events page.";
    msg.className = "form-msg show ok";
    e.target.reset();
    loadManageList();
  } catch (err) {
    msg.textContent = "Couldn't publish event. Please try again.";
    msg.className = "form-msg show err";
  }
});

async function loadManageList() {
  const container = document.getElementById("manageList");
  container.innerHTML = `<p class="empty-state">Loading…</p>`;
  const events = await fetchEvents();
  if (events.length === 0) {
    container.innerHTML = `<p class="empty-state">No events yet. Publish one above.</p>`;
    return;
  }
  container.innerHTML = "";
  for (const ev of events) {
    const registrants = await fetchRegistrants(ev.id);
    const details = document.createElement("details");
    details.className = "event-manage-card";
    details.innerHTML = `
      <summary>
        <span>${ev.title} <span class="ticket-meta">(${ev.registered}/${ev.capacity} registered)</span></span>
        <span class="ticket-cat">${ev.category}</span>
      </summary>
      ${registrants.length === 0
        ? `<p class="empty-state">No registrations yet.</p>`
        : `<table class="registrants">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Branch &amp; Year</th></tr></thead>
            <tbody>
              ${registrants.map(r => `<tr><td>${r.name}</td><td>${r.email}</td><td>${r.phone}</td><td>${r.branch}</td></tr>`).join("")}
            </tbody>
           </table>`
      }
    `;
    container.appendChild(details);
  }
}

// restore session
if (FIREBASE_ENABLED) {
  auth.onAuthStateChanged(user => setLoggedIn(!!user));
} else {
  setLoggedIn(sessionStorage.getItem("demoAdmin") === "true");
}
