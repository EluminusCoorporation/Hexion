//Setups a router
const express = require('express');
const router = express.Router();

//Imports the config
const config = require('../config.json');

router.get("/", (req, res) => {
  res.redirect('/tos');
});

router.get("/tos", (req, res) => {
  const pageInfo = {
    title: "Terms of service",
    description: "The official TERMS OF SERVICE of hexion.",
    url: `${config.url}/tos`
  };
  res.render('documents/tos', pageInfo);
});

router.get("/privacy", (req, res) => {
  const pageInfo = {
    title: "Privacy",
    description: "The official PRIVACY POLICY of hexion.",
    url: `${config.url}/policy`
  }
  res.render('documents/privacy', pageInfo);
});

module.exports = router;