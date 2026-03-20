//Imports the required functions
import { setStatus, errorLoggerBEFORE } from "../handlers/errorLogger.js";
import {} from "../handlers/dropDownMenu.js";
import {} from "../handlers/copy.js";
import figlet from "https://esm.sh/figlet";

let fontList = null;
let observer = null;
const fontItemList = document.getElementById('searchItemList');

function renderFonts(fonts) {
  // If the list is empty
  if (fonts.length === 0) {
    // Clear the list
    fontItemList.innerHTML = "";
    
    // Create the alert
    const alert = document.createElement('p');
    alert.className = "search-alert";
    alert.textContent = "No fonts found, something went wrong?";
    // Append the alert
    fontItemList.appendChild(alert);
    
    // Log the alert for context
    console.warn("No fonts found, something went wrong?");
    return;
  }
  
  // Unobserve all the elements
  fontItemList.querySelectorAll('.search-item').forEach(el => {
    el.classList.remove('visible');
    observer.unobserve(el);
  });
  // Clear the list
  fontItemList.innerHTML = "";
  fonts.forEach((font) => {
    // Setup the item
    const fontItem = document.createElement('li');
    fontItem.className = "search-item";
    fontItem.innerHTML = font;
    
    // Preserve selected font
    const fontInput = document.getElementById('fontsSearch');
    if (font === fontInput.dataset.selected) fontItem.classList.add('selected');
    
    // Add the exact tag if its an exact match
    if (
    // Search Input shouldnt be empty 
    fontInput.value !== "" && 
    font.toLowerCase() === fontInput.value.toLowerCase() && 
    // it shouldnt be the selected one
    font !== fontInput.dataset.selected
    ) {
      const exactTag = document.createElement('span');
      exactTag.textContent = "exact";
      exactTag.className = "tag";
      fontItem.appendChild(exactTag);
    }
    
    // Append the item to the list
    fontItemList.appendChild(fontItem);
  });
  // Smooth fading animation support
  // If observer doesnt exist yet create it
  if (!observer) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
        });
    });
  }
  
  // Observe the items
  fontItemList.querySelectorAll('.search-item').forEach(el => observer.observe(el));
}

// Handle clear Search button
document.getElementById('clearSearchButton').addEventListener("click", function() {
  const searchInput = document.getElementById('fontsSearch');
  // Ignore if the search is already empty
  if (searchInput.value === "") return;
  
  // Clear The search
  searchInput.value = "";
  // Render Old list
  renderFonts(fontList);
  searchInput.focus();
});

// Get all fonts
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

// Handle searching
let filterTimeout = null;
document.getElementById('fontsSearch').addEventListener("input", function() {
  clearTimeout(filterTimeout);
  
  // Add timeout to avoid noise on fast typing
  filterTimeout = setTimeout(() => {
    const filteredList = fontList.filter((font) => font.toLowerCase().includes(this.value.toLowerCase()));
    // If no items match
    if (filteredList.length === 0) {
      // Clear the list
      fontItemList.innerHTML = "";
      
      // Create the alert
      const alert = document.createElement('p');
      alert.className = "search-alert";
      alert.textContent = `No search results for "${this.value}"`;
      // Append the alert
      fontItemList.appendChild(alert);
      
      // Log the alert for context
      console.log(`No search results for "${this.value}"`);
      return;
    }
    
    // Render the searched list
    renderFonts(filteredList);
  }, 150);
});

// Handle font selection
fontItemList.addEventListener("click", function(event) {
  
  // Check if its an dropdown item
  if (!event.target.matches('.search-item')) return;
  
  // Clear old selections
  this.querySelectorAll('.selected').forEach((item) => item.classList.remove('selected'));
  
  const exactTag = event.target.querySelector('.tag');
  if (exactTag) exactTag.remove();
  
  // select the font
  const searchInput = document.getElementById('fontsSearch');
  event.target.classList.add('selected');
  const selectedFont = event.target.textContent.trim();
  searchInput.dataset.selected = selectedFont;
  searchInput.value = selectedFont;
  searchInput.placeholder = selectedFont;
  searchInput.focus();
});

// Focus on combobox when clicked on the container
document.getElementById('comboboxContainer').addEventListener("click", function(event) {
  // If the user is not clicking on the container return (this is made to avoid noise when clicking on combobox buttons)
  if (event.target !== this) return;
  
  document.getElementById('fontsSearch').focus();
});

const resultsBtn = document.getElementById("results-btn");

//Makes an event listener for results button
resultsBtn.addEventListener("click", function () {});