const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/api/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2)',
      [name, email]
    );
    res.status(201).send('User added');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error adding user');
  }
});


app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).send('User deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error deleting user');
  }
});


app.get('/api/roles', async (req, res) => {
  const result = await pool.query('SELECT * FROM roles');
  res.json(result.rows);
});

app.post('/api/roles', async (req, res) => {
  const { name } = req.body;
  await pool.query('INSERT INTO roles (name) VALUES ($1)', [name]);
  res.send('Role added');
});


app.get('/api/permissions', async (req, res) => {
  const result = await pool.query('SELECT * FROM permissions');
  res.json(result.rows);
});

app.post('/api/permissions', async (req, res) => {
  const { name } = req.body;
  await pool.query('INSERT INTO permissions (name) VALUES ($1)', [name]);
  res.send('Permission added');
});


app.get('/api/hierarchy', async (req, res) => {
  const result = await pool.query('SELECT * FROM hierarchy');
  res.json(result.rows);
});

app.post('/api/hierarchy', async (req, res) => {
  const { parent_id, child_id } = req.body;
  await pool.query('INSERT INTO hierarchy (parent_id, child_id) VALUES ($1, $2)', [parent_id, child_id]);
  res.send('Hierarchy entry added');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
