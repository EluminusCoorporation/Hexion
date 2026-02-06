//Imports the required functions
import { setStatus, errorLoggerBEFORE } from '../utils/errorLogger.js';
import { setFunction } from '../utils/dropDownMenu.js'
import {} from '../utils/copy.js'

let timeout;

document.addEventListener('DOMContentLoaded', () => {
  //event listener for each color
  const colorsContainer = document.getElementById('colorsContainer')
  colorsContainer.addEventListener('click', (event) => {
    //if its a copy button
    if (event.target.id === "copyIcon") {
      //copy texts
        const text = event.target.nextElementSibling.textContent;
        // Copy text to clipboard with error handling
        navigator.clipboard.writeText(text).then(() => {
          
          // Toggle the icon
          event.target.classList.remove('bx-copy');
          event.target.classList.add('bx-check');
          
          clearTimeout(timeout);
          
          // Setting up timeout
          timeout = setTimeout(() => {
            event.target.classList.remove('bx-check');
            event.target.classList.add('bx-copy');
          }, 3000);
        }).catch(err => {
          setStatus('error', 'Copy failed', "Failed to copy text!");
          console.log(err) // log the error if copy fails
        });
        //triggers the copy info alert
        const copyAlertContainer = document.getElementById('copyAlertContainer')
        copyAlertContainer.classList.add("active")
        setTimeout(() => {
          copyAlertContainer.classList.remove("active")
        }, 3000);
    }
  });
});

setFunction(refreshOutput);

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
    const type = document.getElementById("dropdown-text").dataset.selected;
    
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
    const stylerCheckBoxes = [...document.querySelectorAll('.styler-label input')]
    stylerCheckBoxes.forEach((checkbox) => {
      if (!checkbox.checked) return;
    
      const styleType = checkbox.dataset.style;
      styles[styleType] = true;
    });
  
    //Send the request to the backend
    const res = await fetch('/utils/gradient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, input, colors, styles, options })
    });
  
    // checks if response exists
    if (!res) throw new Error('No response from our internal server, try again later.');
  
    //check if res is ok
    if (!res.ok) {
      const errorMessage = ((await res.json()).message) || "An unknown error occured.";
      throw new Error(errorMessage);
    };
  
    const data = await res.json();

    results.textContent = data.output;
  } catch (error) {
    setStatus("error", "Gradient Generator Failed", error)
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
  const colorNameContainer = el.nextElementSibling
  const colorName = colorNameContainer.querySelector('.color-name')
  
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
    const colorHex = color.toHEXA().toString()
    //Adds the colors on the viewer interface
    colorName.textContent = colorHex
    colorName.style.color = colorHex
    updateGradient();
  })
  updateGradient();
}

//For each container create an pickr
document.querySelectorAll('.color-preview').forEach((el, i) => {
  createPickr(el, "#00FF7F")
})

function setUpMoverUp(el) {
  //Gets the parent node of the parentNode of this button
    const node = el.parentNode.parentNode;
    const previousSibling = node.previousElementSibling;
    const parent = node.parentNode;
    if (node === parent.firstElementChild) return;
      
    //Changes the position
    parent.insertBefore(node, previousSibling);
    //Reloads the gradient
    updateGradient();
}

function setUpMoverDown(el) {
  //Gets the parent node of the parentNode of this button
    const node = el.parentNode.parentNode;
    const nextSibling = node.nextElementSibling;
    if (nextSibling === null) return;
      
    const parent = node.parentNode;
    //Changes the position
    parent.insertBefore(node, nextSibling.nextElementSibling);
    //Reloads the gradient
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
  
  //does some adjustments in the copy
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
  createPickr(el, "#000000")
  
  //Reloads the movers
  const moveUp = clonedContainer.querySelector("#moveUp");
  const moveDown = clonedContainer.querySelector("#moveDown");

  moveUp.addEventListener("click", function() {
    setUpMoverUp(this);
  });
  
  moveDown.addEventListener("click", function() {
    setUpMoverDown(this);
  });
  
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
    container.remove();
    updateGradient()
  }
})

const resultsBtn = document.getElementById('results-btn');

const inputText = document.getElementById('inputText');
const previewText = document.getElementById('previewText');

//realtime input changer
inputText.addEventListener('input', (event) => {
  const text = event.target.value;
  
  previewText.dataset.text = text;
  previewText.textContent = text;
  
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
