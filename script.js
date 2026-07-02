const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = [...document.querySelectorAll(".fade-in")];
const ownerAnalytics = document.getElementById("ownerAnalytics");
const ownerVisitCount = document.getElementById("ownerVisitCount");
const profilePhoto = document.getElementById("profilePhoto");
const profilePhotoCard = document.getElementById("profilePhotoCard");

const OWNER_QUERY_PARAM = "owner";
const OWNER_ACCESS_CODE = "vp09";
const OWNER_STORAGE_KEY = "vp-owner-mode";
const LOCAL_FALLBACK_COUNTER_KEY = "vp-local-visit-count";
const VISIT_COUNTER_NAMESPACE = "vaidehi-rp-portfolio";
const VISIT_COUNTER_KEY = "total-visits";

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

const searchParams = new URLSearchParams(window.location.search);
const ownerToken = searchParams.get(OWNER_QUERY_PARAM);

if (ownerToken === OWNER_ACCESS_CODE) {
  localStorage.setItem(OWNER_STORAGE_KEY, "true");
} else if (ownerToken === "off") {
  localStorage.removeItem(OWNER_STORAGE_KEY);
}

if (ownerToken) {
  searchParams.delete(OWNER_QUERY_PARAM);
  const nextQuery = searchParams.toString();
  const nextUrl = `${window.location.pathname}${
    nextQuery ? `?${nextQuery}` : ""
  }${window.location.hash}`;
  window.history.replaceState({}, "", nextUrl);
}

const isOwnerMode = localStorage.getItem(OWNER_STORAGE_KEY) === "true";

const revealOwnerAnalytics = (value, isLocalFallback = false) => {
  if (!isOwnerMode || !ownerAnalytics || !ownerVisitCount) {
    return;
  }

  ownerVisitCount.textContent = String(value);
  if (isLocalFallback) {
    ownerVisitCount.textContent += " (local)";
  }
  ownerAnalytics.hidden = false;
  ownerAnalytics.setAttribute("aria-hidden", "false");
};

const updateVisitCounter = async () => {
  try {
    const response = await fetch(
      `https://api.countapi.xyz/hit/${VISIT_COUNTER_NAMESPACE}/${VISIT_COUNTER_KEY}`
    );
    if (!response.ok) {
      throw new Error("Counter request failed");
    }

    const data = await response.json();
    revealOwnerAnalytics(data.value);
  } catch (error) {
    const localCount =
      Number(localStorage.getItem(LOCAL_FALLBACK_COUNTER_KEY) || "0") + 1;
    localStorage.setItem(LOCAL_FALLBACK_COUNTER_KEY, String(localCount));
    revealOwnerAnalytics(localCount, true);
  }
};

updateVisitCounter();

if (profilePhoto && profilePhotoCard) {
  profilePhoto.addEventListener("error", () => {
    profilePhotoCard.classList.add("is-missing-photo");
  });
}
