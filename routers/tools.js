//Setups a router
const express = require('express');
const router = express.Router();

//Imports the config
const config = require('../config.json');

//Returns to encoding when GET is /tools
router.get("/", (req, res) => {
  //Redirects to ender
  res.redirect('/encoder');
});

router.get("/encoder", (req, res) => {
  const pageInfo = {
    title: "Encoder",
    description: "The encoder tool of hexion, here you can encode any piece of text, you get chance to select from 10 different formats",
    url: `${config.general.domain}/tools/encoder`,
    path: "tools/encoder"
  };
  res.render('tools/encoder', pageInfo);
});

router.get("/decoder", (req, res) => {
  const pageInfo = {
    title: "Decoder",
    description: "The decoder tool of hexion, here you can decode any piece of text, you get chance to select from 10 different formats",
    url: `${config.general.domain}/tools/decoder`,
    path: "tools/decoder"
  };
  res.render('tools/decoder', pageInfo);
});

router.get("/encrypter", (req, res) => {
  const pageInfo = {
    title: "Encrypter",
    description: "The encrypter tool of hexion, here you can encrypt any piece of text, you get chance to select from 10 different formats",
    url: `${config.general.domain}/tools/encrypter`,
    path: "tools/encrypter"
  };
  res.render('tools/encrypter', pageInfo);
});
router.get("/decrypter", (req, res) => {
  const pageInfo = {
    title: "Decrypter",
    description: "The decrypter tool of hexion, here you can decrypt any piece of text, you get chance to select from 10 different formats",
    url: `${config.general.domain}/tools/decrypter`,
    path: "tools/decrypter"
  };
  res.render('tools/decrypter', pageInfo);
});
router.get("/errorDebugger", (req, res) => {
  const pageInfo = {
    title: "Error Debugger",
    description: "The Error Debugger, tool of hexion, here you can fix errors in you're code by simply typing the erroring code block or uploading the whole file, you get chance to select from 10 different languages",
    url: `${config.general.domain}/tools/errorDebugger`,
    path: "tools/errorDebugger"
  };
  res.render('tools/errorDebugger', pageInfo);
});
router.get("/gradientGenerator", (req, res) => {
  const pageInfo = {
    title: "Gradient Generator",
    description: "The gradient generator, tool of hexion, here you can add gradient to any text make it beautiful, you get chance to fully customize you're text from just bolding it to underlining it",
    url: `${config.url}/tools/gradientGenerator`,
    extraLinks: "<link href='https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap' rel='stylesheet'><link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/monolith.min.css'><link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=format_overline'>",
    path: "tools/gradientGenerator"
  };
  res.render('tools/gradientGenerator', pageInfo);
});

//Exports the router
module.exports = router;