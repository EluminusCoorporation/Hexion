const logger = require('../utils/logger');

//error info for all status codes
const errors = {
  400: { title: 'Bad Request', message: 'Please input correct values.' },
  401: { title: 'Unauthorized Access', message: "You're not are not authorized to access this page." },
  402: { title: 'Forbidden', message: 'The following action is Forbidden.' },
  404: { title:'Page Not Found', message: "Oops! The page you're looking for does not exists." },
  500: { title: 'Internal Server Error', message: "Oops! Something went horribly wrong." },
};

function errorHandler(err, req, res, next) {
  //Logs the error stack for debugging purposes
  logger.error(err.stack);
  
  //Gets the status code
  const status = err.status || 500;
  
  //Gets the correct message for the status code
  const errorInfo = errors[status];
  
  //Sends data to the frontend
  res.status(status).render('error/errorbody', { error: errorInfo, errorcode: status, errorurl: req.url });
}

function notFoundHandler(req, res, next) {
  const errorInfo = errors[404];
  //separate middleware for 404
  res.status(404).render('error/errorbody', { error: errorInfo, errorurl: req.url, errorcode: '404' });
}

module.exports = { errorHandler, notFoundHandler };