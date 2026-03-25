<!-- © 2026 Romeo - tutti i diritti riservati -->
// ==========================
// LOTTIE: MENU PLANT
// ==========================

let plantAnimation = lottie.loadAnimation({
  container: document.getElementById('menu-plant'),
  renderer: 'svg',
  loop: false,      // non ripete
  autoplay: false,  // parte solo quando apri il menu
  path: 'img/plant.json'
});


// ==========================
// HAMBURGER MENU
// ==========================
function initHamburger() {

  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav-menu');
  const siteContent = document.querySelector('.site-content');

  hamburger.addEventListener('click', () => {

    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    siteContent.classList.toggle('menu-open');

    // quando il menu viene aperto
    if(nav.classList.contains('active')){

      // riparte da frame 0
      plantAnimation.goToAndPlay(0, true);

    }

  });

}

initHamburger();


// ==========================
// FADE IN SCROLL
// ==========================
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {

  entries.forEach(entry => {

    if(entry.isIntersecting){

      entry.target.classList.add('visible');
      observer.unobserve(entry.target);

    }

  });

}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});