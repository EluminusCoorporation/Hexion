//Gets the required functions from other files
import {
  setAlert,
  errorLogger
} from "../handlers/errorLogger.js";
import {} from "../handlers/copy.js";
import {} from "../handlers/dropDownMenu.js";

const resultsBtn = document.getElementById("results-btn");

//Makes an event listener for the results button
resultsBtn.addEventListener("click", function () {
  //Gets the text inputed
  const text = document.getElementById("inputContainer").value;
  //Gets the type selected
  const name = document.getElementById("dropdownSelected").dataset.selected;
  // Run errorhandler
  if (!name || !text) {
    setAlert('error', 'Decoder failed', 'Please fill in all the fields.')
    return;
  };

  let results;
  //Circulates through the types
  if (name === "UTF-8") {
    const decoder = new TextDecoder("utf-8");
    results = decoder.decode(new Uint8Array(text.split(/[\s,]+/).map(Number)));
  } else if (name === "UTF-16") {
    const decoder = new TextDecoder("utf-16");
    results = decoder.decode(new Uint16Array(text.split(/[\s,]+/).map(Number)));
  } else if (name === "UTF-32") {
    const byteArray = text.split(/[\s,]+/).map(Number);
    let decodedString = "";
    for (let i = 0; i < byteArray.length; i += 4) {
      let codePoint =
        (byteArray[i] << 24) |
        (byteArray[i + 1] << 16) |
        (byteArray[i + 2] << 8) |
        byteArray[i + 3];
      decodedString += String.fromCodePoint(codePoint);
    }
    results = decodedString;
  } else if (name === "Base 64") {
    const resultedText = atob(text);
    const hasInvalidChars2 = /\d/.test(resultedText);
    if (hasInvalidChars2) {
      setAlert(
        "error",
        "Proces failed",
        "Something went wrong, did you enter a valid encoded text?"
      );
      return false;
    }
    results = resultedText;
  } else if (name === "ASCII") {
    results = text.split(/[\s,]+/).map(Number).map(code => String.fromCharCode(code)).join("");
  } else if (name === "EXTENDED ASCII") {
    results = text.split(/[\s,]+/).map(Number).map(code => String.fromCharCode(code)).join("");
  } else if (name === "Binary") {
    results = text
        .split(/[\s,]+/)
        .map(bin => String.fromCharCode(parseInt(bin, 2)))
        .join("");
  } else if (name === "Shift Jis") {
    const decoder = new TextDecoder("shift-jis");
    results = text.split(/[\s,]+/).map(Number).decode(new Uint8Array(byteArray));
  } else if (name === "ISO 8859-1") {
    const encodedTextiso = new Uint8Array(text.split(/[\s,]+/).map(Number));
    const finalTextiso = encodedTextiso.buffer;
    results = new TextDecoder("iso-8859-1").decode(finalTextiso);
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

    const reverseMorseCodeMap = Object.fromEntries(Object.entries(morseCodeMap).map(([k, v]) => [v, k]));
     results = text
      .split(/[\s,]+/)
      .map(code => reverseMorseCodeMap[text] || "")
      .join("");
  }
  

  const resultsInput = document.getElementById("results");
  const resultsDiv = document.getElementById("resultsContainer");

  //Displays the result
  resultsInput.textContent = results;
  
  //runs the error handler
  if (!errorLogger(resultsInput.value)) {
    resultsDiv.style.display = "none";
    return;
  };

  //Enables the result output display
  resultsDiv.style.display = "flex";
});
