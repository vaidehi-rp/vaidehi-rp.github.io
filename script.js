const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = [...document.querySelectorAll(".fade-in")];

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.1 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 35, 240)}ms`;
  revealObserver.observe(item);
});

const setActiveNavLink = () => {
  const scrollY = window.scrollY + 160;
  let activeId = sections[0]?.id;

  sections.forEach((section) => {
    if (scrollY >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const target = link.getAttribute("href")?.slice(1);
    link.classList.toggle("is-active", target === activeId);
  });
};

setActiveNavLink();
window.addEventListener("scroll", setActiveNavLink, { passive: true });
