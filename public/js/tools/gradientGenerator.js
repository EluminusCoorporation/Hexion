//Imports the required functions
import { setAlert } from '../handlers/errorLogger.js';
import { setFunction } from '../handlers/dropDownMenu.js'
import { copyText } from '../handlers/copy.js'
import "https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.es5.min.js";

let charList = null;

let maxColors = 6;
let maxChars = 3;
let colors = 2;

// refresh maxChars
function refreshChars() {
  const text = document.getElementById('inputText').value;
  maxChars = Math.floor(text.length / colors);
}

// updateColor function
function updateColors(number) {
  colors = number;
  refreshChars();
}

function refreshColors() {
  const currentColors = document.querySelectorAll('.color-container');
  const totalColors = currentColors.length;
  
  // Enable all colors
  currentColors.forEach(color => color.classList.remove('disabled'));
  document.getElementById('errorMessage').style.display = "none";
  document.getElementById('addColorButton').classList.remove('deselect');
  
  // If colors are more than expected
  if (totalColors >= maxColors) {
    // how many more?
    const iterations = totalColors - maxColors;
    // if at the edge limit
    if (iterations >= 0) {
      const errorMessage = document.getElementById('errorMessage');
      
      errorMessage.style.display = "block";
      errorMessage.querySelector('span').textContent = `(${maxColors})`;
      document.getElementById('addColorButton').classList.add('deselect');
    }
    
    // Disable those extra ones
    for(let i = 0; i < iterations; i++) {
      const siblings = document.querySelectorAll('.color-container:not(.disabled)');
      const last = siblings[siblings.length - 1];
      
      last.classList.add('disabled');
    };
  };
};

let timeout;
document.addEventListener('DOMContentLoaded', () => {
  //event listener for each color
  const colorsContainer = document.getElementById('colorsContainer')
  colorsContainer.addEventListener('click', (event) => {
    //if its a copy button
    if (event.target.id === "copyIcon") {
      //copy texts
      const text = event.target.nextElementSibling.textContent;
      
      copyText(text, event.target);
    }
  });
});
setFunction(refreshOutput);

// Number validation
document.getElementById('inputChars').addEventListener("change", function() {
  if (!this.value) this.value = 1;
  if (this.value > maxChars) this.value = maxChars;
  
  refreshOutput();
});

const colorDropdownmenu = document.getElementById('colorDropdownmenu');

//the dropdownmenu button for the colors
colorDropdownmenu.addEventListener('click', () => {
  const colorDropdownmenuIcon = document.getElementById('colorDropdownmenuIcon');
  const colorsGridContainer = document.getElementById('colorsGridContainer');
  
  //Enables the menu
  colorDropdownmenuIcon.classList.toggle('active');
  colorsGridContainer.classList.toggle('show');
})

const optionsCheckbox = document.querySelectorAll(".toggle");

// Updates the output
async function refreshOutput() {
  try {
    const results = document.getElementById('results');
  
    // get important parameters
    const colors = [...document.querySelectorAll(".color-container:not(.disabled) .color-name")].map(el => el.textContent);
    const input = document.getElementById('inputText').value;
    const charLimit = document.getElementById('inputChars').value;
    const type = document.getElementById("dropdownSelected").dataset.selected;
    
    // If input is empty return
    if (!input) {
      results.textContent = "";
      return;
    }
    
    // default styles(none)
    const styles = {
      "bold": false,
      "underline": false,
      "italic": false,
      "strikethrough": false,
      "obfuscation": false,
    };
  
    // default options(none)
    const options = {
      trim: false,
      lowercaseHex: false
    };
  
    optionsCheckbox.forEach((checkbox) => {
      if (!checkbox.checked) return;
    
      const optionType = checkbox.dataset.type;
      options[optionType] = true;
    });
    
  
    // Check if any stylers are enabled and update the options
    const stylerCheckBoxes = [...document.querySelectorAll('.styler-label input')];
    stylerCheckBoxes.forEach((checkbox) => {
      if (!checkbox.checked) return;
      
      const styleType = checkbox.dataset.style;
      styles[styleType] = true;
    });
    
    // Send the request to the backend
    const res = await fetch('/api/gradient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, input, colors, styles, options, charLimit })
    });
  
    // checks if response exists
    if (!res) throw new Error('No response from our internal server, try again later.');
    
    // checks if response is an valid json
    const contentType = res.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('An unexpected response from the server.\n\nRESPONSE: ' + text);
      
      throw new Error('Unexpected server response.');
    };
    
    //check if res is ok
    if (!res.ok) {
      const errorMessage = ((await res.json()).message) || "An unknown error occured.";
      throw new Error(errorMessage);
    };
    
    const data = await res.json();
    
    if (!data) throw new Error("Our server's response was empty?")

    results.textContent = data.output.text;
    
    // Update Gradient
    updateGradient(data.output.data);
  } catch (error) {
    setAlert("error", "Gradient Generator Failed", error)
    console.error('An error occured while generating gradient: \n' + error)
  }
}

optionsCheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", () => refreshOutput())
});

// Get formatted stylers
function getStylers(options) {
  // Styler formats
  const stylerFormats = {
    bold: "bold",
    underline: "underline",
    italic: "italic",
    strikethrough: "strike-through",
    obfuscation: "obfuscated"
  };

  //stylers will be set here
  let stylers = "";

  // get the stylers that are selected
  const trueOptions = Object.keys(options).filter(key => options[key] === true);

  // apply the stylers
  trueOptions.forEach(option => (stylers += stylerFormats[option] + " "));

  // return the stylers
  return stylers;
}

// Updates the gradient
function updateGradient(data) {
  if (!data) return;
  
  const previewText = document.getElementById('previewText');
  
  // Clear old gradient
  previewText.innerHTML = "";
  
  data.forEach(item => {
    const textElement = document.createElement('span');
    const stylers = getStylers(item.styles);
    
    // Apply content
    textElement.style.display;
    textElement.style.textShadow = `6px 6px 0 ${item.color}1A`;
    textElement.style.color = item.color;
    // Replace spaces with html-correct spaces
    textElement.textContent = item.char === " " ? "\u00A0" : item.char;
    textElement.className = stylers;
    
    // Append it
    previewText.appendChild(textElement);
  });
  
  // Cache the list
  charList = previewText.querySelectorAll('span');
};

// Creates an pickr
function createPickr(el, color) {
  const colorNameContainer = el.nextElementSibling;
  const colorName = colorNameContainer.querySelector('.color-name');
  
  //sets the pickr
  const pickr = Pickr.create({
    el: el,
    theme: 'monolith',
    default: color,
    
    components: {
      // Main components
      preview: true,
      opacity: false,
      hue: true,
      
      // Input / output Options
      interaction: {
        hex: false,
        rgba: false,
        hsla: false,
        hsva: false,
        cmyk: false,
        input: true,
        clear: false,
        save: true
      }
    }
  });
  //on save
  pickr.on('save', (color, instance) => {
    const colorHex = color.toHEXA().toString();
    //Adds the colors on the viewer interface
    colorName.textContent = colorHex
    colorName.style.color = colorHex
    refreshOutput();
  })
  refreshOutput();
}

// For each container create an pickr
document.querySelectorAll('.color-preview').forEach((el, i) => {
  createPickr(el, i === 0 ? "#00FF7F" : "#92FFD6");
});

function moveAnimation(list, map) {
  list.forEach(el => {
    el.style.transition = "none";
    
    // Get correct movement coordinates
    const first = map.get(el);
    const last = el.getBoundingClientRect();
    
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    
    // Apply those coordinates
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    
    el.offsetHeight;
    
    el.style.transition = "transform 150ms linear";
    el.style.transform = "translate(0, 0)";
  });
}

function setUpMoverUp(el) {
  // Gets the color
  const node = el.parentNode.parentNode.parentNode;
  const parent = node.parentNode;
  
  // Return if its the first color
  if (node === parent.firstElementChild) return;
  // Clear old animations
  node.style.animation = "none";
  
  // Gets the next color
  const previousSibling = node.previousElementSibling;
  
  const list = document.querySelectorAll('.color-container');
  // Set correct positions of each element
  const mapper = new Map();
  list.forEach(item => {
    mapper.set(item, item.getBoundingClientRect());
  });
  
  // Changes the position
  parent.insertBefore(node, previousSibling);
  
  // Apply the animation
  moveAnimation(list, mapper);
  
  // Reloads the gradient
  refreshOutput();
}

function setUpMoverDown(el) {
  // Gets the color
  const node = el.parentNode.parentNode.parentNode;
  const parent = node.parentNode;
  
  // Clear old animations
  node.style.animation = "none";
  
  const nextSibling = node.nextElementSibling;
  // Ignore if this is the last sibling
  if (!nextSibling) return;
   
  const list = document.querySelectorAll('.color-container');
  // Set correct positions of each element
  const mapper = new Map();
  list.forEach(item => {
    mapper.set(item, item.getBoundingClientRect());
  });
  
  // Changes the position
  parent.insertBefore(node, nextSibling.nextElementSibling);
  
  // Apply the animation
  moveAnimation(list, mapper);
  
  // Reloads the gradient
  refreshOutput();
}

const moveUp = document.querySelectorAll("#moveUp");
const moveDown = document.querySelectorAll("#moveDown");

