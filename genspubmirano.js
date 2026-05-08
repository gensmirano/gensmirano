// =========================
// MOBILE MENU (HAMBURGER)
// =========================
function initMenu() {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("navMenu");

  if (!burger || !nav) return;

  if (burger.dataset.init === "true") return;
  burger.dataset.init = "true";

  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
    burger.classList.toggle("open");
  });

  document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.classList.remove("open");
    });
  });
}


// =========================
// SCROLL REVEAL
// =========================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, {
  threshold: 0.15
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});


// =========================
// CSV PARSER (robusto per virgole)
// =========================
function parseCSVRow(text) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);

  return result.map(v => v.replace(/^"|"$/g, "").trim());
}


// =========================
// BEERS
// =========================
const BEER_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRe5KKKXcOERA7qDCoWHaUuA60jhXryRHfl7cE6CYtHSvhRIjXa5bl41iJsAc-jnpIQo1L5enuGNsqV/pub?output=csv";

async function loadBeers() {
  const tbody = document.querySelector("#beerTable tbody");
  if (!tbody) return;

  try {
    const res = await fetch(BEER_SHEET_URL);
    const data = await res.text();

    const rows = data.trim().split("\n").slice(1);

    tbody.innerHTML = "";

    rows.forEach(row => {
      const cols = parseCSVRow(row);

      if (!cols[0]) return;
      if (!cols[7] || cols[7].toUpperCase() !== "SI") return;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${cols[0]}</td>
        <td>${cols[1]}</td>
        <td>${cols[2]}</td>
        <td>${cols[3]}</td>
        <td>${cols[4]}%</td>
        <td>${cols[5]}€</td>
        <td>${cols[6]}€</td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Errore birre:", err);
  }
}


// =========================
// EVENTS
// =========================
const EVENTS_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5_wEexCQxnpoWje0YrtRDB8C33glfApo-zPmAdBZGaiD_Arlkt8advDNzas5nB-gNbzws20K18iVk/pub?output=csv";

async function loadEvents() {
  const container = document.querySelector("#eventsContainer");
  if (!container) return;

  try {
    const res = await fetch(EVENTS_SHEET_URL);
    const data = await res.text();

    const rows = data.trim().split("\n").slice(1);

    container.innerHTML = "";

    rows.forEach(row => {
      const cols = parseCSVRow(row);

      const titolo = cols[0];
      const descrizione = cols[1];
      const data = cols[2];
      const orario = cols[3];
      const attivo = cols[4];

      if (!titolo) return;
      if (!attivo || attivo.toUpperCase() !== "SI") return;

      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <div class="event-date">
          <span class="event-day">${data}</span>
          <span class="event-time">${orario}</span>
        </div>
        <div class="event-content">
          <h3>${titolo}</h3>
          <p>${descrizione}</p>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Errore eventi:", err);
  }
}


// =========================
// MENU (vino / cibo / drink)
// =========================
const MENU_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaF0RzrOrq8Fm6erKh8rVR-lc4Rtjy71qCTQNTUusGey-cYdZvJPC_lgFndFxAt68DlOboJMR4OiI2/pub?output=csv";

async function loadMenu() {
  const tbody = document.querySelector("#menuBody");
  if (!tbody) return;

  try {
    const res = await fetch(MENU_SHEET_URL);
    const data = await res.text();

    const rows = data.trim().split("\n").slice(1);

    tbody.innerHTML = "";

    rows.forEach(row => {
      const cols = parseCSVRow(row);

      const nome = cols[0];
      const desc = cols[1];
      const cat = cols[2]?.toLowerCase();
      const attivo = cols[3]?.toUpperCase();

      if (!nome) return;
      if (attivo !== "SI") return;

      if (typeof CATEGORY !== "undefined" && cat !== CATEGORY) return;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${nome}</td>
        <td>${desc}</td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Errore menu:", err);
  }
}


// =========================
// INIT PAGE
// =========================
function initPage() {
  loadBeers();
  loadEvents();
  loadMenu();

  setInterval(loadBeers, 30000);
  setInterval(loadEvents, 30000);
  setInterval(loadMenu, 30000);
}


// =========================
// PARTIALS
// =========================
function loadPartial(id, url) {
  const el = document.getElementById(id);
  if (!el) return;

  fetch(url)
    .then(r => r.text())
    .then(html => {
      el.innerHTML = html;

      if (id === "header") {
        initMenu();
      }
    });
}


// =========================
// DOM READY
// =========================
document.addEventListener("DOMContentLoaded", () => {
  loadPartial("header", "partials/header.html");
  loadPartial("footer", "partials/footer.html");

  initMenu();
  initPage();
});