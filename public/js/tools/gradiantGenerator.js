import { setError, errorLoggerBEFORE } from '../api/errorLogger.js';
import {} from '../api/dropDownMenu.js'
import {} from '../api/copy.js'

let timeout;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#copyIcon').forEach((button, i) => {
    
    button.addEventListener('click', function() {
      const text = this.nextElementSibling.textContent;
      // Copy text to clipboard with error handling
      navigator.clipboard.writeText(text).then(() => {
        
        // Toggle the icon
        this.classList.remove('bx-copy');
        this.classList.add('bx-check');
        
        clearTimeout(timeout)
        
        // Setting up timeout
        timeout = setTimeout(() => {
          this.classList.remove('bx-check');
          this.classList.add('bx-copy');
        }, 3000);
      }).catch(err => {
        setError("Failed to copy text!");
        console.log(err) // log the error if copy fails
      });
      var copyAlertContainer = document.getElementById('copyAlertContainer')
      copyAlertContainer.classList.add("active")
      setTimeout(() => {
        copyAlertContainer.classList.remove("active")
      }, 3000);
    });
  });
});

var colorDropdownmenu = document.getElementById('colorDropdownmenu');

colorDropdownmenu.addEventListener('click', () => {
  var colorDropdownmenuIcon = document.getElementById('colorDropdownmenuIcon');
  var colorsGridContainer = document.getElementById('colorsGridContainer');
  colorDropdownmenuIcon.classList.toggle('active');
  colorsGridContainer.classList.toggle('show');
})

function createPickr(el, color) {
    const colorNameContainer = el.nextElementSibling
    var colorName = colorNameContainer.querySelector('.color-name')
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
    pickr.on('save', (color, instance) => {
      const colorHex = color.toHEXA().toString()
      colorName.textContent = colorHex
      colorName.style.color = colorHex
    })
}

document.querySelectorAll('.color-preview').forEach((el, i) => {
  createPickr(el, "#00FF7F")
})

var addColorButton = document.getElementById('addColorButton');
addColorButton.addEventListener('click', () => {
  const colorsContainer = document.getElementById('colorsContainer');
  const colorContainer = document.getElementById('colorContainer');
  var clonedContainer = colorContainer.cloneNode(true);
  var clonedColorName = clonedContainer.querySelector('.color-name')
  const el = clonedContainer.querySelector('.pickr');
  var childIcon = document.createElement('i')
  
  const colorContainerLength = colorsContainer.querySelectorAll('.color-container').length;
  
  if (colorContainerLength === 15) {
    setError('Too many colors')
    return;
  }
  
  clonedContainer.id = '';
  if (clonedColorName.style.color != "#000000") {
    clonedColorName.textContent = "#000000";
    clonedColorName.style.color = "#000000"
  }
  childIcon.classList.add('bx', 'bx-trash', 'delete-icon');
  
  clonedContainer.appendChild(childIcon);
  
  createPickr(el, "#000000")
  
  colorsContainer.appendChild(clonedContainer);
});

function updateQuery() {
  document.querySelectorAll('.delete-icon').forEach((icon, i) => {
    icon.addEventListener('click', () => {
      const container = icon.parentNode;
      container.remove();
    })
  })
}

updateQuery()

const observer = new MutationObserver(() => {
  updateQuery()
})

const colorsContainer = document.getElementById("colorsContainer");
observer.observe(colorsContainer, { childList: true })

var resultsBtn = document.getElementById('results-btn');

var inputText = document.getElementById('inputText')
inputText.addEventListener('input', (event) => {
  const text = event.target.value;
  var previewText = document.getElementById('previewText')
  previewText.textContent = text
})

