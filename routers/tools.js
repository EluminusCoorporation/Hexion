const express = require('express');
const router = express.Router()

router.get("/", (req, res) => {
  res.redirect('/tools/encoding')
});

router.get("/encoding", (req, res) => {
  res.render('tools/encoding')
});

router.get("/decoding", (req, res) => {
  res.render('tools/decoding')
});

router.get("/encrypting", (req, res) => {
  res.render('tools/encrypting')
});
router.get("/decrypting", (req, res) => {
  res.render('tools/decrypting')
});
router.get("/errorDebugger", (req, res) => {
  res.render('tools/errorDebugger')
});
router.get("/colorCodeGenerator", (req, res) => {
  res.render('tools/colorCodeGenerator')
});

module.exports = router;