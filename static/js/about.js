// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNavOverlay = document.getElementById("mobileNavOverlay");
let isMenuOpen = false;

mobileMenuBtn.addEventListener("click", function () {
  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    mobileMenuBtn.classList.add("active");
    mobileNavOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    mobileMenuBtn.classList.remove("active");
    mobileNavOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Close mobile menu when clicking on links
document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    isMenuOpen = false;
    mobileMenuBtn.classList.remove("active");
    mobileNavOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
  });
});

// Close menu when clicking outside
mobileNavOverlay.addEventListener("click", function (e) {
  if (e.target === mobileNavOverlay) {
    isMenuOpen = false;
    mobileMenuBtn.classList.remove("active");
    mobileNavOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Testimonial Carousel
const testimonials = document.querySelectorAll(".testimonial");
const nav = document.getElementById("testimonial-nav");
let current = 0;
function showTestimonial(idx) {
  testimonials.forEach((t, i) => t.classList.toggle("active", i === idx));
  document
    .querySelectorAll(".testimonial-dot")
    .forEach((d, i) => d.classList.toggle("active", i === idx));
}
function createDots() {
  for (let i = 0; i < testimonials.length; i++) {
    const dot = document.createElement("span");
    dot.className = "testimonial-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => {
      current = i;
      showTestimonial(current);
    });
    nav.appendChild(dot);
  }
}
if (nav) createDots();
if (testimonials.length > 0) {
  setInterval(() => {
    current = (current + 1) % testimonials.length;
    showTestimonial(current);
  }, 5000);
}

// Timeline animation on scroll
function revealTimeline() {
  const events = document.querySelectorAll(".timeline-event");
  const trigger = window.innerHeight * 0.85;
  events.forEach((event) => {
    const top = event.getBoundingClientRect().top;
    if (top < trigger) event.classList.add("visible");
  });
}
window.addEventListener("scroll", revealTimeline);
window.addEventListener("DOMContentLoaded", revealTimeline);

// Highlight About link
document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.href.includes("about")) link.classList.add("active");
});

// Back to Top Button
const backToTopBtn = document.getElementById("backToTopBtn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// WhatsApp direct open for mobile (for team section)
document
  .querySelectorAll('.team-socials a[title="WhatsApp"]')
  .forEach((link) => {
    link.addEventListener("click", function (e) {
      if (window.innerWidth < 900) {
        let href = this.getAttribute("href");
        window.open(href, "_blank");
        e.preventDefault();
      }
    });
  });






  

window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 300);
  }
});