resultsBtn.addEventListener('click', function() {
  const text = document.getElementById('inputText').value;
  var title = document.getElementById('dropdown-text');
  if (!errorLoggerBEFORE(name, text)) {
    return;
  };
  
  function encodingText(name, text) {
    if (name === "UTF-8") {
      let encoder = new TextEncoder();
      var encodedtext = encoder.encode(text);
    };
    if (name === "UTF-16") {
      function encodeUTF16(str) {
        let encoder = new TextEncoder('utf-16le'); // Little-endian UTF-16
        return encoder.encode(str);
      }
      
      var encodedtext = encodeUTF16(text);
    }
    if (name === "UTF-32") {
      function encodeUTF32(str) {
        let utf32Array = [];
        
        for (let char of str) {
          let codePoint = char.codePointAt(0); // Get Unicode code point
          utf32Array.push(
            (codePoint >> 24) & 0xFF, // First byte
            (codePoint >> 16) & 0xFF, // Second byte
            (codePoint >> 8) & 0xFF, // Third byte
            codePoint & 0xFF // Fourth byte
          );
        }
        
        return new Uint8Array(utf32Array);
      }
      
      var encodedtext = encodeUTF32(text);
    }
    if (name === "Base 64") {
      var encodedtext = btoa(text);
    }
    if (name === "ASCII") {
      function encodeASCII(text) {
        return text.split('').map(char => char.charCodeAt(0)); // Convert each character to ASCII code
      }
      
      var encodedtext = encodeASCII(text);
    }
    if (name === "EXTENDED ASCII") {
      function encodeExtendedASCII(text) {
        return text.split('').map(char => char.charCodeAt(0)); // Same as ASCII but supports 0–255 range
      }
      
      function decodeExtendedASCII(asciiArray) {
        return asciiArray.map(code => String.fromCharCode(code)).join('');
      }
      var encodedtext = encodeExtendedASCII(text);
    }
    if (name === "Binary") {
      function encodeBinary(text) {
        return text.split('')
          .map(char => char.charCodeAt(0).toString(2).padStart(8, '0')) // Convert to binary (8-bit)
          .join(' '); // Separate binary values with a space
      }
      
      var encodedtext = encodeBinary(text);
    }
    
    if (name === "Shift Jis") {
      function encodeToShiftJIS(text) {
        const encoder = new TextEncoder("shift-jis");
        return encoder.encode(text);
      }
      
      var encodedtext = encodeToShiftJIS(text);
    }
    
    if (name === "ISO 8859-1") {
      // Encode a string to ISO-8859-1
      function encodeToISO88591(text) {
        return new TextEncoder("iso-8859-1").encode(text);
      }
      var encodedtext = encodeToISO88591(text);
    }
    
    if (name === "Morse Code") {
      const morseCodeMap = {
        "A": ".-",
        "B": "-...",
        "C": "-.-.",
        "D": "-..",
        "E": ".",
        "F": "..-.",
        "G": "--.",
        "H": "....",
        "I": "..",
        "J": ".---",
        "K": "-.-",
        "L": ".-..",
        "M": "--",
        "N": "-.",
        "O": "---",
        "P": ".--.",
        "Q": "--.-",
        "R": ".-.",
        "S": "...",
        "T": "-",
        "U": "..-",
        "V": "...-",
        "W": ".--",
        "X": "-..-",
        "Y": "-.--",
        "Z": "--..",
        "0": "-----",
        "1": ".----",
        "2": "..---",
        "3": "...--",
        "4": "....-",
        "5": ".....",
        "6": "-....",
        "7": "--...",
        "8": "---..",
        "9": "----.",
        " ": "/" // Space separator
      };
      
      const reverseMorseCodeMap = Object.fromEntries(Object.entries(morseCodeMap).map(([k, v]) => [v, k]));
      
      function encodeToMorse(text) {
        return text.toUpperCase().split('').map(char => morseCodeMap[char] || "").join(' ');
      }
      encodedtext = (encodeToMorse(text))
    }
    resultsInput.value = encodedtext;
    return;
  };
  var resultsInput = document.getElementById('results');
  var resultsDiv = document.getElementById('resultsDiv')
  resultsDiv.style.display = "flex";
  encodingText(name, text);
});