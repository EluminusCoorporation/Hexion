function mainRouter(req, res, next) {
  // Sanitize url
  const sanitizedUrl = (url) => url.replace(/\/+$/, '').split('?')[0];
  const reqPath = sanitizedUrl(req.originalUrl);
  
  // Initialize Locals
  res.locals.isCurrentPage = path => {
    const target = sanitizedUrl(path);
    return reqPath === target || reqPath.startsWith(path);
  }
  
  next();
}

module.exports = mainRouter