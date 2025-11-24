const fs = require('fs');
const logger = require('./logger');
const toml = require('@iarna/toml');

//Sets an placeholder config
let config = null;
//Watcher to watch over the file changes
let watcher = null;

function loadConfig(path= 'config.toml') {
  try {
    //Read the toml file
    const tomlRaw = fs.readFileSync(path, 'utf-8');
    
    //Parse the toml to get an usable copy
    config = toml.parse(tomlRaw);
    
    //returns the config
    return config;
  } catch (err) {
    //Throw error if error occured
    logger.error('An error occured, while reading or parsing the config.\n\n', err);
    throw err;
  };
};

module.exports = loadConfig;