//Setups a router
const express = require('express');
const router = express.Router()

//Returns to encoding when GET is /tools
router.get("/", (req, res) => {
  res.redirect('/encoding')
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
router.get("/gradiantGenerator", (req, res) => {
  res.render('tools/gradiantGenerator')
});

//Exports the router
module.exports = router;