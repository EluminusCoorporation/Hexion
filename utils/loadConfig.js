const fs = require('fs');
const toml = require('@iarna/toml');

// Sets an placeholder config
let config = null;

function loadConfig(path= 'config.toml') {
  try {
    // Read the toml file
    const tomlRaw = fs.readFileSync(path, 'utf-8');
    
    // Parse the toml to get an usable copy
    config = toml.parse(tomlRaw);
    
    // returns the config
    return config;
  } catch (err) {
    // Throw error if error occured
    console.error(chalk.white(chalk.bold.blue('[config]') + ' An error occured, while reading or parsing the config.\n\n'), chalk.gray(err));
  };
};

module.exports = loadConfig;