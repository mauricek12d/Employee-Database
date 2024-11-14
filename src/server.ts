import express from 'express';
import { QueryResult } from 'pg';
import inquirer from 'inquirer';
import { pool, connectToDb } from './connections.js';

await connectToDb();

// Defines the port
const PORT = process.env.PORT || 3001; 
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());

const promptUser = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select an action',
      choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
    },
  ]);
  return action;
};

// request to the root
app.get('/', async (_req, res) => {
  const action = await promptUser();
  res.json({ action });
});

// function to get all departments
app.get('/departments', async (_req, res) => { 
  try {
    const result: QueryResult = await pool.query('SELECT * FROM departments');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query: ', error);
    res.status(500).json({ error: 'Error executing query' });
  }
});

// function to get all roles
app.get('/roles', async (_req, res) => {
  try {
    const result: QueryResult = await pool.query('SELECT * FROM roles');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query: ', error);
    res.status(500).json({ error: 'Error executing query' });
  }
});

// function to get all employees
app.get('/employees', async (_req, res) => {
  try {
    const result: QueryResult = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query: ', error);
    res.status(500).json({ error: 'Error executing query' });
  }
});

// function to get all employees by department
app.post('/departments', async (req, res) => { 
    const { name } = req.body;
    try {
        const result: QueryResult = await pool.query('INSERT INTO departments (name) VALUES ($1) RETURNING *', [name]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error executing query: ', error);
        res.status(500).json({ error: 'Error executing query' });
    }
    });

    // function to add a new role
app.post('/roles', async (req, res) => {
    const { title, salary, department_id } = req.body;
    try {
        const result: QueryResult = await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [title, salary, department_id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error executing query: ', error);
        res.status(500).json({ error: 'Error executing query' }); 
    }
});

// function to add a new employee
app.post('/employees', async (req, res) => {
    const { first_name, last_name, role_id, manager_id } = req.body;
    try {
        const result: QueryResult = await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, role_id, manager_id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error executing query: ', error);
        res.status(500).json({ error: 'Error executing query' });
    }
});

// function to add a new department
app.put('/departments/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result: QueryResult = await pool.query('UPDATE departments SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error executing query: ', error);
        res.status(500).json({ error: 'Error executing query' });
    }
});

app.use((_req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {  
});