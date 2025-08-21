const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { IpFilter } = require('express-ipfilter');

const rateLimiter = require('./middlewares/rateLimiter');
const blockedIps = require('./middlewares/ipRestriction/blockedIPs');
const ipRestrictionMiddleware = require('./middlewares/ipRestriction/ipRestrictionMiddleware');
const connectionLimit = require('./middlewares/connectionLimit');

const app = express();
app.use(cors());
app.use(express.json());
app.use(connectionLimit);

// === IP Blacklist Middleware ===
app.use(ipRestrictionMiddleware);  // Apply IP restriction middleware

// Use the IP filter to block specific IPs
app.use(IpFilter(blockedIps, { mode: 'deny', detectIp: (req) => req.ip }));

// Handle errors for blocked IPs
app.use((err, req, res, next) => {
  if (err.name === 'IpDeniedError') {
    return res.status(401).json({ error: 'Your IP is blocked' });
  }
  next(err);
});

// === Apply Rate Limiter ===
app.use(rateLimiter);  // Apply rate limiter globally

// === Apply Connection Limiter ===
app.use(connectionLimit);  // Apply connection limiter globally

// === PostgreSQL setup ===
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'admin_console',
  password: 'your_password', // Replace with actual password or use env var
  port: 5432,
});

// === JWT Key Rotation ===
const KEYS_PATH = path.join(__dirname, 'jwt_keys.json');
function generateSecretKey() {
  return crypto.randomBytes(48).toString('hex');
}
function loadKeys() {
  if (!fs.existsSync(KEYS_PATH)) {
    const now = new Date().toISOString();
    const key = generateSecretKey();
    fs.writeFileSync(KEYS_PATH, JSON.stringify({ current: key, previous: '', lastRotated: now }, null, 2));
    return { current: key, previous: '', lastRotated: now };
  }
  return JSON.parse(fs.readFileSync(KEYS_PATH, 'utf8'));
}
function saveKeys(keys) {
  fs.writeFileSync(KEYS_PATH, JSON.stringify(keys, null, 2));
}
let { current: JWT_SECRET, previous: PREV_JWT_SECRET, lastRotated } = loadKeys();
const ROTATION_INTERVAL = 24 * 60 * 60 * 1000;
if (Date.now() - new Date(lastRotated).getTime() > ROTATION_INTERVAL) {
  PREV_JWT_SECRET = JWT_SECRET;
  JWT_SECRET = generateSecretKey();
  lastRotated = new Date().toISOString();
  saveKeys({ current: JWT_SECRET, previous: PREV_JWT_SECRET, lastRotated });
}

// === Registration ===
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query(
      'INSERT INTO users (name, email, hashed_password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { name, email }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error registering user');
  }
});

// === Login ===
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0]
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error logging in');
  }
});

// === JWT Auth Middleware ===
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err && PREV_JWT_SECRET) {
      return jwt.verify(token, PREV_JWT_SECRET, (err2, user2) => {
        if (err2) return res.sendStatus(403);
        req.user = user2;
        next();
      });
    } else if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// === Protected Routes ===
app.get('/api/users', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
