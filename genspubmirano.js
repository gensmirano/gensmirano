// =========================
// LOADER
// =========================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});


// =========================
// MOBILE MENU (HAMBURGER)
// =========================
const burger = document.getElementById("burger");
const nav = document.getElementById("navMenu");

if (burger && nav) {
  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
    burger.classList.toggle("open");
  });

  // chiudi menu quando clicchi un link
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
const items = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, {
  threshold: 0.15
});

items.forEach(el => observer.observe(el));

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRe5KKKXcOERA7qDCoWHaUuA60jhXryRHfl7cE6CYtHSvhRIjXa5bl41iJsAc-jnpIQo1L5enuGNsqV/pub?output=csv";

async function loadBeers() {
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.text();

    const rows = data.trim().split("\n").slice(1);
    const tbody = document.querySelector("#beerTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    rows.forEach(row => {
      const cols = parseCSVRow(row);

      // sicurezza: se riga vuota o incompleta
      if (!cols[0]) return;

      // colonna "disponibile" = SI/NO
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
    console.error("Errore caricamento birre:", err);
  }
}

/**
 * Parser CSV robusto (gestisce virgole dentro le celle)
 */
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

  return result.map(v =>
    v.replace(/^"|"$/g, "").trim()
  );
}

// inizializza
loadBeers();

// refresh automatico
setInterval(loadBeers, 30000);
