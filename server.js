require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(__dirname));

// PostgreSQL database configuration
// Credentials are now loaded from the .env file securely
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Check database connection and create table on startup
pool.connect(async (err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Successfully connected to the PostgreSQL database!');
    
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Contacts table verified/created successfully!');
    } catch (tableErr) {
        console.error('Failed to create table:', tableErr);
    }
    
    release();
});

// Endpoint to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert into the 'contacts' table
    const query = `
      INSERT INTO contacts (name, email, message, timestamp) 
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [name, email, message];
    
    const result = await pool.query(query, values);

    // Send success response
    res.status(201).json({ 
        message: 'Message saved successfully', 
        data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: error.message || 'Database error occurred' });
  }
});

// Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    console.log(`Don't forget to create your 'portfolio_db' database and 'contacts' table!`);
  });
}

module.exports = app;
