const config = require("../config.json");

function onMaintenance(req, res, next) {
  if (config.general.onMaintenance === false)
  {
    next();
    return;
  };
  
  res.status(503).render('error_handling/errorbody', { error: { title: `${config.general.siteName} is currently under maintenance.`, message: 'Please wait for a few moments and try again later.'}, errorcode: "Maintenance", errorurl: config.general.domain });
};

module.exports = onMaintenance;