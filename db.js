const mysql = require('mysql2');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
};

// LOGIN DATABASE
const loginDB = mysql.createConnection({
  ...config,
  database: 'website_db'
});

// CONTACT DATABASE
const contactDB = mysql.createConnection({
  ...config,
  database: 'contact_db'
});

loginDB.connect(err => {
  if (err) console.log('Login DB Error:', err);
  else console.log('Login DB Connected');
});

contactDB.connect(err => {
  if (err) console.log('Contact DB Error:', err);
  else console.log('Contact DB Connected');
});

module.exports = { loginDB, contactDB };
