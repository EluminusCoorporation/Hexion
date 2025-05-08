var dropDownMenu = document.getElementById("dropDownMenu");
var dropDownCon = document.getElementById('dropDownCon');
var dropDownIcon = document.getElementById('ddIcon');
var selectItem = document.getElementsByClassName('select-item');
var resultsBtn = document.getElementById('results-btn');
var textEncode = document.getElementById('ttc')

let errorTimeout;

function setError(message) {
  var errorText = document.getElementById('errorText');
  var errorDiv = document.getElementById('errorDiv');
  errorDiv.style.display = "flex";
  errorText.textContent = message;
  if (errorText.textContent === "") {
    errorDiv.style.display = "none"
  }
  clearTimeout(errorTimeout);
  
  // Start a new timeout
  errorTimeout = setTimeout(() => {
    errorDiv.style.display = 'none';
    errorText.textContent = '';
  }, 7000);
}

dropDownMenu.addEventListener('click', function() {
  dropDownContent.classList.toggle("active");
  dropDownIcon.classList.toggle("active");
  var i;
  for (i = 0; i < selectItem.length; i++) {
    selectItem[i].addEventListener('click', function() {
      name = this.textContent // Logs each <p> text content
      var itemSelect = document.getElementById('dropdown-text');
      // Set the text content to the error message
      itemSelect.style.color = "black"
      itemSelect.textContent = name;
      return
    });
  }
  if (dropDownMenu.style.maxHeight === "500px") {
    dropDownMenu.style.maxHeight = "14px";
  }
  else {
    dropDownMenu.style.maxHeight = "500px"
  }
});
resultsBtn.addEventListener('click', function() {
  function errorLogger(name, text) {
    if (name === "") {
      setError('Please select a encoding language')
      return false;
    }
    if (text === "") {
      setError('Text cannot be empty!');
      return false;
    }
    setError('')
    return true;
  }
  const text = document.getElementById('ttc').value;
  var title = document.getElementById('dropdown-text');
  if (!errorLogger(name, text)) {
    return
  };
  
  function encodingText(name, text) {
    if (name === "UTF-8 (recommended)") {
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

document.addEventListener('DOMContentLoaded', function() {
  const togglecopy = document.getElementById('tcopy');
  var resultsInput = document.getElementById('results');
  
  togglecopy.addEventListener('click', function() {
    const copyText = resultsInput.value; // Get the latest value on click
    
    // Copy text to clipboard with error handling
    navigator.clipboard.writeText(copyText).then(() => {
      console.log("Copied:", copyText);
      
      // Toggle the icon
      this.classList.toggle('bx-copy');
      this.classList.toggle('bx-check');
      
      // Store reference to button for setTimeout
      const btn = this;
      setTimeout(() => {
        btn.classList.remove('bx-check');
        btn.classList.add('bx-copy');
      }, 2000);
    }).catch(err => {
      console.error("Copy failed:", err);
      setError("Failed to copy text!"); // Show an alert if copy fails
    });
  });
});