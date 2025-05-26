//Required Imports
const express = require('express');
const path = require('path');

// initializes the express app
const app = express();

//The server starting process starts from here
console.log("\x1b[1m\x1b[33mStarting\x1b[0m\x1b[90m | \x1b[0mStarting Server...");

//Set up view engine for express
app.set("view engine", "ejs");

//Route setup
//Redirects / to /home
app.get("/", (req, res) => {
  res.redirect('/home');
});
app.get("/home", (req, res) => {
  res.render('home');
}); 
app.get("/dashboard", (req, res) => {
  res.render('dashboard');
});
app.get("/donations", (req, res) => {
  res.render('donations')
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

//Setup static directorys
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

// Router Setup
const toolsRouter = require("./routers/tools.js");
app.use("/tools", toolsRouter) ;

//handles the POST requests
app.post('/upload', async (req, res) => {
  
})

//Error handling System
app.use((req, res, next) => {
  //separate middleware for 404
  res.status(404).render('error_handling/errorbody', {error: 'Could not find page', errorurl: req.url, errorcode: '404'})
})
//This middleware handles all other status codes
app.use((err, req, res, next) => {
  //Logs the error stack for debugging purposes
  console.log(err.stack);
  
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
  res.status(status).render('error_handling/errorbody', { error: message, errorcode: status, errorurl: req.url});
});

//Starts the server
const PORT = "8000";
app.listen(PORT, () => {
  console.log(`\x1b[1m\x1b[32mSuccess\x1b[0m\x1b[90m | \x1b[0mServer online on http://localhost:${PORT}.`);
})