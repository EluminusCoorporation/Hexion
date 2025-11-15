//Gets the required functions from other files
import { setStatus, errorLoggerBEFORE, errorLoggerAFTER } from '../api/errorLogger.js';
import {} from '../api/copy.js';
import {} from '../api/dropDownMenu.js';

const resultsBtn = document.getElementById('results-btn');

//Makes an event listener for the results button
resultsBtn.addEventListener('click', function() {
  //Gets the text inputed
  const text = document.getElementById('ttc').value;
  //Gets the type selected
  const title = document.getElementById('dropdown-text');
  //Rund errorhandler
  if (!errorLoggerBEFORE(name, text)) {
    return false;
  };
  
  //Sets up the decoding function
  function decodingText(name, text) {
    let results;
    
    //Circulates through the types
    if (name === "UTF-8") {
      function decodeUTF8(byteArray) {
        const decoder = new TextDecoder("utf-8");
        return decoder.decode(new Uint8Array(byteArray));
      }
      results = (decodeUTF8(text.split(/[\s,]+/).map(Number)));
    };
    if (name === "UTF-16") {
      function decodeUTF16(byteArray) {
        const decoder = new TextDecoder("utf-16");
        return decoder.decode(new Uint16Array(byteArray));
      }
      results = (decodeUTF16(text.split(/[\s,]+/).map(Number)));
    }
    if (name === "UTF-32") {
      function decodeUTF32(byteArray) {
        let decodedString = '';
        for (let i = 0; i < byteArray.length; i += 4) {
          let codePoint = (byteArray[i] << 24) | (byteArray[i + 1] << 16) |
            (byteArray[i + 2] << 8) | byteArray[i + 3];
          decodedString += String.fromCodePoint(codePoint);
        }
        return decodedString;
      }
      
      results = (decodeUTF32(text.split(/[\s,]+/).map(Number)));
    }
    if (name === "Base 64") {
      function decodeBase64(base64String) {
        return atob(base64String);
      }
      const hasInvalidChars2 = /\d/.test(decodeBase64(text));
      if (hasInvalidChars2) {
        setStatus('error', 'Proces failed', 'Something went wrong, did you enter a valid encoded text?')
        return false;
      }
      results = (decodeBase64(text))
    }
    if (name === "ASCII") {
      function decodeASCII(byteArray) {
        return byteArray.map(code => String.fromCharCode(code)).join('');
      }
      results = (decodeASCII(text.split(/[\s,]+/).map(Number)));
    }
    if (name === "EXTENDED ASCII") {
      function decodeExtendedASCII(byteArray) {
        return byteArray.map(code => String.fromCharCode(code)).join('');
      }
      results = (decodeExtendedASCII(text.split(/[\s,]+/).map(Numberc)));
    }
    if (name === "Binary") {
      function binaryToText(binaryStr) {
        return binaryStr.split(/[\s,]+/)
          .map(bin => String.fromCharCode(parseInt(bin, 2)))
          .join('');
      }
      results = (binaryToText(text));
    }
    
    if (name === "Shift Jis") {
      function decodeFromShiftJIS(byteArray) {
        const decoder = new TextDecoder("shift-jis");
        return decoder.decode(new Uint8Array(byteArray));
      }
      results = (decodeFromShiftJIS(text.split(/[\s,]+/).map(Number)));
    }
    
    if (name === "ISO 8859-1") {
      function decodeFromISO(bytes) {
        const encodedTextiso = new Uint8Array(bytes);
        const finalTextiso = encodedTextiso.buffer;
        return new TextDecoder("iso-8859-1").decode(finalTextiso);
      }
      results = (decodeFromISO(text.split(/[\s,]+/).map(Number)));
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
      
      function decodeFromMorse(morseCode) {
        return morseCode.split(/[\s,]+/).map(code => reverseMorseCodeMap[code] || "").join('');
      }
      //Sets the result
      results = (decodeFromMorse(text));
    }
    //Displays the result
    resultsInput.textContent = results;
    return;
  };
  
  const resultsInput = document.getElementById('results');
  const resultsDiv = document.getElementById('resultsDiv')
  
  //decodes the text
  decodingText(name, text);
  
  //runs the error handler
  if (!errorLoggerAFTER(resultsInput.value)) return;
  
  //Enables the result output display
  resultsDiv.style.display = "flex";
})