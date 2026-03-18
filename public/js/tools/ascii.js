//Imports the required functions
import { setStatus, errorLoggerBEFORE } from "../handlers/errorLogger.js";
import {} from "../handlers/dropDownMenu.js";
import {} from "../handlers/copy.js";
import figlet from "https://esm.sh/figlet";

let fontList = null;

function renderFonts(fonts) {
  const fontItemList = document.getElementById('searchItemList');
  // Clear the list
  fontItemList.innerHTML = "";
  fonts.forEach((font) => {
    // Setup the item
    const fontItem = document.createElement('li');
    fontItem.className = "search-item";
    fontItem.innerHTML = font;
    // preserve selected font
    const fontInput = document.getElementById('fontsSearch');
    if (font === fontInput.dataset.selected) fontItem.classList.add('selected');
    // Append the item to the list
    fontItemList.appendChild(fontItem);
  });
}

// Handle clear Search button
document.getElementById('clearSearchButton').addEventListener("click", function() {
  const searchInput = document.getElementById('fontsSearch');
  // Clear The search
  searchInput.value = "";
  // Render Old list
  renderFonts(fontList);
  searchInput.focus();
});


figlet.fonts(function(err, fonts) {
  if (err) {
    setStatus('error', 'Font Loader Failed', 'Failed to Load the available fonts: ' + err);
    console.error('Error loading fonts:\n' + err);
    return;
  };
  // Cache the list
  fontList = fonts;
  console.dir(fonts);
  
  renderFonts(fonts);
});

let filterTimeout = null;
document.getElementById('fontsSearch').addEventListener("input", function() {
  clearTimeout(filterTimeout);
  
  filterTimeout = setTimeout(() => {
    const filteredList = fontList.filter((font) => font.toLowerCase().includes(this.value.toLowerCase()));
    if (filteredList.length === 0) {
      document.getElementById('searchItemList').innerHTML = `No Items matched with "${this.value}"`
    }
    renderFonts(filteredList);
  }, 150);
});

// Handle font selection
document.getElementById('searchItemList').addEventListener("click", function(event) {
  // Check if its an search item
  if (!event.target.matches('.search-item')) return;
  
  // Clear old selections
  const oldSelected = this.querySelectorAll('.selected');
  oldSelected.forEach((item) => item.classList.remove('selected'));
  
  // select the font
  const searchInput = document.getElementById('fontsSearch');
  event.target.classList.add('selected');
  searchInput.dataset.selected = event.target.textContent;
  searchInput.value = event.target.textContent;
  searchInput.placeholder = event.target.textContent;
  searchInput.focus();
})

const resultsBtn = document.getElementById("results-btn");

//Makes an event listener for results button
resultsBtn.addEventListener("click", function () {});