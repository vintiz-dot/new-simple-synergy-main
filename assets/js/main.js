/**
* Template Name: Mentor - v4.7.0
* Template URL: https://bootstrapmade.com/mentor-free-education-bootstrap-theme/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";
// Utility function to load a template file
function loadTemplate(url) {
  console.log("Loading:", url);
  return fetch(url).then(response => response.text());
}

// Function to set the active class on the navbar links
function setActiveNav() {
  // Extract the current file name from the URL, default to "index.html"
  let currentFile = window.location.pathname.split("/").pop();
  if (!currentFile || currentFile === "") {
    currentFile = "index.html";
  }
  currentFile = currentFile.split("?")[0].split("#")[0];
  console.log("Current file:", currentFile);

  // Select all navigation links within the navbar (inside the injected header)
  const navLinks = document.querySelectorAll("#navbar a");
  navLinks.forEach(function(link) {
    let linkFile = link.getAttribute("href").split("/").pop();
    linkFile = linkFile.split("?")[0].split("#")[0];
    console.log("Checking link:", linkFile);
    if (linkFile === currentFile) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Load and inject the partials
Promise.all([
  loadTemplate('partials/header.handlebars'),
  loadTemplate('partials/footer.handlebars')
]).then(function(templates) {
  // Register the partials (if you need them elsewhere)
  Handlebars.registerPartial('header', templates[0]);
  Handlebars.registerPartial('footer', templates[1]);

  // Render the header and footer into their placeholders
  document.getElementById('header-placeholder').innerHTML = Handlebars.compile("{{> header}}")();
  document.getElementById('footer-placeholder').innerHTML = Handlebars.compile("{{> footer}}")();

  // Now that the header (and its navbar) is in the DOM, run the active nav logic.
  setActiveNav();
}).catch(function(error) {
  console.error("Error loading partials:", error);
});

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 2,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()