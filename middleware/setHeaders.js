const loadConfig = require("../utils/loadConfig");
const config = loadConfig("./config.toml");

function setHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  res.setHeader("X-Powered-By", `EluminusCo`);
  res.setHeader("X-Hexion", `Hexion v${config.general.version}`);
  next();
};

module.exports = setHeaders;