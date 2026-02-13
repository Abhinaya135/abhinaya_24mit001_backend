const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connection = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is live!');
});

/* ---------------- CREATE TABLES ---------------- */

connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  );
`);

connection.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

/* ---------------- REGISTER ---------------- */

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Missing fields' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY')
            return res.status(400).json({ message: 'Username already exists' });

          return res.status(500).json({ error: err.message });
        }

        res.json({ message: 'User registered successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- LOGIN ---------------- */

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err)
        return res.status(500).json({ error: err.message });

      if (results.length === 0)
        return res.status(401).json({ message: 'Invalid credentials' });

      const user = results[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match)
        return res.status(401).json({ message: 'Invalid credentials' });

      res.json({ message: 'Login successful' });
    }
  );
});

/* ---------------- CONTACT ---------------- */

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ message: 'All fields required' });

  connection.query(
    'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    (err) => {
      if (err)
        return res.status(500).json({ error: err.message });

      res.json({ message: 'Message sent successfully' });
    }
  );
});

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





