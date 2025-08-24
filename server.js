//Imports Required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
//Imports the config
const config = require('./config.json');

//Imports in app Funcs
const errorHandling = require('./middleware/errorHandling');
const loadRoutes = require('./utils/loadRoutes');

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
//initializes the routes directory
const routesDir = path.join(__dirname, 'routes');

//Loads the Routes
loadRoutes(app, routesDir);

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