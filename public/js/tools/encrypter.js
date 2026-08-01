//Imports required functions
import { setAlert } from "../handlers/errorLogger.js";
import {} from "../handlers/dropDownMenu.js";
import {} from "../handlers/copy.js";
const resultsBtn = document.getElementById("results-btn");

//Makes an event listener for results button
resultsBtn.addEventListener("click", function () {
  //Gets the text inputted
  const text = document.getElementById("inputContainer").value;
  //Gets the format type
  const name = document.getElementById("dropdownSelected").dataset.selected;

  // Runs the error handler
  if (!name || !text) {
    setAlert('error', 'Encrypter failed', 'Please fill in all the fields.');
    return;
  };

  let results;

  if (name === "Base85") {
    const bytes = new TextEncoder().encode(text);
    let padding = (4 - (bytes.length % 4)) % 4;
    const padded = new Uint8Array([...bytes, ...new Array(padding).fill(0)]);

    let output = "";
    for (let i = 0; i < padded.length; i += 4) {
      const chunk =
        (padded[i] << 24) |
        (padded[i + 1] << 16) |
        (padded[i + 2] << 8) |
        padded[i + 3];
      if (chunk === 0) {
        output += "z";
      } else {
        let encodedChunk = "";
        let value = chunk;
        for (let j = 0; j < 5; j++) {
          encodedChunk = String.fromCharCode((value % 85) + 33) + encodedChunk;
          value = Math.floor(value / 85);
        }
        output += encodedChunk;
      }
      if (padding > 0) output = output.slice(0, -(4 - padding));

      results = `<~${output}~>`;
    }
  } else if (name === "ROT13") {
    results = text.replace(/[A-Za-z]/g, function (c) {
      return String.fromCharCode(
        c.charCodeAt(0) + (c.toUpperCase() <= "M" ? 13 : -13)
      );
    });
  } else if (name === "Caesar Cipher") {
    results = text.replace(/[A-Za-z]/g, function (c) {
      let code = c.charCodeAt(0);
      let shift = 3 % 26;
      return String.fromCharCode(
        code >= 65 && code <= 90
          ? ((code - 65 + shift) % 26) + 65
          : code >= 97 && code <= 122
          ? ((code - 97 + shift) % 26) + 97
          : code
      );
    });
  } else if (name === "Atbash Cipher") {
    results = text.replace(/[A-Za-z]/g, function (c) {
      return String.fromCharCode(
        c <= "Z" ? 90 - (c.charCodeAt(0) - 65) : 122 - (c.charCodeAt(0) - 97)
      );
    });
  } else if (name === "Morse Code") {
    let morseMap = {
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
      " ": "/"
    };
    results = text
      .toUpperCase()
      .split("")
      .map(c => morseMap[c] || c)
      .join(" ");
  } else if (name === "Binary Encoding") {
    results = text
      .split("")
      .map(c => c.charCodeAt(0).toString(2))
      .join(" ");
  } else if (name === "Hexadecimal Encoding") {
    results = text
      .split("")
      .map(c => c.charCodeAt(0).toString(16))
      .join(" ");
  } else if (name === "Rail Fence Cipher") {
    let rails = Array.from({ length: 3 }, () => []);
    let row = 0,
      direction = 1;
    text.split("").forEach(c => {
      rails[row].push(c);
      if (row === 0) direction = 1;
      if (row === 3 - 1) direction = -1;
      row += direction;
    });
    results = rails.flat().join("");
  } else if (name === "Vigenère Cipher") {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    newText = text.toUpperCase();
    key = "KEY";
    key = key
      .toUpperCase()
      .repeat(Math.ceil(newText.length / key.length))
      .slice(0, newText.length);
    results = newText
      .split("")
      .map((c, i) =>
        alphabet.includes(c)
          ? alphabet[(alphabet.indexOf(c) + alphabet.indexOf(key[i])) % 26]
          : c
      )
      .join("");
  } else if (name === "Affine Cipher") {
    let a = 5,
      b = 8;
    results = text
      .split("")
      .map(c =>
        c.match(/[A-Za-z]/)
          ? String.fromCharCode(
              ((a * (c.toUpperCase().charCodeAt(0) - 65) + b) % 26) + 65
            )
          : c
      )
      .join("");
  }

  const resultsInput = document.getElementById("results");
  const resultsDiv = document.getElementById("resultsContainer");

  //Sets the value
  resultsInput.textContent = results;

  //Displays the output
  resultsDiv.style.display = "flex";
});
