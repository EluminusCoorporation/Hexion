// Gets the required modules
const express = require("express");

// Debugger modules
const HTMLHint = require("htmlhint");
const stylelint = require("stylelint");
const { ESLint } = require("eslint");
const { spawnSync } = require("child_process");

// Gradient modules
const chroma = require("chroma-js");

// Request Sender modules
const axios = require("axios");

const router = express.Router();

// POST /api/debugger - Debugs the given code
router.post("/debugger", async (req, res) => {
  //Gets the json data sent from the frontend
  const { type, code } = req.body;

  //Creates an report var to store debugger results
  let report;

  try {
    //Searches for the type of debugger
    if (type === "Html") {
      //Config for the rule set being used by the module (refer to the module docs for the list)
      const config = {
        "alt-require": true,
        "attr-lowercase": true,
        "attr-no-duplication": true,
        "attr-value-double-quotes": false,
        "button-type-require": true,
        "doctype-first": false,
        "doctype-html5": true,
        "frame-title-require": true,
        "h1-require": true,
        "html-lang-require": false,
        "id-unique": true,
        "main-require": true,
        "meta-charset-require": true,
        "meta-description-require": true,
        "meta-viewport-require": true,
        "spec-char-escape": true,
        "src-not-empty": true,
        "tag-no-obsolete": true,
        "tag-pair": true,
        "tagname-lowercase": true,
        "title-require": false
      };
      //Stores the results in the provided var
      report = HTMLHint.HTMLHint.verify(code, config);
    } else if (type === "Css") {
      report = await stylelint.lint({
        code: code,
        //Extended ruleset support
        config: { extends: "stylelint-config-standard" }
      });
    } else if (type === "Java Script") {
      const eslint = new ESLint({
        //Sets this as the config
        overrideConfigFile: true,
        overrideConfig: {
          //Some custon rules
          rules: {
            //If no semi colon error
            semi: ["error", "always"],
            //If wrong usage of quotes warn
            quotes: ["warn", "single"]
          }
        }
      });
      report = await eslint.lintText(code);
    } else if (type === "Python") {
      //Sets up ruff for debugging
      const process = spawnSync("python3", ["-m", "flake8", "-"], {
        input: code,
        encoding: "utf-8"
      });
      //Checks for errors
      if (process.status !== 0) report = process.stdout.toString();
    } else {
      //If language type is invalid throw error
      throw new Error("Invalid language type selected.")
    }
    //Else send the report to the frontend
    res.json({ success: true, report: report });
  } catch (error) {
    //If any unexpected errors found report them
    console.error(error)
    res.json({ success: false, report: error });
  }
});

function getStylers(options) {
  // Styler formats
  const stylerFormats = {
    bold: "&l",
    underline: "&n",
    italic: "&o",
    strikethrough: "&m",
    obfuscation: "&k"
  };

  //stylers will be set here
  let stylers = "";

  // get the stylers that are selected
  const trueOptions = Object.keys(options).filter(key => options[key] === true);

  // apply the stylers
  trueOptions.forEach(option => (stylers += stylerFormats[option]));

  //return the stylers
  return stylers;
}

// helper function to convert hex to rgb
function hexToRgb(hex) {
  // remove #
  hex = hex.replace("#", "");
  // convert to hex
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

// helper function to distribute ketters evenly
function splitText(length, segments) {
  const base = Math.floor(length / segments);
  const remainder = length % segments;

  return Array.from({ length: segments }, (_, i) =>
    base + (i < remainder ? 1 : 0)
  );
}

// helper function to distribute colors evenly
function interpolate(start, end, steps) {
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return [
      Math.round(start[0] + (end[0] - start[0]) * t),
      Math.round(start[1] + (end[1] - start[1]) * t),
      Math.round(start[2] + (end[2] - start[2]) * t),
    ];
  });
}

// helper functio to fix light levels in colors
function colorDistance([r, g, b], [cr, cg, cb]) {
  return (
    0.3 * (r - cr) ** 2 +
    0.59 * (g - cg) ** 2 +
    0.11 * (b - cb) ** 2
  );
}

