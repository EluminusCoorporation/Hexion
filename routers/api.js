// Gets the required modules
const express = require("express");

// Debugger modules
const { parse } = require("node-html-parser");
const HTMLHint = require("htmlhint");
const stylelint = require("stylelint");
const { ESLint } = require("eslint");
const { spawnSync } = require("child_process");

// Request Sender modules
const axios = require("axios");

// Color Converter modules
// NOTE: This is used in Color Converter as well as Gradient Generator
const culori = require("culori");

const router = express.Router();

// Helper functions for debugger
async function debugCss(code) {
  const rawReport = await stylelint.lint({
    code,
    // Extended ruleset support
    config: { extends: "stylelint-config-standard" }
  });
  // FIX: sanitize it to avoid circulation errors
  function sanitizeReport(results) {
    return results.map(r => ({
      source: r.source,
      warnings: r.warnings.map(w => ({
        line: w.line,
        column: w.column,
        text: w.text,
        rule: w.rule
      })),
      errored: r.errored
    }));
  }
  
  return sanitizeReport(rawReport.results);
}

async function debugJs(code, options) {
  const eslint = new ESLint({
    // Sets this as the config
    overrideConfigFile: true,
    overrideConfig: {
      //Some custon rules
      rules: {
        //If no semi colon error
        semi: ["error", "always"],
        //If wrong usage of quotes warn
        quotes: ["warn", "single"]
      },
      languageOptions: {
        ...(options.isNodejs && { sourceType: 'commonjs' })
      }
    }
  });
  const result = await eslint.lintText(code);
  return result;
}

