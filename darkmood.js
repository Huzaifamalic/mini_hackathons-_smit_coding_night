const btn = document.getElementById("toggleTheme");

  function applyTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    btn.innerHTML = isDark
      ? '<i data-lucide="sun"></i> <span>Light Mode</span>'
      : '<i data-lucide="moon"></i> <span>Dark Mode</span>';
    lucide.createIcons();
  }

  btn?.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyTheme();
  });

  // Apply saved theme on page load
  if(localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
  applyTheme();