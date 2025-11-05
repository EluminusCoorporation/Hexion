const express = require('express');
const HTMLHint = require('htmlhint');
const stylelint = require('stylelint')
const router = express.Router();

router.post('/debugger', async (req, res) => {
  const {
    type,
    code
  } = req.body;
  
  let report;
  
  try {
    if (type === "Html") {
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
      report = HTMLHint.HTMLHint.verify(code, config);
    } else if (type === "Css") {
      report = await stylelint.lint({
        code: code,
        config: { extends: 'stylelint-config-standard' },
      });
    }
    
    else {
      res.json({ success: false, report: "Invalid language type selected." });
    };
    res.json({ success: true, report: report });
  } catch(err) {
    res.json({ success: false, report: err.message });
  };
});

module.exports = router;