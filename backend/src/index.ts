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
  let query = 'SELECT id, content, due_date, status, display_order, task_name, user_id FROM list';
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

app.get('/users/:userId/labels', (req: any, res: any) => {
  const userId = req.params.userId;
  const query = `
    SELECT DISTINCT l.id, l.name, l.color
    FROM labels l
    JOIN task_labels tl ON l.id = tl.label_id
    JOIN list t ON tl.task_id = t.id
    WHERE t.user_id = ?;
  `;

  db.query(query, [userId], (err: any, results: any) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});



app.post('/update-order', (req: any, res: any) => {
  const { tasks } = req.body; // Expecting an array of { id, display_order }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  let query = `UPDATE list SET display_order = CASE `;
  const values: number[] = [];

  tasks.forEach(({ id, display_order }) => {
    query += `WHEN id = ? THEN ? `;
    values.push(id, display_order);
  });

  query += `END WHERE id IN (${tasks.map(() => "?").join(",")})`;

  db.query(query, [...values, ...tasks.map(task => task.id)], (err: any, results: any) => {
    if (err) {
      res.status(500).json({ error: 'Database query error', details: err });
      return;
    }
    res.json({ message: "Order updated successfully", results });
  });
});


// Example API route to insert a new record into the 'list' table
app.post('/add', (req: any, res: any) => {
  const { task_name, content, due_date, status, display_order, label, user_id } = req.body;
  const formattedDueDate = new Date(due_date).toISOString().split('T')[0];
  const insertTaskQuery = `
    INSERT INTO list (task_name, content, due_date, status, display_order, user_id) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(insertTaskQuery, [task_name, content, formattedDueDate, status, display_order, user_id], (err: any, results: any) => {
    if (err) {
      console.error("Error inserting into list:", err);
      return res.status(500).json({ error: "Failed to insert task" });
    }

    const newTaskId = results.insertId;
    const insertTaskLabelQuery = `
      INSERT INTO task_labels (task_id, label_id) VALUES (?, ?)
    `;

    db.query(insertTaskLabelQuery, [newTaskId, label.id], (err: any) => {
      if (err) {
        console.error("Error inserting into task_label:", err);
        return res.status(500).json({ error: "Failed to insert task label" });
      }

      res.status(201).json({ message: "Task and label added successfully", task_id: newTaskId });
    });
  })
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
