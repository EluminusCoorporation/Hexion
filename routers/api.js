// Gets the required modules
const express = require("express");

//Debugger modules
const HTMLHint = require("htmlhint");
const stylelint = require("stylelint");
const { ESLint } = require("eslint");
const { spawnSync } = require("child_process");

//gradient modules
const chroma = require('chroma-js');

const router = express.Router();

//Creates an POST router for the frontend to access
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
      res.json({ success: false, report: "Invalid language type selected." });
    }
    //Else send the report to the frontend
    res.json({ success: true, report: report });
  } catch (err) {
    //If any unexpected errors found report them
    res.json({ success: false, report: err.message });
  }
});

router.post("/gradient", (req, res) => {
  const { type, input, colors } = req.body;

  let output;
  
  try {
    if (type === "#rrggbb") {
      const scale = chroma.scale(colors).mode("lab");

      output = [...input].map((char, i) => {
        const t = input.length === 1 ? 0 : i / (input.length - 1);
        const color = scale(t).hex();
        return `${color}${char}`;
      }).join("");
    } else {
      res.json({ output: 'No options matched.', error: true })
    }
  } catch (error) {
    res.status(500).json({ output: error, error: true });
  };
  
  res.json({ output: output });
});

module.exports = router;
