const loadConfig = require("../utils/loadConfig");
const config = loadConfig("./config.toml");

function onMaintenance(req, res, next) {
  if (config.general.onMaintenance === false) return next();
  
  res.status(503).render('error/errorbody', { error: { title: `${config.general.siteName} is currently under maintenance.`, message: 'Please wait for a few moments and try again later.'}, errorcode: "Maintenance", errorurl: config.general.domain });
};

module.exports = onMaintenance;