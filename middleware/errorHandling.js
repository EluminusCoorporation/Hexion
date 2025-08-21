function errorHandling(err, req, res, next) {
  //Logs the error stack for debugging purposes
  log.error(err.stack);
  
  //Gets the status code
  const status = err.status || 500;
  
  //Sets error codes for certain status codes
  const messages = {
    400: 'Bad Request',
    401: 'Unauthorized Access',
    402: 'Forbidden',
    404: 'Could not find page',
    500: 'Internal server error'
  };
  //Gets the correct message for the status code
  const message = messages[status];
  
  //Sends data to the frontend
  res.status(status).render('error_handling/errorbody', { error: message, errorcode: status, errorurl: req.url });
}

module.exports = errorHandling