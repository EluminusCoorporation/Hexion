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
  
  
  function encryptingText(name, text, key = 3) {
    let data = ""
    if (name === "Base64 (recommended)") {
      data = btoa(text);
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
          (code >= 65 && code <= 90) ? ((code - 65 + shift) % 26 + 65) :
          (code >= 97 && code <= 122) ? ((code - 97 + shift) % 26 + 97) : code
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
        'A': '.-',
        'B': '-...',
        'C': '-.-.',
        'D': '-..',
        'E': '.',
        'F': '..-.',
        'G': '--.',
        'H': '....',
        'I': '..',
        'J': '.---',
        'K': '-.-',
        'L': '.-..',
        'M': '--',
        'N': '-.',
        'O': '---',
        'P': '.--.',
        'Q': '--.-',
        'R': '.-.',
        'S': '...',
        'T': '-',
        'U': '..-',
        'V': '...-',
        'W': '.--',
        'X': '-..-',
        'Y': '-.--',
        'Z': '--..',
        ' ': '/'
      };
      data = text.toUpperCase().split("").map(c => morseMap[c] || c).join(" ");
    };
    
    if (name === "Binary Encoding") {
      data = text.split("").map(c => c.charCodeAt(0).toString(2)).join(" ");
    };
    
    if (name === "Hexadecimal Encoding") {
      data = text.split("").map(c => c.charCodeAt(0).toString(16)).join(" ");
    };
    
    if (name === "Rail Fence Cipher") {
      let rails = Array.from({ length: key }, () => []);
      let row = 0,
        direction = 1;
      text.split("").forEach(c => {
        rails[row].push(c);
        if (row === 0) direction = 1;
        if (row === key - 1) direction = -1;
        row += direction;
      });
      data = rails.flat().join("");
    };
    
    if (name === "Vigenère Cipher") {
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      text = text.toUpperCase();
      key = "KEY"
      key = key.toUpperCase().repeat(Math.ceil(text.length / key.length)).slice(0, text.length);
      data = text.split("").map((c, i) =>
        alphabet.includes(c) ? alphabet[(alphabet.indexOf(c) + alphabet.indexOf(key[i])) % 26] : c
      ).join("");
    };
    
    if (name === "Affine Cipher") {
      let a = 5,
        b = 8;
      let modInverse = 21;
      data = text.split("").map(c =>
        c.match(/[A-Za-z]/) ?
        String.fromCharCode((((a * (c.toUpperCase().charCodeAt(0) - 65) + b) % 26) + 65)) : c
      ).join("");
    };
    resultsInput.value = data;
  }
  var resultsInput = document.getElementById('results');
  var resultsDiv = document.getElementById('resultsDiv')
  resultsDiv.style.display = "flex";
  encryptingText(name, text);
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