const express = require('express');
const mysql = require('mysql2');
const { clog } = require('./middleware/clog');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

// Import custom middleware
app.use(clog)

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'braker99',
      database: 'company_db'
    },
    // This is a console log that confirms database connection.
    console.log(`Connected to the company_db database.`)
  );




    // Port listener
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });