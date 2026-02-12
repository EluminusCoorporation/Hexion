const path = require('path');
const fs = require('fs');
const loadConfig = require("./loadConfig");
const config = loadConfig("./config.toml");

function consoleStartUp() {
  //sets the version
  const version = 'v' + config.general.version;
  
  // designer borders around
  process.stdout.write('\n' + '='.repeat(34 + version.length) + '\n');
  
  //sends the banner
  const asciiPath = path.join(__dirname, '../public/assets', 'ascii-art.txt');
  let asciiArt = fs.readFileSync(asciiPath, 'utf8');
  asciiArt = asciiArt.replace("{{version}}", version);
  process.stdout.write(asciiArt);
  
  // designer borders around
  process.stdout.write('\n\n' + '='.repeat(34 + version.length) + '\n');
}

module.exports = consoleStartUp;