// POST /api/debugger - Debugs the given code
router.post("/debugger", async (req, res) => {
  
  // Gets the json data sent from the frontend
  const { 
    type,
    code, 
    options = {
      isNodejs: false
    }
  } = req.body;

  // Creates an report var to store debugger results
  let report;

  try {
    // checks if required parameters exist
    if (!type || !code) throw new Error("The required parameters were not passed.")
    
    if (typeof code !== "string") throw new Error("Invalid code parameter, expected string.")
    
    // Searches for the type of debugger
    if (type === "html") {
      // Config for the rule set being used by the module (refer to the module docs for the list)
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
      // Stores the results in the provided var
      const htmlReport = HTMLHint.HTMLHint.verify(code, config);
      
      // Debug the style & script tags
      const doc = parse(code);
      
      // Get all styles
      const styles = [...doc.querySelectorAll('style')]
      // Filter empty ones
      .filter(style => style.textContent)
      // Get the textContent and join them
      .map(style => style.textContent)
      .join('\n');
      // Get all scripts
      const scripts = [...doc.querySelectorAll('script')]
      // Filter empty ones
      .filter(script => script.textContent && !script.hasAttribute('src'))
      // Get the textContent and join them
      .map(script => script.textContent)
      .join('\n');
      
      if (styles || scripts) {
        // if style tags exists debug them
        let cssReport = [];
        if (styles) cssReport = await debugCss(styles);
        // if script tags exists debug them
        let jsReport = [];
        if (scripts) jsReport = await debugJs(scripts, options);
        
        // Prepare a mixed report
        const mixedReport = {
          mixedHtml: true,
          html: htmlReport,
          css: cssReport,
          js: jsReport
        }
        
        report = mixedReport;
      // if no style or script tags exist just send raw html report
      } else {
        report = htmlReport;
      }
    }
    else if (type === "css") report = await debugCss(code);
    else if (type === "js") report = await debugJs(code, options);
    else if (type === "py") {
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
    // check if report has matter
    if (!report) throw new Error('The server responded with nothing, something went wrong.');
    
    // send the report to the frontend
    res.json({ report });
  } catch (error) {
    //If any unexpected errors found report them
    res.status(500).json({ message: error.message });
  }
});

// Helper functions for Gradient Generator
function getStylers(options, type = "default") {
  const stylerFormat = {
    bold: "&l",
    underline: "&n",
    italic: "&o",
    strikethrough: "&m",
    obfuscation: "&k"
  }
  
  // stylers will be stored here
  let stylers = "";

  // get the stylers that are selected
  const trueOptions = Object.keys(options).filter(key => options[key] === true);
  
  // apply the stylers
  switch (type) {
    case "default":
      trueOptions.forEach(option => (stylers += stylerFormat[option]));
      break;
    case "[COLOR]":
      // Define custom styles
      const customStylerFormat = {
        bold: "BOLD",
        underline: "UNDERLINE",
        italic: "ITALIC",
        strikethrough: "STRIKETHROUGH",
        obfuscation: ""
      }
      
      // Set stylers field to be an Object
      stylers = { start: "", end: "" };
      
      // Apply stylere one by one
      trueOptions.forEach(option => {
        // Get the current styler
        const currentStyler = customStylerFormat[option];
        
        // Ignore unsupported stylers
        if (!currentStyler) return;
        
        // Set the start and end style elements
        const start = `[${currentStyler}]`;
        const end = `[/${currentStyler}]`;
        
        // Set them onto the stylers Object
        stylers.start += start;
        stylers.end += end;
      });
      break;
  }
  
  // return the stylers
  return stylers;
}

function generateGradient(text, colors, styles, charLimit) {
  const chars = text.split("");
  const number = chars.length;
  
  const totalGroups = Math.ceil(number / charLimit);
  
  const segments = colors.length - 1;
  const result = [];

  chars.forEach((char, i) => {
    const groupIndex = Math.floor(i / charLimit);
    const target = groupIndex / (totalGroups - 1);

    // Determine which segment this char belongs to
    const segmentIndex = Math.min(
      Math.floor(target * segments),
      segments - 1
    );

    // Local t within the segment
    const segmentStart = segmentIndex / segments;
    const segmentEnd = (segmentIndex + 1) / segments;

    const localTarget = (target - segmentStart) / (segmentEnd - segmentStart);

    const interpolate = culori.interpolate([
      colors[segmentIndex],
      colors[segmentIndex + 1]
    ]);

    // Generate interpolate
    const color = culori.formatHex(interpolate(localTarget));

    result.push({ char, color, styles });
  });

  return result;
}

function prepareHex(styles, hex, prefix, hexType, char) {
  // Get formatted styles
  const stylers = getStylers(styles);
  
  // Convert hex into humanly readable format
  switch (hexType) {
    case "simple": return prefix + hex.slice(1) + stylers + char;
    case "<#rrggbb>": return `<${prefix}${hex.slice(1)}${stylers}>${char}`;
    case "[COLOR]": return `[COLOR=${prefix}${hex.slice(1)}]${char}[/COLOR]`
    default: return `${prefix}x` + hex
      .slice(1)
      .split("")
      .map(c => `${prefix}${c}`)
      .join("")
    + stylers + char;
  }
}

function buildGradient(charLimit, text, colors, options, styles, prefix, hexType) {
  const data = generateGradient(text, colors, styles, charLimit);
  
  // If its asking for json just give it the whole thing
  if (hexType === "json") return { text: JSON.stringify(data, null, 2), data };
  
  return {
    text: data.map(({ char, color, styles }) => {
      // Ignore if its an space
      if (char === " ") return " ";
      
      // Apply options
      let colorInputed = color;
      if (!options.lowercaseHex) colorInputed = color.toUpperCase();
      
      // Prepare the hex
      return prepareHex(styles, colorInputed, prefix, hexType, char);
    }).join(""),
    data
  };
};

function applyGradientWithReset(charLimit, input, colors, options, styles, prefix, hexType = "none") {
  // if its an single string
  if (input.length === 1) {
    const stylers = getStylers(styles);
    return input + stylers + colors[0];
  }
  
  let result = {};
  
  // Get the reset stylers
  const parts = input.split(/(&r|§r)/);

  parts.forEach((part, i) => {
    // reset if reset stylers are present
    if ((part === "&r" || part === "§r")) return result.text += part === "&r" ? "&r" : "§r";
    // Else continue
    const rawResult = buildGradient(charLimit, part, colors, options, styles, prefix, hexType);
    // If its the first one apply it
    if (i === 0) return result = rawResult;
    
    // Append it on top of it
    result.text += rawResult.text;
    result.data.push(...rawResult.data);
  });

  return result;
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
    },
    charLimit
  } = req.body;
  
  let output;
  let userInput = input;

  try {
    // checks if all parameters exists
    if (!type || !input || !colors) throw new Error('The required parameters were not passed.');
    
    if (options.trim) userInput = userInput.trim().replace(/\s+/g, ' ');
    
    // find the type
    if (type === "&#rrggbb") output = applyGradientWithReset(charLimit, userInput, colors, options, styles, '&#', 'simple');
    else if (type === "<#rrggbb>") output = applyGradientWithReset(charLimit, userInput, colors, options, styles, '#', '<#rrggbb>');
    else if (type === "&x&r&r&g&g&b&b") output = applyGradientWithReset(charLimit, userInput, colors, options, styles, '&');
    else if (type === "§x§r§r§g§g§b§b") output = applyGradientWithReset(charLimit, userInput, colors, options, styles, '§');
    else if (type === "[COLOR=#rrggbb][/COLOR]") {
      // Store generated content
      const generatedOutput = applyGradientWithReset(charLimit, userInput, colors, options, styles, '#', '[COLOR]');
      
      // Get the stylers
      const stylers = getStylers(styles, '[COLOR]');
      
      // Set the content
      // Only apply stylers if they exist
      generatedOutput.text = stylers.start ? `${stylers.start}\n${generatedOutput.text}\n${stylers.end}` : generatedOutput.text;
      output = generatedOutput;
    }
    else if (type === "JSON") output = applyGradientWithReset(charLimit, userInput, colors, options, styles, 'json', 'json');
    
    else throw new Error("No options matched.")
    
    if (!output) throw new Error('Output is empty, did you enter the correct info?');
    
    res.json({ output: output });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/request - Requests an external api
router.post("/request", async (req, res) => {
  const { header } = req.body;
  
  try {
    // check if its trying to ping internal api
    if (!header.url.startsWith('https')) throw new Error("Cannot request internal api.");
    
    // check if its trying to ping localhosts
    if (header.url.startsWith("http://localhost")) throw new Error("Cannot request Localhosts.");
  
    const response = await axios(header);
  
    if (!response) throw new Error('No response from your url.');
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper functions for Color Conversion of color converter
// Hue is undefined on black color, extra checking added for it
const fixed = (value, digits = 2) => (value ?? 0).toFixed(digits);
// Multiplication is needed for HWB format as it returns normalized values
const multiply = (value) => (value ?? 0) * 100;
// Percentages for few fields of colors
const percentage = (value, digits = 2) => (value ?? 0).toFixed(digits) + '%';

// Helper functions for Color Convert
function findFallback(format, color) {
  switch (format) {
    case "hex": return culori.formatHex(culori.clampRgb(color));
    case "rgb": return culori.formatRgb(culori.clampRgb(color));
    case "hsl": return culori.formatHsl(culori.clampRgb(color));
    case "hwb":
      const converter = culori.converter('hwb');
      
      const rawColor = converter(culori.clampRgb(color));
      return `hwb(${fixed(rawColor.h)} ${percentage(multiply(rawColor.w))} ${percentage(multiply(rawColor.b))})`;
  }
}

// POST /api/color - Converts an color into an another format
router.post("/color", (req, res) => {
  let fallbackColor = null;
  try {
    const {
      color,
      format,
    } = req.body;
    
    // If color provided is not an actual color
    if (!culori.parse(color)) throw new Error('Invalid color provided');
    
    
    // Converter setup for unsupported color formats
    const converter = culori.converter(format);
    if (!converter) throw new Error('Unsupported color format');
    
    // Check if color conversion is possible (only rgb based formats)
    if (['rgb', 'hex', 'hsl', 'hwb'].includes(format)) {
      // Get the final result (after conversion)
      let finalResult = null;
      
      // Assumes if the converter fails this is an out of gamut error
      try {
        // Use the inGamut function for hex validation as it is not supported in converter
        finalResult = format === "hex" ? culori.formatHex(color) : converter(color);
      } catch (error) {
        fallbackColor = findFallback(format, color);
        throw new Error('NOVALIDCOLORFOUND');
      };
      
      // Assumes if the converter fails silently this is an out of gamut error
      if (!finalResult) {
        fallbackColor = findFallback(format, color);
        throw new Error('NOVALIDCOLORFOUND');
      }
      
      // Ignore hex format if it cannot be displayed it is an out of gamut error
      if (format !== "hex" && !culori.displayable(finalResult)) {
        // Provide a fallback color
        fallbackColor = findFallback(format, color);
        
        throw new Error('NOVALIDCOLORFOUND');
      };
    };
    
    function universalFormatter(color) {
      let c = null;
      // Get color object (ignore if hex)
      if (format !== "hex") {
        c = converter(color);
        if (!c) throw new Error('Something went wrong?');
      };
      
      // Create color string
      switch (format) {
        case "oklch": return `oklch(${percentage(multiply(c.l))} ${fixed(multiply(c.c))} ${fixed(multiply(c.h))})`;
        case "oklab": return `oklab(${percentage(multiply(c.l))} ${fixed(multiply(c.a))} ${fixed(multiply(c.b))})`;
        case "lch": return `lch(${percentage(c.l)} ${fixed(c.c)} ${fixed(c.h)})`;
        case "lab": return `lab(${percentage(c.l)} ${fixed(c.a)} ${fixed(c.b)})`;
        // HWB returns normalized values so they need to be multiplied
        case "hwb": return `hwb(${fixed(c.h)} ${percentage(multiply(c.w))} ${percentage(multiply(c.b))})`;
        
        // Use inbuilt culori formatters which are available
        case "hex": return culori.formatHex(color);
        case "rgb": return culori.formatRgb(color);
        case "hsl": return culori.formatHsl(color);
        default: throw new Error('Unsupported color format');
      }
    }
    
    // Convert the color
    const result = universalFormatter(color);
    
    if (!result) throw new Error('Something went horribly wrong!');

    res.json({ output: result });
  } catch (error) {
    res.status(500).json({ 
      message: error.message, 
      ...(fallbackColor && { fallback: fallbackColor }),
    });
  }
})

module.exports = router;
