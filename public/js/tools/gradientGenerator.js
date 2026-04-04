//Imports the required functions
import { setAlert } from '../handlers/errorLogger.js';
import { setFunction } from '../handlers/dropDownMenu.js'
import { copyText } from '../handlers/copy.js'
import "https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.es5.min.js";

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
  
  updateGradient();
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
    const colors = [...document.querySelectorAll(".color-name")].map(el => el.textContent);
    const input = document.getElementById('inputText').value;
    const charLimit = document.getElementById('inputChars').value;
    const type = document.getElementById("dropdownSelected").dataset.selected;
    
    // If input is empty return
    if (!input) return;
    
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
    
    //Send the request to the backend
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

    results.textContent = data.output;
  } catch (error) {
    setAlert("error", "Gradient Generator Failed", error)
    console.error('An error occured while generating gradient: \n' + error)
  }
}

optionsCheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", () => refreshOutput())
});

//Updates the gradient
function updateGradient() {
  //Refreshes the colors
  const colorNames = [...document.querySelectorAll(".color-name")].map(el => el.textContent);
  
  //Updates the gradient accordingly
  document.documentElement.style.setProperty("--gradientXXX", `linear-gradient(to right, ${colorNames.join(", ")}`)
  // Get the updated output
  refreshOutput();
}

//Creates an pickr
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
    updateGradient();
  })
  updateGradient();
}

// For each container create an pickr
document.querySelectorAll('.color-preview').forEach((el, i) => {
  createPickr(el, i === 0 ? "#00FF7F" : "#92ffd6");
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
  updateGradient();
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
  updateGradient();
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
  
  //if reached the max limit return
  if (colorContainerLength === 15) {
    clearTimeout(errorTimeout);
    errorMessage.style.display = "block";
    addColorButton.classList.add('deselect');
    return;
  }
  
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
  
  //Update the required factors
  updateGradient();
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
      
      updateGradient();
    }, { once: true });
  };
});

const resultsBtn = document.getElementById('results-btn');

const inputText = document.getElementById('inputText');
const previewText = document.getElementById('previewText');

//realtime input changer
inputText.addEventListener('input', (event) => {
  const text = event.target.value;
  
  previewText.dataset.text = text;
  previewText.textContent = text;
  
  // Refresh maxChars
  refreshChars();
  
  refreshOutput();
});

function startObfuscation(element) {
  //Stores the text
  const original = element.dataset.text
  
  //Random letters
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  
  //Time to update on
  let interval = setInterval(() => {
    let scrambled = "";
    for (let i = 0; i < original.length; i++) {
      //Random letters being replaced
      scrambled += chars[Math.floor(Math.random() * chars.length)];
    }
    //Changes the content
    element.textContent = scrambled;
  }, 50);
  
  element._obfInterval = interval;
}

function stopObfuscation(element) {
  //Stops the obfuscation
  if (element._obfInterval) {
    clearInterval(element._obfInterval);
    element.textContent = element.dataset.text;
  }
}

const stylers = document.querySelectorAll('.stylers');
stylers.forEach((styler) => {
  styler.addEventListener("change", function(event) {
    const stylerType = this.dataset.style;
    if (this.checked) {
      if (stylerType === "bold") {
        previewText.style.fontWeight = "bold";
      } else if (stylerType === "underline") {
        previewText.classList.add("underlined");
      } else if (stylerType === "italic") {
        previewText.style.fontStyle = "italic";
      } else if (stylerType === "strikethrough") {
        previewText.classList.add("strike");
      } else if (stylerType === "obfuscation") {
        startObfuscation(previewText);
      }
    } else {
      if (stylerType === "bold") {
        previewText.style.fontWeight = "unset";
      } else if (stylerType === "underline") {
        previewText.classList.remove("underlined");
      } else if (stylerType === "italic") {
        previewText.style.fontStyle = "unset";
      } else if (stylerType === "strikethrough") {
        previewText.classList.remove("strike");
      } else if (stylerType === "obfuscation") {
        stopObfuscation(previewText);
      }
    }
    refreshOutput();
  });
});

// Copy on click for the results
document.getElementById('results').addEventListener("click", function() {
  const text = this.value;
  copyText(text);
});
