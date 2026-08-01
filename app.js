/*

Hexion • Developer tools

  _    _           _              
 | | | | _____  _(_) ___  _ __   
 | |_| |/ _ \ \/ / |/ _ \| '_ \  
 |  _  |  __/>  <| | (_) | | | | 
 |_| |_|\___/_/\_\_|\___/|_| |_| 
 
© Eluminusco all rights served.       v1.0.0-demo

*/

"use strict";

// Import Required modules
const express = require('express');
const favicon = require('serve-favicon');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const rateLimit = require('express-rate-limit');

// Import the config
const loadConfig = require('./utils/loadConfig');
const config = loadConfig('./config.toml');

// Import routers
const base = require('./routers/base');
const api = require('./routers/api');
const tools = require('./routers/tools');
const documents = require('./routers/documents');

// Internal path
const PUBLIC_DIR = path.join(__dirname, 'public');

// Import in-app middlewares
const locals = require('./middleware/locals');
const onMaintenance = require('./middleware/onMaintenance');
const setHeaders = require('./middleware/setHeaders');
const consoleStartUp = require('./utils/consoleStartUp');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Initialize the express app
const app = express();

// Sends the ascii art & info
consoleStartUp();

//The server starting process starts from here
console.log(chalk.white(chalk.bold.yellow('[server]') + ' Starting Server...'));

//if on maintenance mode
if (config.general.onMaintenance === true) {
  console.log(chalk.white(chalk.bold.yellow('[server]') + ' Starting under Maintenance Mode.'));
}

//Set up view engine for express
app.set("view engine", "ejs");

// find if its an proxy or an direct connection
app.set('trust proxy', (ip) => {
  if (ip === '127.0.0.1' || ip === '123.123.123.123') return true // trusted IPs
  else return false
});

//Setup static directories
if (fs.existsSync(PUBLIC_DIR)) app.use(express.static(PUBLIC_DIR));

//Enable required middlewares
app.use(express.json({
  inflate: true,
  limit: "1mb",
  reviver: null,
  strict: true,
  type: "application/json",
  verify: undefined,
}));
app.use(express.text());

app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(favicon(path.join(PUBLIC_DIR, 'assets/icons/favicon.ico')));

// Checks & installs required python packages
/* try {
  // Check if external dependencies are missing
  execSync("python -m flake8 --version", { stdio: "ignore" });
  } catch {
  //if not, install
  console.log(chalk.white(chalk.bold.blue('[dependency manager]') + " Installing dependencies..."));
  try {
    // Install silently (suppress all logs)
    execSync("python -m pip install --user flake8 -q", { stdio: "ignore" });

    // Verify installation
    execSync("python -m flake8 --version", { stdio: "ignore" });
    console.log(chalk.white(chalk.bold.yellow('[dependency manager]') + ' Successfully installed all the required dependencies.'));
  } catch (err) {
    console.error(chalk.yellow(chalk.bold.yellow('[dependency manager]') + " Could not install a few dependencies\n\n"), chalk.gray(err.message));
    throw err;
  }
}*/

//Setting up in-app middlewares (before)
app.use(onMaintenance);
app.use(locals);
app.use(setHeaders);

// Setting up rate limiters
const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 60,
  message: { error: "Too many requests, slow down." }
});
app.use("/api/", limiter);

//Load routers
app.use("/", base);
app.use("/tools", tools);
app.use("/documents", documents);
app.use("/api", api);

//Setting up in-app middlewares (after)
app.use(errorHandler);
app.use(notFoundHandler);

//Starts the server
const PORT = config.general.port || 3000;

app.listen(PORT, () => {
  console.log(chalk.gray(`Hexion v${config.general.version} - webserver online on Port:${PORT}`));
}).on('error', (error) => {
  console.error(chalk.red(chalk.bold.yellow('[server]') + ` Could not start server\n\n${error}`));
});

//If any other exceptions catch instead of crashing
process.on('uncaughtException', (error) => {
  console.error(chalk.red(chalk.bold.yellow('[server]') + ' Uncaught Exception:\n\n'), chalk.gray(error));
});

// if any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:');
  console.error(promise);
  console.error('Reason: ' + reason);
});
