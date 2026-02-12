const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { loginDB, contactDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Backend running successfully 🚀');
});

// LOGIN API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username=? AND password=?';
  loginDB.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid login' });
    }
  });
});

// CONTACT API
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  const sql = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
  contactDB.query(sql, [name, email, message], err => {
    if (err) return res.status(500).json({ error: err });

    res.json({ success: true, message: 'Message sent successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
