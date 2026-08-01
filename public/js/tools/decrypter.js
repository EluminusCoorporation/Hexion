//Imports required functions
import {
  setAlert,
  errorLogger
} from "../handlers/errorLogger.js";
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
    setAlert('error', 'Decrypter failed', 'Please fill in all the fields.');
    return;
  };

  let results;

  if (name === "Base85") {
    let base85Str = text
      .replace(/^<~|~>$/g, "")
      .replace(/\s+/g, "")
      .replace(/z/g, "!!!!!");
    const padding = (5 - (base85Str.length % 5)) % 5;
    base85Str += "u".repeat(padding);

    const bytes = [];

    for (let i = 0; i < base85Str.length; i += 5) {
      const chunkStr = base85Str.slice(i, i + 5);
      let value = 0;
      for (let j = 0; j < 5; j++) {
        value = value * 85 + (chunkStr.charCodeAt(j) - 33);
      }

      bytes.push((value >> 24) & 0xff);
      bytes.push((value >> 16) & 0xff);
      bytes.push((value >> 8) & 0xff);
      bytes.push(value & 0xff);
    }

    const trimmed = bytes.slice(0, bytes.length - padding);
    results = new TextDecoder()
      .decode(new Uint8Array(trimmed))
      .replace(/[\x00-\x1F]/g, "");
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
          ? ((code - 65 - shift + 26) % 26) + 65
          : code >= 97 && code <= 122
          ? ((code - 97 - shift + 26) % 26) + 97
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
      .split(" ")
      .map(c => reverseMorseCodeMap[c] || c)
      .join("");
  }

  if (name === "Binary Encoding") {
    results = text
      .split(" ")
      .map(b => String.fromCharCode(parseInt(b, 2)))
      .join("");
  } else if (name === "Hexadecimal Encoding") {
    results = text
      .split(" ")
      .map(h => String.fromCharCode(parseInt(h, 16)))
      .join("");
  } else if (name === "Rail Fence Cipher") {
    let rails = 3;
    let rail = new Array(rails)
      .fill("")
      .map(() => new Array(text.length).fill("\n"));

    let directionDown = false;
    let row = 0,
      col = 0;

    for (let i = 0; i < text.length; i++) {
      if (row === 0 || row === rails - 1) directionDown = !directionDown;
      rail[row][col++] = "*";
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

    (row = 0), (col = 0);
    directionDown = false;
    for (let i = 0; i < text.length; i++) {
      if (row === 0 || row === rails - 1) directionDown = !directionDown;
      results += rail[row][col++];
      row += directionDown ? 1 : -1;
    }
  } else if (name === "Vigenère Cipher") {
    let key = "KEY";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const newText = text.toUpperCase();
    key = key
      .toUpperCase()
      .repeat(Math.ceil(newText.length / key.length))
      .slice(0, newText.length);

    let decryptedText = newText
      .split("")
      .map((c, i) =>
        alphabet.includes(c)
          ? alphabet[(alphabet.indexOf(c) - alphabet.indexOf(key[i]) + 26) % 26]
          : c
      )
      .join("");

    results = decryptedText;
  } else if (name === "Affine Cipher") {
    let b = 8;
    let modInverse = 21;
    results = text
      .split("")
      .map(c =>
        c.match(/[A-Za-z]/)
          ? String.fromCharCode(
              ((modInverse * (c.toUpperCase().charCodeAt(0) - 65 - b + 26)) %
                26) +
                65
            )
          : c
      )
      .join("");
  }

  const resultsInput = document.getElementById("results");
  const resultsDiv = document.getElementById("resultsContainer");

  //Sets the value
  resultsInput.textContent = results;

  //Run the error handler
  if (!errorLogger(resultsInput.value)) {
    resultsDiv.style.display = "none";
    return false;
  };
  
  //Displays the results output
  resultsDiv.style.display = "flex";
});
