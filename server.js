const express = require('express');
const path = require('path');

const app = express();

console.log("\x1b[1m\x1b[33mStarting\x1b[0m\x1b[90m | \x1b[0mStarting Server...");

app.set("view engine", "ejs");

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
app.get("/app", (req, res) => {
  res.render('app');
});
app.get("/cources", (req, res) => {
  res.render('cources');
});

const toolsRouter = require("./routers/tools.js");
app.use("/tools", toolsRouter) ;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

const PORT = "8000";
app.listen(PORT, () => {
  console.log(`\x1b[1m\x1b[32mSuccess\x1b[0m\x1b[90m | \x1b[0mServer online on http://localhost:${PORT}.`);
})