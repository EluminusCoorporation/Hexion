import { setError, errorLoggerBEFORE, setErrorFile, fileLogger } from '../../api/errorLogger.js';
import {} from '../../api/copy.js'
import { formatFileSize } from '../../api/fileSizeFormat.js'
import { selectedExt } from '../../api/sliderbtn.js'
var resultsBtn = document.getElementById('results-btn');
const dBtn1 = document.getElementById('dbtn1');
const dBtn2 = document.getElementById('dbtn2');
const buttons = document.querySelectorAll('.dualbtn');
const uploadbtn = document.getElementById('uploadbtn');
const textinput = document.getElementById('textmodetxt')
const switcherContainer = document.getElementById('switcherContainer')
const btnindicator = document.getElementById('btnIndicator')
const uploadWrapper = document.getElementById('uploadWrapper')

buttons.forEach((btn, index) => {
  dBtn1.classList.add('selected')
  btn.addEventListener('click', () => {
    if (btn.classList.contains('selected')) return;
    btnindicator.style.left = index === 0 ? '0%' : '50%';
    buttons.forEach(b => b.classList.remove('selected'));
    if (index === 0) {
      switcherContainer.classList.toggle('selectedFunc')
      textinput.style.display = "none"
      uploadWrapper.style.display = "flex"
    }
    else {
      uploadWrapper.style.display = "none"
      textinput.style.display = "flex"
      switcherContainer.classList.toggle('selectedFunc')
    }
    btn.classList.add('selected');
  });
});

const uploadContainer = document.getElementById('uploadMenuC')
const container = document.getElementById('container')
const uploadMenu = document.getElementById('uploadMenu')

uploadbtn.addEventListener('click', function() {
  if (!selectedExt) {
    setError('Select a language before uploading.')
    return false;
  };
  setError('')
  uploadContainer.classList.add('active')
  document.body.classList.add('no-scroll');
  uploadMenu.classList.add('active')
})

const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('file');
// Click to open file dialog
uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const files = e.dataTransfer.files;
  const file = files[0]
  if (!fileLogger(files)) return false;
});

fileInput.addEventListener('change', () => {
  if (!fileLogger(fileInput.files)) return false;
  const file = fileInput.files[0]
  var fileNameLabel = document.getElementById('fileName');
  var fileIcon = document.getElementById('fileIcon');
  var uploadInfo = document.getElementById('uploadInfo')
  var uploadBarContainer = document.getElementById('uploadBarContainer');
  var uploadBar = document.getElementById('uploadingBar');
  var status = document.getElementById('status')
  const fileSize = formatFileSize(file.size)
  
  fileNameLabel.textContent = file.name;
  fileIcon.classList.remove('bx-arrow-from-to');
  fileIcon.classList.add('bx-file-code');
  uploadInfo.textContent = `0 / ${fileSize}`;
  uploadBarContainer.style.display = "flex";
  
  const formData = new FormData();
  formData.append('file', file);
  
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload');
  
  xhr.upload.addEventListener('progress', e => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      uploadBar.style.width = percent + '%';
    };
  });
  xhr.onload = () => {
    if (xhr.status === 200) {
      status.textContent = 'Uploaded';
    } else {
      status.textContent = 'Failed to upload' + xhr.responseText;
    }
  }
  
  xhr.onerror = () => {
    status.textContent = 'An error occurred'
  }
  
  xhr.send(formData)
});

let textareasHere = Array.from(document.querySelectorAll(".textarea-div > textarea"));
for (let i = 0; i < textareasHere.length; i++) {
  if (i != 0 && i % 2 == 1) {
    textareasHere[i].addEventListener("scroll", function(e) {
      textareasHere[i - 1].scrollTop = textareasHere[i].scrollTop;
      textareasHere[i - 1].scrollLeft = textareasHere[i].scrollLeft;
    });
    textareasHere[i].addEventListener("input", function(e) {
      textareasHere[i - 1].textContent = "";
      const numberOfLinesHere = Math.max(textareasHere[i].value.split("\n").length, 1);
      for (let h = 0; h < numberOfLinesHere; h++) {
        textareasHere[i - 1].textContent += (h + 1).toString() + "\n";
      }
      textareasHere[i - 1].setAttribute("cols", numberOfLinesHere.toString().length.toString());
    });
    const numberOfLinesHereZ = Math.max(textareasHere[i].value.split("\n").length, 1);
    for (let h = 0; h < numberOfLinesHereZ; h++) {
      textareasHere[i - 1].textContent += (h + 1).toString() + "\n";
    }
    textareasHere[i - 1].setAttribute("cols", numberOfLinesHereZ.toString().length.toString());
  }
}

resultsBtn.addEventListener('click', function() {
  if (!errorLoggerBEFORE(name, text)) {
    return
  };
  const text = document.getElementById('ttc').value;
  var title = document.getElementById('dropdown-text');
  if (!errorLogger(name, text)) {
    return
  };
  
  function encodingText(name, text) {
    if (name === "Python") {
      
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
    
    if (name === "Shift Jis") {
      function encodeToShiftJIS(text) {
        const encoder = new TextEncoder("shift-jis");
        return encoder.encode(text);
      }
      
      // Example usage
      const encodedShiftJIS = encodeToShiftJIS(text);
      resultsInput.value = encodedShiftJIS
    }
    
    if (name === "ISO 8859-1") {
      // Encode a string to ISO-8859-1
      function encodeToISO88591(text) {
        return new TextEncoder("iso-8859-1").encode(text);
      }
      let encodediso = encodeToISO88591(text);
      resultsInput.value = encodediso
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
      resultsInput.value = (encodeToMorse(text))
    }
    
    return
  };
  var resultsInput = document.getElementById('results');
  var resultsDiv = document.getElementById('resultsDiv')
  resultsDiv.style.display = "flex";
  encodingText(name, text);
});

const closeBtn = document.getElementById('close-btn');
closeBtn.addEventListener('click', () => {
  uploadContainer.classList.remove('active');
  uploadMenu.classList.remove('active');
  document.body.classList.remove('no-scroll');
})