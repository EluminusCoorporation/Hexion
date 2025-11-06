// Gets the required modules
const express = require('express');
//Debugger modules
const HTMLHint = require('htmlhint');
const stylelint = require('stylelint');
const { ESLint } = require('eslint');
const router = express.Router();

//Creates an POST router for the frontend to access
router.post('/debugger', async (req, res) => {
  //Gets the json data sent from the frontend
  const {
    type,
    code
  } = req.body;
  
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
      }
      //Stores the results in the provided var
      report = HTMLHint.HTMLHint.verify(code, config);
    } else if (type === "Css") {
      report = await stylelint.lint({
        code: code,
        //Extended ruleset support
        config: { extends: 'stylelint-config-standard' },
      });
    } else if (type === "Java Script") {
      const eslint = new ESLint({
        overrideConfigFile: true,
        overrideConfig: {
          //extends: 'eslint:recommended',
          //env: { es2021: true, node: true },
          rules: {
            semi: ['error', 'always'],
            quotes: ['warn', 'single'],
          },
        },
      });
      report = await eslint.lintText(code);
    }
    
    else {
      //If language type is invalid throw error
      res.json({ success: false, report: "Invalid language type selected." });
    };
    //Else send the report to the frontend
    res.json({ success: true, report: report });
  } catch(err) {
    //If any unexpected errors found report them
    res.json({ success: false, report: err.message });
  };
});

module.exports = router;