//Imports the required functions
import { setStatus, errorLoggerBEFORE } from "../utils/errorLogger.js";
import {} from "../utils/dropDownMenu.js";
import {} from "../utils/copy.js";

const resultsBtn = document.getElementById("results-btn");

//Makes an event listener for results button
resultsBtn.addEventListener("click", function () {
  //Getd the text inputted
  const text = document.getElementById("ttc").value;
  //Gets the format type
  const name = document.getElementById("dropdown-text").dataset.selected;

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
  const resultsDiv = document.getElementById("resultsDiv");

  //Sets the value
  resultsInput.textContent = results;

  //Displays the output
  resultsDiv.style.display = "flex";
});
