require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const jwt = require("jsonwebtoken");
const cors = require('cors');
const bcrypt = require("bcryptjs");
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')

// Create an Express app
const app = express();
const PORT = 8080;

// Use CORS to allow cross-origin requests from the frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

// Use JSON middleware to parse request bodies
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ["root"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'strict',
  httpOnly: true,
  secure: false
}))
app.use(cookieParser());


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

app.get('/auth/check', (req: any, res: any) => {
  if(req.cookies.user) {
    try {
      const decoded = jwt.verify(req.cookies.user, process.env.JWTSECRET);
      req.user = decoded;
      res.json({ user: req.user });
    } catch (err) {
      req.user = null;
      console.log("JWT verification failed:", err);
      res.status(401).json({ message: "JWT verification failed" });
    }
  } else {
    req.user = null;
    res.status(401).json({ message: "No token provided" });
  }
})

// Simulated login route
app.post("/auth/signup", (req: any, res: any) => {
  let { username, email, password } = req.body;
  const query = 'INSERT INTO users(username, email, password_hash) VALUES (?, ?, ?)';
  const salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);

  db.query(query, [username, email, password], (err: any, result: any) => {
    if(err) {
      console.error("Error inserting into list:", err);
      return res.status(500).json({ error: "Failed to insert task" });
    }

    const user = { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, id: result.insertId, username: username, email: email };
    const token = jwt.sign(user, process.env.JWTSECRET);
    req.session.user = {token};

    res.cookie("user", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'Strict'
    });

    res.json({
      message: "Sign Up successful",
      user: {
        id: result.insertId,
        username: username,
        email: email,
      }
    });
  })
});

app.post("/auth/login", (req: any, res: any) => {
  let { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?'
  db.query(query, [email], (err: any, result: any) => {
    if(err) {
      console.error("Error login", err);
      return res.status(500).json({ error: 'Failed to login'});
    }

    if(!result) {
      //not email matched
    }

    const matchOrNot = bcrypt.compareSync(password, result[0].password_hash);

    if(!matchOrNot) {
      return res.status(500).json({ error: 'Failed to login'});
    }

    const user = { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, id: result[0].user_id, username: result[0].username, email: email };
    const token = jwt.sign(user, process.env.JWTSECRET);
    req.session.user = {token};

    res.cookie("user", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'Strict'
    });

    res.json({ message: "Sign Up in successfully", result });
  })
})

// Example API route to fetch all records from the 'list' table
app.get('/tasks', (req: any, res: any) => {
  let query = 'SELECT id, content, due_date, priority, task_name, user_id FROM list';
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

// app.post('/task/update-order', (req: any, res: any) => {
//   const { tasks } = req.body; // Expecting an array of { id, display_order }

//   if (!Array.isArray(tasks) || tasks.length === 0) {
//     return res.status(400).json({ error: "Invalid data format" });
//   }

//   let query = `UPDATE list SET display_order = CASE `;
//   const values: number[] = [];

//   tasks.forEach(({ id, display_order }) => {
//     query += `WHEN id = ? THEN ? `;
//     values.push(id, display_order);
//   });

//   query += `END WHERE id IN (${tasks.map(() => "?").join(",")})`;

//   db.query(query, [...values, ...tasks.map(task => task.id)], (err: any, results: any) => {
//     if (err) {
//       res.status(500).json({ error: 'Database query error', details: err });
//       return;
//     }
//     res.json({ message: "Order updated successfully", results });
//   });
// });

app.get('/:user/labels', (req: any, res: any) => {
  let query = `SELECT id, name, color FROM labels WHERE user_id = ${req.params.user}`;
  db.query(query, (err: any, results: any) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    res.json(results);
  });
});

app.post('/label/update-label-setting', (req: any, res: any) => {
  const {labelName, color, labelId, userId} = req.body;

  let query = "";
  if(labelId) {
    query = `UPDATE labels SET name = ?, color = ? WHERE user_id = ${userId} AND id = ? `;
  }else{
    query = `INSERT INTO labels (name, color, user_id) VALUES (?, ?, ?)`;
  }

  db.query(query, [labelName, color, labelId], (err: any, result: any) => {
    if(err) {
      console.error("Error inserting into list:", err);
      return res.status(500).json({ error: "Failed to insert task" });
    }
    res.json({ message: "Update label ok", result });
  })
})

app.get('/:user/display-setting', (req: any, res: any) => {
  let query = `SELECT show_label_colors, show_completed_tasks FROM users WHERE user_id = ${req.params.user}`;
  db.query(query, (err: any, results: any) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    res.json(results);
  });
});

app.post('/display-setting', (req: any, res: any) => {
  const {showLabelColor, showCompletedTask, userId} = req.body;
  
  let query = `UPDATE users SET show_label_colors = ${showLabelColor === true ? 1 : 0}, show_completed_tasks = ${showCompletedTask === true ? 1 : 0} WHERE user_id = ${userId}`

  db.query(query, (err: any, results: any) => {
    if (err) {
      res.status(500).json({ error: 'Database query error', details: err });
      return;
    }
    res.json({ message: "Display Setting Updated Successfully", results });
  })
});

app.post('/add', (req: any, res: any) => {
  const { task_name, content, due_date, priority, label, user_id } = req.body;
  const formattedDueDate = new Date(due_date).toISOString().split('T')[0];
  const insertTaskQuery = `
    INSERT INTO list (task_name, content, due_date, priority, user_id) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(insertTaskQuery, [task_name, content, formattedDueDate, priority, user_id], (err: any, results: any) => {
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
