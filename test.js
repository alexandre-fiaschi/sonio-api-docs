<script>
  document.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('logo');
    
    const setLogo = (theme) => {
      if (theme === 'dark') {
        logo.src = './sonio_dark.jpg'; // Switch to the dark mode logo
      } else {
        logo.src = './sonio_light.jpg'; // Switch back to the light mode logo
      }
    };

    // Detect if dark mode is preferred on load
    const currentTheme = window.matchMedia('(prefers-color-scheme: dark)')
    // .matches ? 'dark' : 'light';
    console.log(currentTheme)
    setLogo(currentTheme);
    

    // Listen for system-level theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setLogo(newTheme);
    });
  });
</script>