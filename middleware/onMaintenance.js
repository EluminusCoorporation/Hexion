const config = require("../config.json");

function onMaintenance(req, res, next) {
  if (config.general.onMaintenance === false)
  {
    next();
    return;
  };
  
  res.status(503).render('error_handling/errorbody', { error: `${config.general.siteName} is currently under maintenance.`, errorcode: "Maintenance", errorurl: "Please wait for a few hours and try again later." });
};

module.exports = onMaintenance;