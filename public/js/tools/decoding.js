import { setError, errorLoggerBEFORE, errorLoggerAFTER } from '../api/errorLogger.js';
import {} from '../api/copy.js';
import {} from '../api/dropDownMenu.js';
var resultsBtn = document.getElementById('results-btn');
resultsBtn.addEventListener('click', function() {
  const text = document.getElementById('ttc').value;
  var title = document.getElementById('dropdown-text');
  if (!errorLoggerBEFORE(name, text)) {
    return false;
  };
  
  let results;
  
  function decodingText(name, text) {
    if (name === "UTF-8") {
      function decodeUTF8(byteArray) {
        const decoder = new TextDecoder("utf-8"); // Create a UTF-8 decoder
        return decoder.decode(new Uint8Array(byteArray)); // Convert byte array to string
      }
      results = (decodeUTF8(text.split(/[\s,]+/).map(Number)));
    };
    if (name === "UTF-16") {
      function decodeUTF16(byteArray) {
        const decoder = new TextDecoder("utf-16"); // Create a UTF-16 decoder
        return decoder.decode(new Uint16Array(byteArray)); // Convert byte array to string
      }
      results = (decodeUTF16(text.split(/[\s,]+/).map(Number)));
    }
    if (name === "UTF-32") {
      function decodeUTF32(byteArray) {
        let decodedString = '';
        for (let i = 0; i < byteArray.length; i += 4) {
          // Combine 4 bytes into a single UTF-32 code point
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
        setError('Something went wrong, did you enter a valid encoded text?')
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
          // Convert each binary to a character
          .join(''); // Join the characters into a string
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
        const encodedTextiso = new Uint8Array(bytes); // Your existing encoded data
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
      results = (decodeFromMorse(text));
    }
    resultsInput.value = results;
    return;
  };
  var resultsInput = document.getElementById('results');
  var resultsDiv = document.getElementById('resultsDiv')
  
  decodingText(name, text);
  var decodedtext = document.getElementById('results').value;
  if (!errorLoggerAFTER(decodedtext)) {
    return;
  };
  resultsDiv.style.display = "flex";
})