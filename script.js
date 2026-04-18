const navToggleButton = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".site-nav");
const themeButton = document.getElementById("themeButton");
const themeIcon = document.getElementById("themeIcon");
const currentYear = document.getElementById("year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (navToggleButton && navMenu) {
  navToggleButton.addEventListener("click", () => {
    const expanded = navToggleButton.getAttribute("aria-expanded") === "true";
    navToggleButton.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("is-open");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggleButton.setAttribute("aria-expanded", "false");
    });
  });
}

const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const setTheme = (theme) => {
  document.body.classList.toggle("light-theme", theme === "light");
  localStorage.setItem("theme", theme);
  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
};

if (themeButton) {
  setTheme(getPreferredTheme());

  themeButton.addEventListener("click", () => {
    const activeTheme = document.body.classList.contains("light-theme")
      ? "light"
      : "dark";
    setTheme(activeTheme === "dark" ? "light" : "dark");
  });
}
