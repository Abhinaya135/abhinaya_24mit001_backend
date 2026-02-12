// db.js
const mysql = require('mysql2');

// Use environment variables for security
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'maglev.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'DtSwIQBGuKAkGJlhZpuFKarMzdbSTKdY',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 27507,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // stop server if DB connection fails
  }
  console.log('Connected to MySQL database!');
});

module.exports = connection;
