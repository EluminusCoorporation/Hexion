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
      setError('Please select a decoding language')
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
  
  function decodingText(name, text) {
    if (name === "UTF-8 (recommended)") {
      function decodeUTF8(byteArray) {
        const decoder = new TextDecoder("utf-8"); // Create a UTF-8 decoder
        return decoder.decode(new Uint8Array(byteArray)); // Convert byte array to string
      }
      var decodedtext = (decodeUTF8(text.split(/[\s,]+/).map(Number)));
    };
    if (name === "UTF-16") {
      function decodeUTF16(byteArray) {
        const decoder = new TextDecoder("utf-16"); // Create a UTF-16 decoder
        return decoder.decode(new Uint16Array(byteArray)); // Convert byte array to string
      }
      var decodedtext = (decodeUTF16(text.split(/[\s,]+/).map(Number)));
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
      
      var decodedtext = (decodeUTF32(text.split(/[\s,]+/).map(Number)));
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
      var decodedtext = (decodeBase64(text))
    }
    if (name === "ASCII") {
      function decodeASCII(byteArray) {
        return byteArray.map(code => String.fromCharCode(code)).join('');
      }
      var decodedtext = (decodeASCII(text.split(/[\s,]+/).map(Number)));
    }
    if (name === "EXTENDED ASCII") {
      function decodeExtendedASCII(byteArray) {
        return byteArray.map(code => String.fromCharCode(code)).join('');
      }
      var decodedtext = (decodeExtendedASCII(text.split(/[\s,]+/).map(Numberc)));
    }
    if (name === "Binary") {
      function binaryToText(binaryStr) {
        return binaryStr.split(/[\s,]+/)
          .map(bin => String.fromCharCode(parseInt(bin, 2)))
          // Convert each binary to a character
          .join(''); // Join the characters into a string
      }
      var decodedtext = (binaryToText(text));
    }
    
    if (name === "Shift Jis") {
      function decodeFromShiftJIS(byteArray) {
        const decoder = new TextDecoder("shift-jis");
        return decoder.decode(new Uint8Array(byteArray));
      }
      var decodedtext = (decodeFromShiftJIS(text.split(/[\s,]+/).map(Number)));
    }
    
    if (name === "ISO 8859-1") {
      function decodeFromISO(bytes) {
        const encodedTextiso = new Uint8Array(bytes); // Your existing encoded data
        const finalTextiso = encodedTextiso.buffer;
        return new TextDecoder("iso-8859-1").decode(finalTextiso);
      }
      var decodedtext = (decodeFromISO(text.split(/[\s,]+/).map(Number)));
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
      decodedtext = (decodeFromMorse(text));
    }
    results.value = decodedtext;
    return;
  };
  var resultsInput = document.getElementById('results');
  var resultsDiv = document.getElementById('resultsDiv')
  decodingText(name, text);
  if (resultsInput.value.includes("�")) {
    setError('Something went wrong, did you enter a valid encoded text?');
    return false;
  }
  const hasInvalidChars = /[\x00-\x1F]/.test(resultsInput.value);
  if (hasInvalidChars) {
    setError('Something went wrong, did you enter a valid encoded text ?');
    return false;
  }
  resultsDiv.style.display = "flex";
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