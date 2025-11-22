const config = require("../config.json");

function setHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  res.setHeader("X-Powered-By", `Hexion`);
  res.setHeader("X-Heliactyl", `Hexion v${config.version}`);
  next();
};

module.exports = setHeaders;