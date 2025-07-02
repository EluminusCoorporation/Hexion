//Setup's the router
const express = require('express');
const router = express.Router();

// Returns / to /home
router.get("/", (req, res) => {
  res.redirect('/home');
});
router.get("/home", (req, res) => {
  res.render('home');
}); 
router.get("/dashboard", (req, res) => {
  res.render('dashboard');
});
router.get("/donation", (req, res) => {
  res.render('donation')
});
router.get("/codeBook", (req, res) => {
  res.render('codeBook');
});
router.get("/cources", (req, res) => {
  res.render('cources');
});
router.get("/tos", (req, res) => {
  res.render('documents/tos');
});
router.get("/privacy", (req, res) => {
  res.render('documents/privacy');
});

//Exports the router
module.exports = router;