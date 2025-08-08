//Imports Required modules
const express = require('express');
const fs = require('fs');
const path = require('path');

//Imports the config
const config = require('./config.json');

//Imports in app Funcs
const loadRoutes = require('./utils/loadRoutes');

//Initializes the express app
const app = express();

//Initializes the modules that require app to be Initialize first
const expressWs = require('express-ws')(app);

//Initializes the logger module
const log = new(require('cat-loggr'))();

//The server starting process starts from here
log.info('Starting Server');

//Set up view engine for express
app.set("view engine", "ejs");

//Setup static directorys
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

//Route setup
//initializes the routes directory
const routesDir = path.join(__dirname, 'routes');

//Loads the Routes
loadRoutes(app, routesDir);

//handles the POST requests
app.post('/upload', (req, res) => {
  
})

//Error handling System
app.use((req, res, next) => {
  //separate middleware for 404
  res.status(404).render('error_handling/errorbody', { error: 'Could not find page', errorurl: req.url, errorcode: '404' })
})

//This middleware handles all other status codes
app.use((err, req, res, next) => {
  //Logs the error stack for debugging purposes
  log.error(err.stack);
  
  //Gets the status code
  const status = err.status || 500;
  
  //Sets error codes for certain status codes
  const messages = {
    400: 'Bad Request',
    401: 'Unauthorized Access',
    402: 'Forbidden',
    404: 'Could not find page',
    500: 'Internal server error'
  };
  //Gets the correct message for the status code
  const message = messages[status];
  
  //Sends data to the frontend
  res.status(status).render('error_handling/errorbody', { error: message, errorcode: status, errorurl: req.url });
});

//Starts the server
const PORT = config.general.port || 8000;
app.listen(PORT, () => {
  log.info(`Server online on Port:${PORT}`);
})