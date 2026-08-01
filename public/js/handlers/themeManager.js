const themeSwitcher = document.getElementById("themeSwitcher");

// Assign theme icons
function assignThemeIcon(theme) {
  let iconCode = "";
  switch (theme) {
    case "system":
      iconCode = "bx bx-desktop";
      break;
    case "light":
      iconCode = "bx bx-sun";
      break;
    case "dark":
      iconCode = "bx bx-moon";
      break;
  }

  themeSwitcher.querySelector('i').className = iconCode;
}

// Fetch the theme set by the user on last site load
let currentTheme = localStorage.getItem("prefTheme") || 'system';

// All themes
const themes = [
  'system',
  'dark',
  'light'
];

themeSwitcher.addEventListener("click", () => {
  // Get the item index of current theme
  const currentThemeIndex = themes.indexOf(currentTheme);

  // Switch mode (ahead by 1)
  currentTheme = themes[currentThemeIndex != (themes.length - 1) ? currentThemeIndex + 1 : 0];

  // Apply theme changes
  document.documentElement.dataset.theme = currentTheme;
  assignThemeIcon(currentTheme);

  // Store the theme for next site load
  localStorage.setItem("prefTheme", currentTheme);
})

// Assign the icon as soon as the page loads. The theme preference is already applied by an small starter script
document.addEventListener("DOMContentLoaded", () => assignThemeIcon(currentTheme));