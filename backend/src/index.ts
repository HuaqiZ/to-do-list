const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Create an Express app
const app = express();
const PORT = 9000;

// Use CORS to allow cross-origin requests from the frontend
app.use(cors());

// Use JSON middleware to parse request bodies
app.use(express.json());

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost', // Your MySQL host, e.g., 'localhost'
  user: 'root', // Your MySQL username
  password: 'Ellen403', // Your MySQL password
  database: 'toDoList' // Your MySQL database name
});
// const publicFields = ["content", "date", "status", "display_order" ]

// Connect to the database
db.connect((err: any) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Example API route to fetch all records from the 'list' table
app.get('/', (req: any, res: any) => {
  db.query('SELECT content, date, status, display_order FROM list', (err: any, results: any) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    res.json(results);
  });
});

// Example API route to insert a new record into the 'list' table
app.post('/add', (req: any, res: any) => {
  console.log('Received data:', req.body); 
  const { content, date, status, display_order } = req.body;
  const query = 'INSERT INTO list (content, date, status, display_order) VALUES (?, ?, ?, ?)';
  db.query(query, [content, date, status, display_order], (err: any, results: any) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.status(201).json({ message: 'Record inserted successfully', id: results.insertId });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
