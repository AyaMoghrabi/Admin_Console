const blockedIPs = require('./blockedIPs');

function ipRestrictionMiddleware(req, res, next) {
  // Get client IP (supports proxies)
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection.remoteAddress;
  if (blockedIPs.includes(clientIP)) {
    return res.status(403).send('Access denied: Your IP is blocked.');
  }
  next();
}

module.exports = ipRestrictionMiddleware;