document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo"); // target your logo
  console.log(logo);

  const setLogo = (theme) => {
    if (theme === "dark") {
      logo.src = "./sonio_dark.png";
    } else {
      logo.src = "./sonio_light.png";
    }
  };

  // Detect the current theme based on prefers-color-scheme
  const currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  setLogo(currentTheme);

  // Listen for theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const newTheme = e.matches ? "dark" : "light";
      setLogo(newTheme);
    });
});
