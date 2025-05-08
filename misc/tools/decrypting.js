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
  var resultsDiv2 = document.getElementById('resultsDiv')
  /*if (errorText.textContent === "") {
    errorDiv.style.display = "none"
  }*/
  errorDiv.style.display = "flex";
  errorText.textContent = message;
  if (errorText.innerText.trim() !== '') {
    resultsDiv2.style.display = "none"
  } else {
    errorDiv.style.display = "none"
    errorText.textContent = ""
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
  
  function decryptingText(name, text, key = 3) {
    
    let data = ""
    if (name === "Base64 (recommended)") {
      try {
        let data = atob(text); // Attempt to decode
      } catch (error) {
        if (error instanceof DOMException) {
          setError("Invalid Base64 input. Please enter a valid encoded text.");
          return; // Stop the function
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
    resultsDiv.style.display = "flex";
  }
  var resultsInput = document.getElementById('results');
  var resultsDiv = document.getElementById('resultsDiv')
  decryptingText(name, text);
  if (resultsInput.value.includes("�")) {
    setError('Something went wrong, did you enter a valid encrypted text?');
    return false;
  }
  const hasInvalidChars = /[\x00-\x1F]/.test(resultsInput.value);
  if (hasInvalidChars) {
    setError('Something went wrong, did you enter a valid encoded text ?');
    return false;
  }
});
document.addEventListener('DOMContentLoaded', function() {
  const togglecopy = document.getElementById('tcopy');
  var resultsInput = document.getElementById('results');
  
  togglecopy.addEventListener('click', function() {
    const copyText = resultsInput.value; // Get the latest value on click
    
    // Copy text to clipboard with error handling
    navigator.clipboard.writeText(copyText).then(() => {
      
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