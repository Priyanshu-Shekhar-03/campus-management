function getEventId() {
  return new URLSearchParams(window.location.search).get("id");
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function showMsg(text, type) {
  const el = document.getElementById("formMsg");
  el.textContent = text;
  el.className = `form-msg show ${type}`;
}

async function init() {
  const id = getEventId();
  const ev = id ? await fetchEvent(id) : null;

  if (!ev) {
    document.getElementById("notFound").style.display = "block";
    return;
  }

  document.title = `${ev.title} — Notice Board`;
  document.getElementById("dCategory").textContent = ev.category;
  document.getElementById("dTitle").textContent = ev.title;
  document.getElementById("dDate").textContent = "📅 " + formatDate(ev.date);
  document.getElementById("dTime").textContent = "🕒 " + ev.time;
  document.getElementById("dVenue").textContent = "📍 " + ev.venue;
  document.getElementById("dDescription").textContent = ev.description;

  const seatsLeft = ev.capacity - ev.registered;
  document.getElementById("dSeats").textContent =
    seatsLeft > 0 ? `${seatsLeft} of ${ev.capacity} seats still available.` : `This event is fully booked.`;
  document.getElementById("detailGrid").style.display = "grid";

  const submitBtn = document.getElementById("submitBtn");
  if (seatsLeft <= 0) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Fully Booked";
  }

  document.getElementById("regForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Registering…";

    const registrant = {
      name: document.getElementById("fName").value.trim(),
      email: document.getElementById("fEmail").value.trim(),
      phone: document.getElementById("fPhone").value.trim(),
      branch: document.getElementById("fBranch").value.trim()
    };

    try {
      await registerForEvent(ev.id, registrant);
      showMsg("You're registered! A confirmation has been noted against your email.", "ok");
      document.getElementById("regForm").reset();
      submitBtn.textContent = "Registered ✓";
    } catch (err) {
      if (err.message === "FULL") {
        showMsg("Sorry — the last seat was just taken.", "err");
        submitBtn.textContent = "Fully Booked";
      } else {
        showMsg("Something went wrong. Please try again.", "err");
        submitBtn.disabled = false;
        submitBtn.textContent = "Register";
      }
    }
  });
}

init();
