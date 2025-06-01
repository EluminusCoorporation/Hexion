const express = require('express');
const router = express.Router()

router.get("/tools", (req, res) => {
  res.redirect('/tools/encoding')
});

router.get("/tools/encoding", (req, res) => {
  res.render('tools/encoding')
});

router.get("/tools/decoding", (req, res) => {
  res.render('tools/decoding')
});

router.get("/tools/encrypting", (req, res) => {
  res.render('tools/encrypting')
});
router.get("/tools/decrypting", (req, res) => {
  res.render('tools/decrypting')
});
router.get("/tools/errorDebugger", (req, res) => {
  res.render('tools/errorDebugger')
});
router.get("/tools/colorCodeGenerator", (req, res) => {
  res.render('tools/colorCodeGenerator')
});

module.exports = router;