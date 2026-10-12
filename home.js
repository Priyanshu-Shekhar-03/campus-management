const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function ticketCardHTML(ev) {
  const d = new Date(ev.date + "T00:00:00");
  const seatsLeft = ev.capacity - ev.registered;
  const pctFull = Math.min(100, Math.round((ev.registered / ev.capacity) * 100));
  const full = seatsLeft <= 0;
  return `
    <a class="ticket" href="event.html?id=${encodeURIComponent(ev.id)}">
      <div class="ticket-stub">
        <span class="month">${MONTHS[d.getMonth()]}</span>
        <span class="day">${d.getDate()}</span>
      </div>
      <div class="ticket-body">
        <span class="ticket-cat">${ev.category}</span>
        <h3>${ev.title}</h3>
        <span class="ticket-meta">${ev.venue}</span>
        <div class="ticket-seats">
          <div class="seat-bar"><div class="seat-bar-fill" style="width:${pctFull}%"></div></div>
          <span class="seat-label">${full ? "Full" : seatsLeft + " seats left"}</span>
        </div>
      </div>
    </a>
  `;
}

let allEvents = [];

function renderGrid(filter) {
  const grid = document.getElementById("eventGrid");
  const list = filter === "All" ? allEvents : allEvents.filter(e => e.category === filter);
  document.getElementById("eventCount").textContent = `${list.length} event${list.length === 1 ? "" : "s"}`;
  if (list.length === 0) {
    grid.innerHTML = `<p class="empty-state">Nothing here yet. Check back soon or try another category.</p>`;
    return;
  }
  grid.innerHTML = list.map(ticketCardHTML).join("");
}

function renderFilters() {
  const bar = document.getElementById("filterBar");
  const categories = ["All", ...new Set(allEvents.map(e => e.category))];
  bar.innerHTML = categories.map(c =>
    `<button class="filter-chip${c === "All" ? " active" : ""}" data-filter="${c}">${c}</button>`
  ).join("");
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-chip");
    if (!btn) return;
    bar.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderGrid(btn.dataset.filter);
  });
}

(async function init() {
  try {
    allEvents = await fetchEvents();
    renderFilters();
    renderGrid("All");
  } catch (err) {
    console.error(err);
    document.getElementById("eventGrid").innerHTML =
      `<p class="empty-state">Couldn't load events. Check your Firebase setup in js/firebase-config.js.</p>`;
  }
})();
