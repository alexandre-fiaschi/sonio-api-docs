document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo"); // Assuming the logo has an ID 'logo'

  const setLogo = () => {
    const htmlElement = document.documentElement; // Select the <html> element

    if (htmlElement.classList.contains("theme--dark")) {
      logo.src = "./sonio_dark.png"; // Switch to dark mode logo
    } else {
      logo.src = "./sonio_light.png"; // Switch to light mode logo
    }
  };

  // Call the function initially to set the logo on page load
  setLogo();

  // Optionally, if theme can change dynamically, listen for class changes (MutationObserver)
  const observer = new MutationObserver(() => {
    setLogo();
  });

  // Start observing the <html> element for attribute/class changes
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});
