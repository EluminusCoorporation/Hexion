const figlet = require("figlet");
const loadConfig = require("./loadConfig");
const config = loadConfig("./config.toml");

function consoleStartUp() {
  //clears the screen
  process.stdout.write("\x1Bc");

  //sends the banner
  console.log(figlet.textSync("Hexion", { font: "Standard" }));
  //sends the copyright & version
  const copyright = "© Eluminusco all rights served.";
  const version = 'v' + config.general.version;
  //Gets the total length of spaces to add
  const padLength = process.stdout.columns - version.length - copyright.length;

  console.log(copyright + " ".repeat(Math.max(0, padLength)) + version);
}

module.exports = consoleStartUp;