//Imports required
const express = require('express');
const path = require('path');

// initializes the app
const app = express();

//The server starts from here
console.log("\x1b[1m\x1b[33mStarting\x1b[0m\x1b[90m | \x1b[0mStarting Server...");

//Set up view engine for express
app.set("view engine", "ejs");

//Route setup
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
  res.render('donation');
});
app.get("/codeBook", (req, res) => {
  res.render('codeBook');
});
app.get("/cources", (req, res) => {
  res.render('cources');
});

// Router Setup
const toolsRouter = require("./routers/tools.js");
app.use("/tools", toolsRouter) ;

//Setup static directorys
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

//handles the POST requests
app.post('/upload', async (req, res) => {
  
})

//Server is now online
const PORT = "8000";
app.listen(PORT, () => {
  console.log(`\x1b[1m\x1b[32mSuccess\x1b[0m\x1b[90m | \x1b[0mServer online on http://localhost:${PORT}.`);
})