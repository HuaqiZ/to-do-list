const express = require('express');
const mysql = require('mysql2');
const jwt = require("jsonwebtoken");
const cors = require('cors');
const bcrypt = require("bcryptjs");

// Create an Express app
const app = express();
const PORT = 8080;

// Use CORS to allow cross-origin requests from the frontend
app.use(cors());

// Use JSON middleware to parse request bodies
app.use(express.json());
const SECRET_KEY = process.env.JWT_SECRET || "pass";

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'to_do_list',
  port: 3306,
});

db.connect((err: any) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
  }
});

// Simulated login route
app.post("/auth/login", (req: any, res: any) => {
  const user = { id: 1, username: "testuser" };
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Example API route to fetch all records from the 'list' table
app.get('/tasks', (req: any, res: any) => {
  let query = 'SELECT content, due_date, status, display_order, task_name FROM list';
  if(req.query.filterByField && req.query.filterByValue) {
    query += ` WHERE ${req.query.filterByField}=${req.query.filterByValue}`
  }
  if(req.query.limit) {
    query += ` limit ${req.query.limit}`
  }
  if(req.query.offset) {
    query += ` offset ${req.query.offset}`
  }
  db.query(query, (err: any, results: any) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    res.json(results);
  });
});

// Example API route to insert a new record into the 'list' table
// app.post('/add', (req: any, res: any) => {
//   console.log('Received data:', req.body); 
//   const { content, date, status, display_order } = req.body;
//   const query = 'INSERT INTO list (content, date, status, display_order) VALUES (?, ?, ?, ?)';
//   db.query(query, [content, date, status, display_order], (err: any, results: any) => {
//     if (err) {
//       res.status(500).json({ error: err });
//       return;
//     }
//     res.status(201).json({ message: 'Record inserted successfully', id: results.insertId });
//   });
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
