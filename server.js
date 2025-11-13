//Import Required modules
const express = require('express');
const path = require('path');
const { execSync } = require('child_process');
const rateLimit = require('express-rate-limit');
//Import the config
const config = require('./config.json');

//Import routers
const api = require('./routers/api');
const tools = require('./routers/tools');
const documents = require('./routers/documents');

//Import in-app middlewares
const onMaintenance = require('./middleware/onMaintenance');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

//Initialize the logger module
const logger = require('./utils/logger');

//Initialize the express app
const app = express();

//Initialize the modules that require app to be Initialize first

//The server starting process starts from here
logger.info('Starting Server...');
if (config.general.onMaintenance === true) logger.info('Server starting under Maintenance Mode.')

//Set up view engine for express
app.set("view engine", "ejs");

//Enable required middlewares
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: false, limit: "200mb" }));

//Setup static directories
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

//Checks & installs required python packages
try {
  // Check if flake8 exists
  execSync("python3 -m flake8 --version", { stdio: "ignore" });
  } catch {
    logger.info("Installing dependencies...");
    try {
      // Install silently (suppress all logs)
      execSync("python3 -m pip install --user flake8 -q", { stdio: "ignore" });

      // Verify installation
      execSync("python3 -m flake8 --version", { stdio: "ignore" });
    } catch (err) {
      logger.error("Could not install a few dependencies\n", err.message);
      return;
    }
  }

//Setting up in-app middlewares (before)
app.use(onMaintenance);

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
    url: `${config.general.domain}/home`
  };
  res.render('home', pageInfo);
});
app.get("/dashboard", (req, res) => {
  const pageInfo = {
    title: "Dashboard",
    description: "The dashboard of hexion, here you can access all our powerful tools to enpower you're projects.",
    url: `${config.general.domain}/dashboard`
  };
  res.render('dashboard', pageInfo);
});
app.get("/donation", (req, res) => {
  const pageInfo = {
    title: "Donation",
    description: "The donation page of hexion, here you can donate us some of you're precious money to help us run this website longer for you developers.",
    url: `${config.general.url}/donation`
  };
  res.render('donation', pageInfo);
});
app.get("/codeBook", (req, res) => {
  const pageInfo = {
    title: "Code Book",
    description: "The code book of hexion, here you will find all the information related to developing, coding, programming, computer science and much much more.",
    url: `${config.general.domain}/codeBook`
  };
  res.render('codeBook', pageInfo);
});
app.get("/cources", (req, res) => {
  const pageInfo = {
    title: "Cources",
    description: "The official cources of hexion, here you will find many cources related to coding from simple to advance.",
    url: `${config.general.domain}/cources`
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
  logger.info(`Server online on Port:${PORT}`);
});