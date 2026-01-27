const path = require('path');
const fs = require('fs');
const loadConfig = require("./loadConfig");
const config = loadConfig("./config.toml");

function consoleStartUp() {
  // designer borders around
  process.stdout.write('='.repeat(30) + '\n');
  //sends the banner
  const asciiPath = path.join(__dirname, '../public/assets', 'ascii-art.txt');
  let asciiArt = fs.readFileSync(asciiPath, 'utf8');
  process.stdout.write(asciiArt);
  
  //sends the copyright & version
  const copyright = "© Eluminusco all rights served."
  const version = 'v' + config.general.version;
  //Gets the total length of spaces to add
  const padLength = process.stdout.columns - version.length - copyright.length;

  process.stdout.write('\n' + copyright + " ".repeat(Math.max(0, padLength)) + version + '\n\n');
  
  // designer borders around
  process.stdout.write('='.repeat(30) + '\n');
}

module.exports = consoleStartUp;