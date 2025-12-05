/*

Hexion • Developet tools

  _    _           _              
 | | | | _____  _(_) ___  _ __   
 | |_| |/ _ \ \/ / |/ _ \| '_ \  
 |  _  |  __/>  <| | (_) | | | | 
 |_| |_|\___/_/\_\_|\___/|_| |_| 
 
© Eluminusco all rights served.       v1.0-demo
*/

"use strict";

//Import Required modules
const express = require('express');
const favicon = require('serve-favicon');
const chalk = require('chalk');
const path = require('path');
const { execSync } = require('child_process');
const rateLimit = require('express-rate-limit');
//Import the config
const loadConfig = require('./utils/loadConfig');
const config = loadConfig('./config.toml');

//Import routers
const api = require('./routers/api');
const tools = require('./routers/tools');
const documents = require('./routers/documents');

//Internal path
const PUBLIC_DIR = path.join(__dirname, 'public');
const ASSETS_DIR = path.join(__dirname, 'assets');

//Import in-app middlewares
const onMaintenance = require('./middleware/onMaintenance');
const setHeaders = require('./middleware/setHeaders');
const consoleStartUp = require('./utils/consoleStartUp');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

//Initialize the express app
const app = express();

//Sends the ascii art & info
consoleStartUp();

//The server starting process starts from here
console.log(chalk.white(chalk.bold.yellow('[server]') + ' Starting Server...'));

//if on maintenance mode
if (config.general.onMaintenance === true) {
  console.log(chalk.white(chalk.bold.yellow('[server]') + ' Starting under Maintenance Mode.'))
}

//Set up view engine for express
app.set("view engine", "ejs");

//Set it to trust proxies
app.set("trust proxy", true)

//Setup static directories
app.use(express.static(PUBLIC_DIR));
app.use(express.static(ASSETS_DIR));

//Enable required middlewares
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: false, limit: "200mb" }));
app.use(favicon(path.join(ASSETS_DIR, 'icons/favicon.ico')));

//Checks & installs required python packages
try {
  // Check if external dependencies are missing
  execSync("python3 -m flake8 --version", { stdio: "ignore" });
  } catch {
    //if not, install
    console.log(chalk.white(chalk.bold.yellow('[server]') + " Installing dependencies..."));
    try {
      // Install silently (suppress all logs)
      execSync("python3 -m pip install --user flake8 -q", { stdio: "ignore" });

      // Verify installation
      execSync("python3 -m flake8 --version", { stdio: "ignore" });
    } catch (err) {
      console.error(chalk.yellow(chalk.bold.yellow('[server]') + " Could not install a few dependencies\n\n"), chalk.gray(err.message));
      throw err;
    }
  }

//Setting up in-app middlewares (before)
app.use(onMaintenance);
app.use(setHeaders);

//Setting up rate limiters
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: "Too many requests, slow down." }
});
app.use("/api/", limiter);

//Route setup
// Returns / to /home
app.get("/", (req, res) => {
  res.redirect('/home');
});
app.get("/home", (req, res) => {
  const pageInfo = {
    title: "Home",
    description: "The official home page of hexion, here you will find all the information related to hexion once you get ready you can start you're journey on hexion.",
    url: `${config.general.domain}/home`,
    path: "home"
  };
  res.render('home', pageInfo);
});
app.get("/dashboard", (req, res) => {
  const pageInfo = {
    title: "Dashboard",
    description: "The dashboard of hexion, here you can access all our powerful tools to enpower you're projects.",
    url: `${config.general.domain}/dashboard`,
    path: "dashboard"
  };
  res.render('dashboard', pageInfo);
});
app.get("/donation", (req, res) => {
  const pageInfo = {
    title: "Donation",
    description: "The donation page of hexion, here you can donate us some of you're precious money to help us run this website longer for you developers.",
    url: `${config.general.url}/donation`,
    path: "donation"
  };
  res.render('donation', pageInfo);
});
app.get("/codeBook", (req, res) => {
  const pageInfo = {
    title: "Code Book",
    description: "The code book of hexion, here you will find all the information related to developing, coding, programming, computer science and much much more.",
    url: `${config.general.domain}/codeBook`,
    path: "codeBook"
  };
  res.render('codeBook', pageInfo);
});
app.get("/cources", (req, res) => {
  const pageInfo = {
    title: "Cources",
    description: "The official cources of hexion, here you will find many cources related to coding from simple to advance.",
    url: `${config.general.domain}/cources`,
    path: "cources"
  };
  res.render('cources', pageInfo);
});

//Load routers
app.use("/tools", tools);
app.use("/documents", documents);
app.use("/api", api);

//Setting up in-app middlewares (after)
app.use(errorHandler);
app.use(notFoundHandler);

//Starts the server
const PORT = config.general.port || 8000;
app.listen(PORT, () => {
  console.log(chalk.gray(`Hexion v${config.general.version} - webserver online on Port:${PORT}`));
}).on('error', (error) => {
  //if error is an port in use error, log
  if (error.code === "EADDRINUSE") console.error(chalk.red(chalk.bold.yellow('[server]') + ` Port: ${config.general.port} is already in use`)) 
  else console.error(chalk.red(chalk.bold.yellow('[server]') + ` Could not start server\n\n${error}`));
});

//If any other exceptions catch instead of crashing
process.on('uncaughtException', (error) => {
  console.error(chalk.red(chalk.bold.yellow('[server]') + ' Uncaught Exception:\n\n'), chalk.gray(error));
});