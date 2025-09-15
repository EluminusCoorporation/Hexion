//Imports Required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
//Imports the config
const config = require('./config.json');

//Import routers
const tools = require('./routers/tools')

//Imports in app Funcs
const errorHandling = require('./middleware/errorHandling');

//Initializes the express app
const app = express();

//Initializes the modules that require app to be Initialize first

//Initializes the logger module
const log = new(require('cat-loggr'))();

//The server starting process starts from here
log.info('Starting Server');

//Set up view engine for express
app.set("view engine", "ejs");

//Enable required middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Setup static directorys
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

//Setup in-app middlewares
app.use(errorHandling);

//Route setup
// Returns / to /home
app.get("/", (req, res) => {
  res.redirect('/home');
});
app.get("/home", (req, res) => {
  res.render('home');
});
app.get("/dashboard", (req, res) => {
  res.render('dashboard');
});
app.get("/donation", (req, res) => {
  res.render('donation')
});
app.get("/codeBook", (req, res) => {
  res.render('codeBook');
});
app.get("/cources", (req, res) => {
  res.render('cources');
});
app.get("/tos", (req, res) => {
  res.render('documents/tos');
});
app.get("/privacy", (req, res) => {
  res.render('documents/privacy');
});

//Load routers
app.use("/tools", tools)

//Error handling System
app.use((req, res, next) => {
  //separate middleware for 404
  res.status(404).render('error_handling/errorbody', { error: 'Could not find page', errorurl: req.url, errorcode: '404' });
});

//Starts the server
const PORT = config.general.port || 8000;
app.listen(PORT, () => {
  log.info(`Server online on Port:${PORT}`);
});