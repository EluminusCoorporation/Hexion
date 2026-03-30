//Imports the required functions
import { setStatus, errorLoggerBEFORE } from "../handlers/errorLogger.js";
import {} from "../handlers/dropDownMenu.js";
import {} from "../handlers/copy.js";
import figlet from "https://esm.sh/figlet";

let fontList = null;

// Smooth fading animation support:
// If observer doesnt exist yet create it
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
  });
});

const fontItemList = document.getElementById('searchItemList');

// FIX: fonts not being bundled with the cdn
figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts" });

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
  fontItemList.querySelectorAll('.combobox-container .select-item').forEach(el => {
    el.classList.remove('visible');
    observer.unobserve(el);
  });
  
  // Clear the list
  fontItemList.innerHTML = "";
  
  // create elements one by one
  fonts.forEach((font) => {
    // Setup the item
    const fontItem = document.createElement('li');
    fontItem.className = "select-item";
    fontItem.textContent = font;
    
    // Preserve selected font
    const fontInput = document.getElementById('fontsSearch');
    if (font === fontInput.dataset.selected) fontItem.classList.add('selected');
    
    // Add default tag if its the default font
    if (font === "Standard") {
      const defaultTag = document.createElement('span');
      defaultTag.textContent = "default";
      defaultTag.className = "tag";
      fontItem.appendChild(defaultTag);
    };
    
    // Add the exact tag if its an exact match
    if (
    // Search Input shouldnt be empty 
    fontInput.value !== "" && 
    font.toLowerCase() === fontInput.value.toLowerCase() && 
    // it shouldnt be the selected one
    font !== fontInput.dataset.selected &&
    // it shouldnt be the default one
    font !== "Standard"
    ) {
      const exactTag = document.createElement('span');
      exactTag.textContent = "exact";
      exactTag.className = "tag";
      fontItem.appendChild(exactTag);
    }
    
    // Append the item to the list
    // If its the default one append it on top
    if (font === "Standard") return fontItemList.prepend(fontItem);
    fontItemList.appendChild(fontItem);
  });
  
  // Observe all the items
  fontItemList.querySelectorAll('.combobox-container .select-item').forEach(el => observer.observe(el));
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

// FIX: Don't lose focus when selection happens
fontItemList.addEventListener("mousedown", event => {
  if (event.target.closest('.select-item')) event.preventDefault();
});

// Handle font selection
fontItemList.addEventListener("click", function(event) {
  const searchInput = document.getElementById('fontsSearch');
  
  // Check if its an dropdown item
  if (!event.target.closest('.select-item')) return;
  // ignore if already selected
  if (event.target.textContent.trim() === searchInput.dataset.selected) return;
  
  // Clear old selections
  this.querySelectorAll('.selected').forEach((item) => item.classList.remove('selected'));
  
  const exactTag = event.target.querySelector('.tag');
  if (exactTag) exactTag.remove();
  
  // select the font
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

// Handle ascii art creation
document.getElementById("results-btn").addEventListener("click", async () => {
  toggleLoader(true);
  try {
    const text = document.getElementById('inputContainer').value;
    const font = document.getElementById('fontsSearch').dataset.selected || "Standard";
    const width = document.getElementById('asciiWidth').value;
    const horizontalLayout = document.querySelector('.horizontal-layout').dataset.selected;
    const verticalLayout = document.querySelector('.vertical-layout').dataset.selected;
    const whiteSpaceBreak = document.getElementById('whiteSpaceBreak');
    
    if (!text) throw new Error('The required fields were not provided');
    
    // Generate the ascii art
    const asciiArt = await figlet.text(text, {
      font,
      ...(horizontalLayout && { horizontalLayout }),
      ...(verticalLayout && { verticalLayout }),
      ...(width && { width }),
      whiteSpaceBreak,
    });
    
    // If its empty throw error
    if (!asciiArt) throw new Error('The ascii art is empty, did you enter the correct info?');
    
    // Apply it to results
    document.getElementById('results').textContent = asciiArt;
    document.getElementById('resultsContainer').style.display = "flex";
  } catch (error) {
    setStatus('error', 'Ascii Art Generator Failed', error);
    console.error('An error occured while generating ascii art: ', error);
  } finally {
    toggleLoader(false);
  };
});