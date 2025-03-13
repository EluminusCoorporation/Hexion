var dropDownMenu = document.getElementById("dropDownMenu");
var dropDownCon = document.getElementById('dropDownCon');
var dropDownIcon = document.getElementById('ddIcon');
var selectItem = document.getElementsByClassName('select-item');
var resultsBtn = document.getElementById('results-btn');
var textEncode = document.getElementById('ttc')

function setError(message) {
  var errorText = document.getElementById('errorText');
  var errorDiv = document.getElementById('errorDiv');
  errorDiv.style.display = "flex";
  errorText.textContent = message;
  if (errorText.textContent === "") {
    errorDiv.style.display = "none"
  }
  setTimeout(function() {
    errorDiv.style.display = "none";
    errorText.textContent = ""
  }, 7000); // 2000ms = 2 seconds
}

dropDownMenu.addEventListener('click', function() {
  dropDownContent.classList.toggle("active");
  dropDownIcon.classList.toggle("active");
  var i;
  for (i = 0; i < selectItem.length; i++) {
    selectItem[i].addEventListener('click', function() {
      function setNameOfDD(message) {
        // Access the element by its ID
        var itemSelect = document.getElementById('dropdown-text');
        // Set the text content to the error message
        itemSelect.style.color = "black"
        itemSelect.textContent = message;
        return
      }
      name = this.textContent // Logs each <p> text content
      setNameOfDD(name);
      return
    });
  }
  //var body = document.getElementById('');
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
      function decodeUTF8(byteArray) {
        const decoder = new TextDecoder("utf-8"); // Create a UTF-8 decoder
        return decoder.decode(new Uint8Array(byteArray)); // Convert byte array to string
      }
      const byteArray = text.split(',').map(Number);
      resultsInput.value = (decodeUTF8(byteArray))
    };
    if (name === "UTF-16") {
      function decodeUTF16(byteArray) {
        const decoder = new TextDecoder("utf-16"); // Create a UTF-16 decoder
        return decoder.decode(new Uint8Array(byteArray)); // Convert byte array to string
      }
      const byteArray = text.split(',').map(Number);
      resultsInput.value = (decodeUTF16(byteArray)) // Uint8Array with UTF-16 bytes
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
      
      // Example UTF-32 encoded byte array for "Hello"
      
      const byteArray = text.split(',').map(Number);
      resultsInput.value = (decodeUTF32(byteArray))
    }
    if (name === "Base 64") {
      function decodeBase64(base64String) {
        return atob(base64String);
      }
      resultsInput.value = (decodeBase64(text))
    }
    if (name === "ASCII") {
      function decodeASCII(byteArray) {
        return byteArray.map(code => String.fromCharCode(code)).join('');
      }
      const byteArray = text.split(',').map(Number);
      resultsInput.value = (decodeASCII(byteArray)); // Output: "Hello"
    }
    if (name === "EXTENDED ASCII") {
      function decodeExtendedASCII(byteArray) {
        return byteArray.map(code => String.fromCharCode(code)).join('');
      }
      const byteArray = text.split(',').map(Number);
      console.log(decodeExtendedASCII(byteArray)); // Output: "éxñ"
      resultsInput.value = (decodeExtendedASCII(byteArray)); // Output: "éxñ"
    }
    if (name === "Binary") {
      function binaryToText(binaryStr) {
        return binaryStr.split(',') // Split binary by spaces
          .map(bin => String.fromCharCode(parseInt(bin, 2))) // Convert each binary to a character
          .join(''); // Join the characters into a string
      }
      resultsInput.value = (binaryToText(text)); // Output: "Hello"
    }
    
    if (name === "Shift Jis") {
      function decodeFromShiftJIS(byteArray) {
        const decoder = new TextDecoder("shift-jis");
        return decoder.decode(new Uint8Array(byteArray));
      }
      const byteArray = text.split(',').map(Number);
      const decodedShiftJIS = decodeFromShiftJIS(byteArray);
      resultsInput.value = decodedShiftJIS;
    }
    
    if (name === "ISO 8859-1") {
      function decodeFromISO88591(bytes) {
        const encodedTextiso = new Uint8Array(bytes); // Your existing encoded data
        const finalTextiso = encodedTextiso.buffer // Outputs: ArrayBuffer
        return new TextDecoder("iso-8859-1").decode(finalTextiso);
      }
      const byteArray = text.split(',').map(Number);
      resultsInput.value = (decodeFromISO88591(byteArray)); // "Hello, World!"
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
        return morseCode.split(' ').map(code => reverseMorseCodeMap[code] || "").join('');
      }
      
      // Example usage
      resultsInput.value = (decodeFromMorse(text));
    }
    
    return
  };
  var resultsInput = document.getElementById('results');
  var resultsDiv = document.getElementById('resultsDiv')
  resultsDiv.style.display = "flex";
  encodingText(name, text);
});

  const togglecopy = document.getElementById('tcopy');
  var resultsInput = document.getElementById('results');
  var copyText = resultsInput.value;
  togglecopy.addEventListener('click', function() {
    navigator.clipboard.writeText(copyText)
    // Toggle the eye icon
    this.classList.toggle('bx-copy'); // Show password icon
    this.classList.toggle('bx-check'); // Hide password icon
    setTimeout(function() {
      togglePassword.classList.toggle('bx-copy')
    }, 2000);
  });