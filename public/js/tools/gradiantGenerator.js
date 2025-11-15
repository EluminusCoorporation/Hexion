//Imports the required functions
import { setStatus, errorLoggerBEFORE } from '../api/errorLogger.js';
import {} from '../api/dropDownMenu.js'
import {} from '../api/copy.js'

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
          
          clearTimeout(timeout)
          
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

const colorDropdownmenu = document.getElementById('colorDropdownmenu');

//the dropdownmenu button for the colors
colorDropdownmenu.addEventListener('click', () => {
  const colorDropdownmenuIcon = document.getElementById('colorDropdownmenuIcon');
  const colorsGridContainer = document.getElementById('colorsGridContainer');
  
  //Enables the menu
  colorDropdownmenuIcon.classList.toggle('active');
  colorsGridContainer.classList.toggle('show');
})

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
  })
}

//For each container create an pickr
document.querySelectorAll('.color-preview').forEach((el, i) => {
  createPickr(el, "#00FF7F")
})

let errorTimeout;

const addColorButton = document.getElementById('addColorButton');
//add color button
addColorButton.addEventListener('click', () => {
  const colorsContainer = document.getElementById('colorsContainer');
  const colorContainer = document.getElementById('colorContainer');
  
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
  
  //adds the color
  colorsContainer.appendChild(clonedContainer);
});

const colorsContainer = document.getElementById('colorsContainer');

//if its delete icon
colorsContainer.addEventListener('click', (event) => {
  //deletes the color
  if (event.target.classList.contains('delete-icon')) {
    const container = event.target.parentNode;
    container.remove();
  }
})

const resultsBtn = document.getElementById('results-btn');

const inputText = document.getElementById('inputText');
//realtime input changer
inputText.addEventListener('input', (event) => {
  const text = event.target.value;
  const previewText = document.getElementById('previewText');
  previewText.textContent = text;
});

//results button event listener
resultsBtn.addEventListener('click', function() {
  //Gets the inputed 
  const text = document.getElementById('inputText').value;
  const title = document.getElementById('dropdown-text');
  if (!errorLoggerBEFORE(name, text)) {
    return;
  };
  
  function encodingText(name, text) {
    let results;
    
    resultsInput.textContent = results;
    return;
  };
  const resultsInput = document.getElementById('results');
  const resultsDiv = document.getElementById('resultsDiv')
  resultsDiv.style.display = "flex";
  encodingText(name, text);
});