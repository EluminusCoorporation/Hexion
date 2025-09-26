//Setups a router
const express = require('express');
const router = express.Router();

//Imports the config
const config = require('../config.json');

//Returns to encoding when GET is /tools
router.get("/", (req, res) => {
  res.redirect('/encoding');
});

router.get("/encoding", (req, res) => {
  const pageInfo = {
    title: "Encoding",
    description: "The encoding tool of hexion, here you can encode any piece of text, you get chance to select from 10 different formats",
    url: `${config.url}/encoding`
  };
  res.render('tools/encoding', pageInfo);
});

router.get("/decoding", (req, res) => {
  const pageInfo = {
    title: "Decoding",
    description: "The decoding tool of hexion, here you can decode any piece of text, you get chance to select from 10 different formats",
    url: `${config.url}/decoding`
  };
  res.render('tools/decoding', pageInfo);
});

router.get("/encrypting", (req, res) => {
  const pageInfo = {
    title: "Encrypting",
    description: "The encrypting tool of hexion, here you can encrypt any piece of text, you get chance to select from 10 different formats",
    url: `${config.url}/encrypting`
  };
  res.render('tools/encrypting', pageInfo);
});
router.get("/decrypting", (req, res) => {
  const pageInfo = {
    title: "Decrypting",
    description: "The decrypting tool of hexion, here you can decrypt any piece of text, you get chance to select from 10 different formats",
    url: `${config.url}/decrypting`
  };
  res.render('tools/decrypting', pageInfo);
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