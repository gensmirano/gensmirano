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