const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'admin_console',
  password: 'aya@gu22',
  port: 5432, // Default PostgreSQL port 5432
});

const JWT_SECRET = process.env.JWT_SECRET || 'AAHVUbgu25654673876@#$%^jkfyjtfytfytf@#$gfyGIUJ';

// Registration endpoint (hashes password)
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );
    res.status(201).send('User registered');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error registering user');
  }
});

// Login endpoint (returns JWT)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error logging in');
  }
});

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Protect all data endpoints
app.get('/api/users', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

app.post('/api/users', authenticateToken, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );
    res.status(201).send('User added');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error adding user');
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).send('User deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error deleting user');
  }
});

app.get('/api/roles', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM roles');
  res.json(result.rows);
});

app.post('/api/roles', authenticateToken, async (req, res) => {
  const { name } = req.body;
  await pool.query('INSERT INTO roles (name) VALUES ($1)', [name]);
  res.send('Role added');
});

app.get('/api/permissions', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM permissions');
  res.json(result.rows);
});

app.post('/api/permissions', authenticateToken, async (req, res) => {
  const { name } = req.body;
  await pool.query('INSERT INTO permissions (name) VALUES ($1)', [name]);
  res.send('Permission added');
});

app.get('/api/hierarchy', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM hierarchy');
  res.json(result.rows);
});

app.post('/api/hierarchy', authenticateToken, async (req, res) => {
  const { parent_id, child_id } = req.body;
  await pool.query('INSERT INTO hierarchy (parent_id, child_id) VALUES ($1, $2)', [parent_id, child_id]);
  res.send('Hierarchy entry added');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
