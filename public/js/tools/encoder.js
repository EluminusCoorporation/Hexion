//Imports the required functions
import { setStatus, errorLoggerBEFORE } from '../api/errorLogger.js';
import {} from '../api/dropDownMenu.js'
import {} from '../api/copy.js'

const resultsBtn = document.getElementById('results-btn');

//Makes an event listener for results button
resultsBtn.addEventListener('click', function() {
  //Getd the text inputted
  const text = document.getElementById('ttc').value;
  //Gets the format type
  const title = document.getElementById('dropdown-text');
  
  //Runs the error handler
  if (!errorLoggerBEFORE(name, text)) {
    return;
  };
  
  //Sets up the encoder
  function encodingText(name, text) {
    let results;
    
    if (name === "UTF-8") {
      let encoder = new TextEncoder();
      results = encoder.encode(text);
    };
    if (name === "UTF-16") {
      function encodeUTF16(str) {
        let encoder = new TextEncoder('utf-16le');
        return encoder.encode(str);
      }
      
      results = encodeUTF16(text);
    }
    if (name === "UTF-32") {
      function encodeUTF32(str) {
        let utf32Array = [];
        
        for (let char of str) {
          let codePoint = char.codePointAt(0);
          utf32Array.push(
            (codePoint >> 24) & 0xFF,
            (codePoint >> 16) & 0xFF,
            (codePoint >> 8) & 0xFF,
            codePoint & 0xFF
          );
        }
        
        return new Uint8Array(utf32Array);
      }
      
      results = encodeUTF32(text);
    }
    if (name === "Base 64") {
      results = btoa(text);
    }
    if (name === "ASCII") {
      function encodeASCII(text) {
        return text.split('').map(char => char.charCodeAt(0));
      }
      
      results = encodeASCII(text);
    }
    if (name === "EXTENDED ASCII") {
      function encodeExtendedASCII(text) {
        return text.split('').map(char => char.charCodeAt(0));
      }
      results = encodeExtendedASCII(text);
    }
    if (name === "Binary") {
      function encodeBinary(text) {
        return text.split('')
          .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ');
      }
      
      results = encodeBinary(text);
    }
    
    if (name === "Shift Jis") {
      function encodeToShiftJIS(text) {
        const encoder = new TextEncoder("shift-jis");
        return encoder.encode(text);
      }
      
      results = encodeToShiftJIS(text);
    }
    
    if (name === "ISO 8859-1") {
      function encodeToISO88591(text) {
        return new TextEncoder("iso-8859-1").encode(text);
      }
      results = encodeToISO88591(text);
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
      
      function encodeToMorse(text) {
        return text.toUpperCase().split('').map(char => morseCodeMap[char] || "").join(' ');
      }
      results = (encodeToMorse(text))
    }
    //Sets the value
    resultsInput.textContent = results;
    return;
  };
  
  const resultsInput = document.getElementById('results');
  const resultsDiv = document.getElementById('resultsDiv');
  
  //Encodes the text
  encodingText(name, text);
  
  //Displays the output
  resultsDiv.style.display = "flex";
});