// helper function to get the closest mc variants
function closestKMcColors(colorPallete, rgb, k = 3) {
  return Object.entries(colorPallete)
    .map(([code, mcRgb]) => ({
      code,
      distance: colorDistance(rgb, mcRgb),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
}

// helper function to fix color weights
function normalizeWeights(colors) {
  const total = colors.reduce(
    (sum, c) => sum + 1 / (c.distance + 1),
    0
  );

  return colors.map(c => ({
    code: c.code,
    weight: (1 / (c.distance + 1)) / total,
  }));
}

// helper function to distribute the correctcolor weight
function selectWeightedColor(weights, index) {
  let acc = 0;
  const t = (index % 100) / 100;

  for (const w of weights) {
    acc += w.weight;
    if (t <= acc) return w.code;
  }

  return weights[0].code;
}

// helper function to create the gradient
function multiStopGradient(
  colorPallete,
  text,
  hexStops,
  k = 3
) {
  const segments = hexStops.length - 1;
  const distribution = splitText(text.length, segments);

  let index = 0;
  let output = "";

  for (let s = 0; s < segments; s++) {
    const startRgb = hexToRgb(hexStops[s]);
    const endRgb = hexToRgb(hexStops[s + 1]);
    const chars = distribution[s];

    const gradient = interpolate(startRgb, endRgb, chars);

    gradient.forEach(rgb => {
      const nearest = closestKMcColors(colorPallete, rgb, k);
      const weighted = normalizeWeights(nearest);
      const color = selectWeightedColor(weighted, index);
      output += color + text[index++];
    });
  }

  return output;
}

// POST /api/gradient - Generates an gradient output for usage
router.post("/gradient", (req, res) => {
  // Get the necessary values
  const { 
    type, 
    input, 
    colors, 
    styles = {
      "bold": false,
      "underline": false,
      "italic": false,
      "strikethrough": false,
      "obfuscation": false,
    }, 
    options = {
      trim: false,
      lowercaseHex: false
    }
  } = req.body;
  
  let output;
  let userInput = input;

  try {
    // checks if all parameters exists
    if (!type || !input || !colors) throw new Error('The required parameters were not passed.');
    
    if (options.trim) {
      userInput = userInput.trim().replace(/\s+/g, ' ');
    }
    
    // find the type
    if (type === "&#rrggbb") {
      // Make the color pallete
      const scale = chroma.scale(colors).mode("lab");

      // add it one by one
      output = [...userInput]
        .map((char, i) => {
          // apply one color pallete on one word
          const t = userInput.length === 1 ? 0 : i / (userInput.length - 1);
          const color = "&" + scale(t).hex();
          let filteredColor = color;
          
          if (options.lowercaseHex) {
            filteredColor = color.toLowerCase();
          };

          const styler = getStylers(styles);

          // return the value
          return `${filteredColor}${styler}${char}`;
        })
        .join("");
    } else if (type === "<#rrggbb>") {
      // Make the color pallete
      const scale = chroma.scale(colors).mode("lab");

      // add it one by one
      output = [...userInput]
        .map((char, i) => {
          // apply one color pallete on one word
          const t = userInput.length === 1 ? 0 : i / (userInput.length - 1);
          const color = "<" + scale(t).hex() + ">";
          let filteredColor = color;
          
          if (options.lowercaseHex) {
            filteredColor = color.toLowerCase();
          };
          
          const styler = getStylers(styles);

          // return the value
          return `${filteredColor}${styler}${char}`;
        })
        .join("");
    } else if (type === "&x&r&r&g&g&b&b") {
      //list of mc colors(legacy)
      const mcLegacyColors = {
        "&0": [0, 0, 0], // Black
        "&1": [0, 0, 170], // Dark Blue
        "&2": [0, 170, 0], // Dark Green
        "&3": [0, 170, 170], // Dark Aqua
        "&4": [170, 0, 0], // Dark Red
        "&5": [170, 0, 170], // Dark Purple
        "&6": [255, 170, 0], // Gold
        "&7": [170, 170, 170], // Gray
        "&8": [85, 85, 85], // Dark Gray
        "&9": [85, 85, 255], // Blue
        "&a": [85, 255, 85], // Green
        "&b": [85, 255, 255], // Aqua
        "&c": [255, 85, 85], // Red
        "&d": [255, 85, 255], // Light Purple
        "&e": [255, 255, 85], // Yellow
        "&f": [255, 255, 255] // White
      };
      
      // create the gradient
      const color = multiStopGradient(mcLegacyColors, userInput, colors);
      const styler = getStylers(styles);

      // return the value
      output = `${styler}${color}`;
    } else if (type === "§x§r§r§g§g§b§b") {
      //list of mc colors(legacy)
      const mcLegacyColors = {
        "§0": [0, 0, 0], // Black
        "§1": [0, 0, 170], // Dark Blue
        "§2": [0, 170, 0], // Dark Green
        "§3": [0, 170, 170], // Dark Aqua
        "§4": [170, 0, 0], // Dark Red
        "§5": [170, 0, 170], // Dark Purple
        "§6": [255, 170, 0], // Gold
        "§7": [170, 170, 170], // Gray
        "§8": [85, 85, 85], // Dark Gray
        "§9": [85, 85, 255], // Blue
        "§a": [85, 255, 85], // Green
        "§b": [85, 255, 255], // Aqua
        "§c": [255, 85, 85], // Red
        "§d": [255, 85, 255], // Light Purple
        "§e": [255, 255, 85], // Yellow
        "§f": [255, 255, 255] // White
      };
      
      // create the gradient
      const color = multiStopGradient(mcLegacyColors, userInput, colors);
      const styler = getStylers(options);

      // return the value
      output = `${styler}${color}`;
    } else throw new Error("No options matched.")
    
    if (!output) throw new Error('Responsed output is empty, did you enter the correct info?')
    
    res.json({ output: output });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/request", async (req, res) => {
  const { url, header } = req.body;
  
  try {
    // check if its trying to ping internal api
    if (!url.startsWith('https')) throw new Error("Cannot request internal api.");
    
    // check if its trying to ping localhosts
    if (url.startsWith("http://localhost")) throw new Error("Cannot request Localhosts.");
  
    const response = await axios(header);
  
    if (!response) throw new Error('No response from your url.');
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