moveUp.forEach((moverUp) => {
  moverUp.addEventListener("click", function() {
    setUpMoverUp(this);
  });
});

moveDown.forEach((moverDown) => {
  moverDown.addEventListener("click", function() {
    setUpMoverDown(this);
  });
});

let errorTimeout;

const addColorButton = document.getElementById('addColorButton');
//add color button
addColorButton.addEventListener('click', () => {
  const colorsContainer = document.getElementById('colorsContainer');
  const colorContainer = document.querySelector('.use-as-clone');
  
  //copies the original container
  const clonedContainer = colorContainer.cloneNode(true);
  const clonedColorName = clonedContainer.querySelector('.color-name')
  
  const el = clonedContainer.querySelector('.pickr');
  const childIcon = document.createElement('i');
  
  const colorContainerLength = colorsContainer.querySelectorAll('.color-container').length;
  const errorMessage = document.getElementById('errorMessage');
  
  // does some adjustments in the copy
  errorMessage.style.display = "none";
  addColorButton.classList.remove('deselect');
  
  //clears the id
  clonedContainer.id = '';
  
  //clears the color name
  if (clonedColorName.style.color != "#000000") {
    clonedColorName.textContent = "#000000";
    clonedColorName.style.color = "#000000"
  }
  //sets the icon
  childIcon.classList.add('bx', 'bx-trash', 'delete-icon');
  
  //adds the icon
  clonedContainer.appendChild(childIcon);
  
  //creates the pickr
  createPickr(el, "#000000");
  
  //Reloads the movers
  const moveUp = clonedContainer.querySelector("#moveUp");
  const moveDown = clonedContainer.querySelector("#moveDown");

  moveUp.addEventListener("click", function() {
    setUpMoverUp(this);
  });
  
  moveDown.addEventListener("click", function() {
    setUpMoverDown(this);
  });
  
  // Increment colors
  updateColors(colors + 1);
  
  //adds the color
  colorsContainer.appendChild(clonedContainer);
  
  // if reached the max limit return
  if (colorContainerLength  >= maxColors) {
    clearTimeout(errorTimeout);
    errorMessage.style.display = "block";
    errorMessage.querySelector('span').textContent = `(${maxColors})`;
    addColorButton.classList.add('deselect');
    return;
  }
  
  //Update the required factors
  refreshOutput();
});

const colorsContainer = document.getElementById('colorsContainer');

colorsContainer.addEventListener('click', (event) => {
  //if its delete icon
  if (event.target.classList.contains('delete-icon')) {
    //deletes the color
    const container = event.target.parentNode;
    
    container.style.animation = "contractOut 150ms ease-out forwards";
    container.addEventListener("animationend", event => {
      if (event.animationName !== "contractOut") return;
      container.remove();
      
      // Decrement Colors
      updateColors(colors - 1);
      
      const currentColors = document.querySelectorAll('.color-container').length;
      if (currentColors !== maxColors) {
        document.getElementById('errorMessage').style.display = "none";
        document.getElementById('addColorButton').classList.remove('deselect');
      }
      
      refreshOutput();
    }, { once: true });
  };
});

const resultsBtn = document.getElementById('results-btn');

const inputText = document.getElementById('inputText');
const previewText = document.getElementById('previewText');

// realtime input updater
let filterTimeout;

inputText.addEventListener('input', (event) => {
  // Filter for noise
  clearTimeout(filterTimeout);
  
  filterTimeout = setTimeout(() => {
    const text = event.target.value;
    
    previewText.dataset.text = text;
    previewText.textContent = text;
    // Set maxColors
    maxColors = text.length;
    
    // Refresh maxChars
    refreshChars();
    
    // Refresh Colors
    refreshColors();
    
    // Refresh the gradient output
    refreshOutput();
  }, 150);
});

function randomChar() {
  // Random letters
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  return chars[Math.floor(Math.random() * chars.length)];
};

function updateObfuscation() {
  if (!charList) return;
  
  // Update obfuscation
  charList.forEach(char => {
    if (char.classList.contains("obfuscated")) char.textContent = randomChar();
  });
};

let lastUpdated = 0;
function animateObfuscation(time) {
  if (time - lastUpdated > 50) {
    updateObfuscation();
    lastUpdated = time;
  }
  
  requestAnimationFrame(animateObfuscation);
};

requestAnimationFrame(animateObfuscation);

const stylers = document.querySelectorAll('.stylers');
stylers.forEach((styler) => {
  styler.addEventListener("change", () => refreshOutput());
});

// Copy on click for the results
document.getElementById('results').addEventListener("click", function() {
  const text = this.value;
  copyText(text);
});
