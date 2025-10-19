//Setups a router
const express = require('express');
const router = express.Router();

//Imports the config
const config = require('../config.json');

//Returns to encoding when GET is /tools
router.get("/", (req, res) => {
  res.redirect('/encoding');
});

router.get("/encoder", (req, res) => {
  const pageInfo = {
    title: "Encoder",
    description: "The encoder tool of hexion, here you can encode any piece of text, you get chance to select from 10 different formats",
    url: `${config.url}/encoding`
  };
  res.render('tools/encoder', pageInfo);
});

router.get("/decoder", (req, res) => {
  const pageInfo = {
    title: "Decoder",
    description: "The decoder tool of hexion, here you can decode any piece of text, you get chance to select from 10 different formats",
    url: `${config.url}/decoding`
  };
  res.render('tools/decoder', pageInfo);
});

router.get("/encrypter", (req, res) => {
  const pageInfo = {
    title: "Encrypter",
    description: "The encrypter tool of hexion, here you can encrypt any piece of text, you get chance to select from 10 different formats",
    url: `${config.url}/encrypting`
  };
  res.render('tools/encrypter', pageInfo);
});
router.get("/decrypter", (req, res) => {
  const pageInfo = {
    title: "Decrypter",
    description: "The decrypter tool of hexion, here you can decrypt any piece of text, you get chance to select from 10 different formats",
    url: `${config.url}/decrypting`
  };
  res.render('tools/decrypter', pageInfo);
});
router.get("/errorDebugger", (req, res) => {
  const pageInfo = {
    title: "Error Debugger",
    description: "The Error Debugger, tool of hexion, here you can fix errors in you're code by simply typing the erroring code block or uploading the whole file, you get chance to select from 10 different languages",
    url: `${config.url}/errorDebugger`
  };
  res.render('tools/errorDebugger', pageInfo);
});
router.get("/gradiantGenerator", (req, res) => {
  const pageInfo = {
    title: "Gradiant Generator",
    description: "The gradiant generator, tool of hexion, here you can add gradiant to any text make it beautiful, you get chance to fully customize you're text from just bolding it to underling it",
    url: `${config.url}/gradiantGenerator`
  };
  res.render('tools/gradiantGenerator', pageInfo);
});

//Exports the router
module.exports = router;