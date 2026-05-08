// Setup router
const express = require('express');
const router = express.Router();

// Imports the config
const loadConfig = require('../utils/loadConfig');
const config = loadConfig("./config.toml");

// Route setup
// Returns / to /home
router.get("/", (req, res) => {
  res.redirect('/home');
});
router.get("/home", (req, res) => {
  const pageInfo = {
    title: "Home",
    description: "The official home page of hexion, here you will find all the information related to hexion once you get ready you can start you're journey on hexion.",
    url: `${config.general.domain}/home`,
    path: "home"
  };
  res.render('home', pageInfo);
});
router.get("/dashboard", (req, res) => {
  const pageInfo = {
    title: "Dashboard",
    description: "The dashboard of hexion, here you can access all our powerful tools to enpower you're projects.",
    url: `${config.general.domain}/dashboard`,
    path: "dashboard"
  };
  res.render('dashboard', pageInfo);
});
router.get("/donation", (req, res) => {
  const pageInfo = {
    title: "Donation",
    description: "The donation page of hexion, here you can donate us some of you're precious money to help us run this website longer for you developers.",
    url: `${config.general.url}/donation`,
    path: "donation"
  };
  res.render('donation', pageInfo);
});

module.exports = router;