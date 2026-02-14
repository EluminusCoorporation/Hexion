//Imports the required functions
import { setStatus, errorLoggerBEFORE,fileLogger } from "../utils/errorLogger.js";
import {} from "../utils/dropDownMenu.js";
import {} from "../utils/copy.js";

// Placeholder for image
let image = null;

const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileUploader');
// when user drags a file
uploadZone.addEventListener('dragover', (event) => {
  //prevents the default
  event.preventDefault();
  uploadZone.classList.add('drag-over');
});

// When user leaves the dragged file
uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-over');
});

function handleFile(file) {
  try {
    // Run file error handler
    if (!fileLogger(file)) return false;
    // checks if its an image
    if (!file.type.startsWith('image/')) throw new Error('The uploaded file is not an usable image.');
    
    // Sets file data
    document.getElementById('fileName').textContent = 'Reupload Image';
    
    // save the image
    image = file;
    
    // Sets the showcase image
    const imageShowcase = document.getElementById('imageShowcase');
    imageShowcase.src = URL.createObjectURL(file);
    imageShowcase.style.display = "flex";
    // Revoke the url after the image loads
    imageShowcase.onload = () => URL.revokeObjectURL(imageShowcase.src);
  } catch(error) {
    setStatus('error', 'Image Uploader Failed', error);
    console.log('An error occured while uploading the image: ' + error)
  }
}

// When user drops the dragged file
uploadZone.addEventListener('drop', (event) => {
  // Prevent default action
  event.preventDefault();
  uploadZone.classList.remove('drag-over');
  
  // handle the image
  handleFile(event.dataTransfer.files[0]);
});

//When uploads a file via click
fileInput.addEventListener('change', () => {
  // handle the image
  handleFile(fileInput.files[0]);
});

document.getElementById('imageShowcase').addEventListener("error", function() {
  this.style.display = "none";
});

const resultsBtn = document.getElementById("results-btn");

//Makes an event listener for results button
resultsBtn.addEventListener("click", function () {
  //Getd the text inputted
  const text = document.getElementById("inputContainer").value;
  //Gets the format type
  const name = document.getElementById("dropdownSelected").dataset.selected;

  //Runs the error handler
  if (!errorLoggerBEFORE(name, text)) {
    return;
  }
  let results;

  if (name === "UTF-8") {
    let encoder = new TextEncoder();
    results = encoder.encode(text);
  } else if (name === "UTF-16") {
    let encoder = new TextEncoder("utf-16le");
    results = encoder.encode(text);
  } else if (name === "UTF-32") {
    let utf32Array = [];

    for (let char of text) {
      let codePoint = char.codePointAt(0);
      utf32Array.push(
        (codePoint >> 24) & 0xff,
        (codePoint >> 16) & 0xff,
        (codePoint >> 8) & 0xff,
        codePoint & 0xff
      );
    }
    results = new Uint8Array(text);
  } else if (name === "Base 64") {
    results = btoa(text);
  } else if (name === "ASCII") {
    results = text.split("").map(char => char.charCodeAt(0));
  } else if (name === "EXTENDED ASCII") {
    results = text.split("").map(char => char.charCodeAt(0));
  } else if (name === "Binary") {
    results = text
      .split("")
      .map(char => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");
  } else if (name === "Shift Jis") {
    const encoder = new TextEncoder("shift-jis");
    results = encoder.encode(text);
  } else if (name === "ISO 8859-1") {
    results = new TextEncoder("iso-8859-1").encode(text);
  } else if (name === "Morse Code") {
    const morseCodeMap = {
      A: ".-",
      B: "-...",
      C: "-.-.",
      D: "-..",
      E: ".",
      F: "..-.",
      G: "--.",
      H: "....",
      I: "..",
      J: ".---",
      K: "-.-",
      L: ".-..",
      M: "--",
      N: "-.",
      O: "---",
      P: ".--.",
      Q: "--.-",
      R: ".-.",
      S: "...",
      T: "-",
      U: "..-",
      V: "...-",
      W: ".--",
      X: "-..-",
      Y: "-.--",
      Z: "--..",
      0: "-----",
      1: ".----",
      2: "..---",
      3: "...--",
      4: "....-",
      5: ".....",
      6: "-....",
      7: "--...",
      8: "---..",
      9: "----.",
      " ": "/" // Space separator
    };

    results = text
      .toUpperCase()
      .split("")
      .map(char => morseCodeMap[char] || "")
      .join(" ");
  }

  const resultsInput = document.getElementById("results");
  const resultsDiv = document.getElementById("resultsContainer");

  //Sets the value
  resultsInput.textContent = results;

  //Displays the output
  resultsDiv.style.display = "flex";
});
