const MAX_CONNECTIONS_PER_IP = 4; // Set your desired simultaneous connection limit
const activeConnections = new Map();

const connectionLimit = (req, res, next) => {
  const userIP = req.ip;

  // Get current active connections for this IP
  let current = activeConnections.get(userIP) || 0;

  // If limit exceeded, reject the request
  if (current >= MAX_CONNECTIONS_PER_IP) {
    return res.status(429).json({ error: 'Connection limit exceeded.' });
  }

  // Increment active connections
  activeConnections.set(userIP, current + 1);

  // Decrement when response finishes
  res.on('finish', () => {
    let updated = (activeConnections.get(userIP) || 1) - 1;
    if (updated <= 0) {
      activeConnections.delete(userIP);
    } else {
      activeConnections.set(userIP, updated);
    }
  });

  next();
};

module.exports = connectionLimit;