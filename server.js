// server.js
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db');
const cors = require('cors');

const app = express();
app.use(cors()); // allow frontend requests
app.use(bodyParser.json());

// Create tables if not exist
connection.query(`
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
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

// -------- LOGIN / REGISTER --------
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  connection.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User registered successfully' });
    }
  );
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  connection.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    }
  );
});

// -------- CONTACT FORM --------
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  connection.query(
    'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Message sent successfully' });
    }
  );
});

// -------- START SERVER --------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
