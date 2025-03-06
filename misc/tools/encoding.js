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
      let encoder = new TextEncoder();
      let data = encoder.encode(text);
      resultsInput.value = data
    };
    if (name === "UTF-16") {
      function encodeUTF16(str) {
        let encoder = new TextEncoder('utf-16le'); // Little-endian UTF-16
        return encoder.encode(str);
      }
      
      let utf16Encoded = encodeUTF16(text);
      resultsInput.value = utf16Encoded // Uint8Array with UTF-16 bytes
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
      
      let utf32Encoded = encodeUTF32(text);
      resultsInput.value = utf32Encoded // Uint8Array with UTF-32 bytes 
    }
    if (name === "Base 64") {
      let encodedText = btoa(text);
      resultsInput.value = encodedText
    }
    if (name === "ASCII") {
      function encodeASCII(text) {
        return text.split('').map(char => char.charCodeAt(0)); // Convert each character to ASCII code
      }
      
      // Example Usage:
      let encodedASCII = encodeASCII(text);
      resultsInput.value = encodedASCII // [72, 101, 108, 108, 111]
    }
    if (name === "EXTENDED ASCII") {
      function encodeExtendedASCII(text) {
        return text.split('').map(char => char.charCodeAt(0)); // Same as ASCII but supports 0–255 range
      }
      
      function decodeExtendedASCII(asciiArray) {
        return asciiArray.map(code => String.fromCharCode(code)).join('');
      }
      let extendedEncoded = encodeExtendedASCII(text);
      resultsInput.value = extendedEncoded
    }
    if (name === "Binary") {
      function encodeBinary(text) {
        return text.split('')
          .map(char => char.charCodeAt(0).toString(2).padStart(8, '0')) // Convert to binary (8-bit)
          .join(' '); // Separate binary values with a space
      }
      
      // Example Usage:
      let binaryEncoded = encodeBinary(text);
      resultsInput.value = binaryEncoded // "01001000 01101001"
      
    }
    if (name === "ISO 8859-1") {
      // Encode a string to ISO-8859-1
      function encodeToISO88591(text) {
        return new TextEncoder("iso-8859-1").encode(text);
      }
      let encodediso = encodeToISO88591(text);
      resultsInput.value = encodediso
    }
    return
  };
  var resultsInput = document.getElementById('results');
  var resultsDiv = document.getElementById('resultsDiv')
  resultsDiv.style.display = "flex";
  encodingText(name, text);
});

document.addEventListener('DOMContentLoaded', function() {
  const togglePassword = document.getElementById('tcopy');
  var resultsInput = document.getElementById('results');
  var copyText = resultsInput.value;
  togglePassword.addEventListener('click', function() {
    navigator.clipboard.writeText(copyText)
    // Toggle the eye icon
    this.classList.toggle('bx-copy'); // Show password icon
    this.classList.toggle('bx-check'); // Hide password icon
    setTimeout(function() {
      togglePassword.classList.toggle('bx-copy')
    }, 2000);
  });
});