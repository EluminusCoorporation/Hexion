import { setError, errorLoggerBEFORE, errorLoggerAFTER } from '../api/errorLogger.js';
import {} from '../api/sliderbtn.js'
import {} from '../api/copy.js'
var resultsBtn = document.getElementById('results-btn');

resultsBtn.addEventListener('click', function() {
  const text = document.getElementById('ttc').value;
  var title = document.getElementById('dropdown-text');
  if (!errorLoggerBEFORE(name, text)) {
    return
  };
  
  function decryptingText(name, text, key = 3) {
    
    let data = ""
    if (name === "Base64 (recommended)") {
      try {
        let data = atob(text); // Attempt to decode
      } catch (error) {
        if (error) {
          console.log(error)
        } else {
          setError("An unexpected error occurred.");
          return; // Also stop on unknown errors
        }
      }
    };
    
    if (name === "ROT13") {
      data = text.replace(/[A-Za-z]/g, function(c) {
        return String.fromCharCode(c.charCodeAt(0) + (c.toUpperCase() <= 'M' ? 13 : -13));
      });
    };
    
    if (name === "Caesar Cipher") {
      data = text.replace(/[A-Za-z]/g, function(c) {
        let code = c.charCodeAt(0);
        let shift = key % 26;
        return String.fromCharCode(
          (code >= 65 && code <= 90) ? ((code - 65 - shift + 26) % 26 + 65) :
          (code >= 97 && code <= 122) ? ((code - 97 - shift + 26) % 26 + 97) : code
        );
      });
    };
    
    if (name === "Atbash Cipher") {
      data = text.replace(/[A-Za-z]/g, function(c) {
        return String.fromCharCode(
          c <= 'Z' ? (90 - (c.charCodeAt(0) - 65)) : (122 - (c.charCodeAt(0) - 97))
        );
      });
    };
    
    if (name === "Morse Code") {
      let morseMap = {
        '.-': 'A',
        '-...': 'B',
        '-.-.': 'C',
        '-..': 'D',
        '.': 'E',
        '..-.': 'F',
        '--.': 'G',
        '....': 'H',
        '..': 'I',
        '.---': 'J',
        '-.-': 'K',
        '.-..': 'L',
        '--': 'M',
        '-.': 'N',
        '---': 'O',
        '.--.': 'P',
        '--.-': 'Q',
        '.-.': 'R',
        '...': 'S',
        '-': 'T',
        '..-': 'U',
        '...-': 'V',
        '.--': 'W',
        '-..-': 'X',
        '-.--': 'Y',
        '--..': 'Z',
        '/': ' '
      };
      data = text.split(" ").map(c => morseMap[c] || c).join("");
    };
    
    if (name === "Binary Encoding") {
      data = text.split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join("");
    };
    
    if (name === "Hexadecimal Encoding") {
      data = text.split(" ").map(h => String.fromCharCode(parseInt(h, 16))).join("");
    };
    
    if (name === "Rail Fence Cipher") {
      let rails = 3
      let rail = new Array(rails).fill("").map(() => new Array(text.length).fill("\n"));
      
      let directionDown = false;
      let row = 0,
        col = 0;
      
      for (let i = 0; i < text.length; i++) {
        if (row === 0 || row === rails - 1) directionDown = !directionDown;
        rail[row][col++] = "*"; // Mark the path
        row += directionDown ? 1 : -1;
      }
      
      let index = 0;
      for (let i = 0; i < rails; i++) {
        for (let j = 0; j < text.length; j++) {
          if (rail[i][j] === "*" && index < text.length) {
            rail[i][j] = text[index++];
          }
        }
      }
      
      row = 0, col = 0;
      directionDown = false;
      for (let i = 0; i < text.length; i++) {
        if (row === 0 || row === rails - 1) directionDown = !directionDown;
        data += rail[row][col++];
        row += directionDown ? 1 : -1;
      }
      
    };
    if (name === "Vigenère Cipher") {
      function decryptVigenereCipher(text, key) {
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        text = text.toUpperCase();
        key = key.toUpperCase().repeat(Math.ceil(text.length / key.length)).slice(0, text.length);
        
        let decryptedText = text.split("").map((c, i) =>
          alphabet.includes(c) ?
          alphabet[(alphabet.indexOf(c) - alphabet.indexOf(key[i]) + 26) % 26] // Reverse the shift
          :
          c
        ).join("");
        
        return decryptedText;
      }
      
      data = (decryptVigenereCipher(text, "KEY"));
    }
    
    if (name === "Affine Cipher") {
      let a = 5,
        b = 8;
      let modInverse = 21;
      data = text.split("").map(c =>
        c.match(/[A-Za-z]/) ?
        String.fromCharCode((((modInverse * (c.toUpperCase().charCodeAt(0) - 65 - b + 26)) % 26) + 65)) : c
      ).join("");
    };
    resultsInput.value = data;
  }
  var resultsInput = document.getElementById('results');
  var resultsDiv = document.getElementById('resultsDiv')
  decryptingText(name, text);
  var decryptedText = document.getElementById('results').value;
  if (!errorLoggerAFTER(decryptedText)) {
    return false;
  };
  console.log('hh')
  resultsDiv.style.display = "flex"; 
});