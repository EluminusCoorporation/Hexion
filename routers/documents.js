//Setups a router
const express = require('express');
const router = express.Router();

//Imports the config
const loadConfig = require('../utils/loadConfig');
const config = loadConfig("./config.toml");

router.get("/", (req, res) => {
  //Redirects to tos
  res.redirect('/tos');
});

router.get("/tos", (req, res) => {
  const pageInfo = {
    title: "Terms of service",
    description: "The official TERMS OF SERVICE of hexion.",
    url: `${config.general.domain}/documents/tos`,
    path: "documents/tos"
  };
  res.render('documents/tos', pageInfo);
});

router.get("/privacy", (req, res) => {
  const pageInfo = {
    title: "Privacy Policy",
    description: "The official PRIVACY POLICY of hexion.",
    url: `${config.general.domain}/documents/policy`,
    path: "documents/privacy"
  }
  res.render('documents/privacy', pageInfo);
});

module.exports = router;