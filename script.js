const navbar = document.querySelector(".navbar");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const counters = document.querySelectorAll(".counter");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

const updateNavbar = () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 30);
};

updateNavbar();
window.addEventListener("scroll", updateNavbar, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
}

document.querySelectorAll(".navbar-nav .nav-link, .navbar-nav .btn, .footer-list a").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("mainNavbar");
    if (!menu || !menu.classList.contains("show")) return;
    if (typeof bootstrap === "undefined") return;
    const collapse = bootstrap.Collapse.getOrCreateInstance(menu);
    collapse.hide();
  });
});

const animateCounter = (counter) => {
  if (counter.dataset.animated === "true") return;
  counter.dataset.animated = "true";
  const target = Number(counter.dataset.count || 0);
  if (prefersReducedMotion) {
    counter.textContent = target;
    return;
  }

  const duration = 1300;
  const startTime = performance.now();

  const tick = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
} else {
  counters.forEach(animateCounter);
}

const setActiveNavLink = () => {
  const scrollPosition = window.scrollY + 130;
  let currentId = "home";

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
};

setActiveNavLink();
window.addEventListener("scroll", setActiveNavLink, { passive: true });

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get("name") || "there";
    formStatus.hidden = false;
    formStatus.textContent = `Thank you, ${name}. Your message has been submitted successfully. HBC Exports will contact you shortly.`;
    contactForm.reset();
  });
}
