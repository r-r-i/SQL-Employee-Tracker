import express from 'express';
import mysql from 'mysql2';
import path from 'path';
// require('dotenv').config();
import 'dotenv/config'

const PORT = process.env.PORT || 3001;
const app = express();

// Import custom middleware
// app.use(clog)

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    // This is a console log that confirms database connection.
    console.log(`Connected to the company_db database.`)
  );

    // Port listener
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });