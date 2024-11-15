import express from 'express';
import inquirer from 'inquirer';
import { pool, connectToDb } from './connections.js';
await connectToDb();
// Defines the port
const PORT = process.env.PORT || 3001;
const app = express();
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Function to start the server
const startServer = async () => {
    await connectToDb();
    // request to the root
    app.get('/', async (_req, res) => {
        const action = await promptUser();
        res.json({ action });
    });
    // function to get all departments
    app.get('/departments', async (_req, res) => {
        try {
            const result = await pool.query('SELECT * FROM departments');
            res.json(result.rows);
        }
        catch (error) {
            console.error('Error executing query: ', error);
            res.status(500).json({ error: 'Error executing query' });
        }
    });
    // function to get all roles
    app.get('/roles', async (_req, res) => {
        try {
            const result = await pool.query('SELECT * FROM roles');
            res.json(result.rows);
        }
        catch (error) {
            console.error('Error executing query: ', error);
            res.status(500).json({ error: 'Error executing query' });
        }
    });
    // function to get all employees
    app.get('/employees', async (_req, res) => {
        try {
            const result = await pool.query('SELECT * FROM EmployeeDetails');
            res.json(result.rows);
        }
        catch (error) {
            console.error('Error executing query: ', error);
            res.status(500).json({ error: 'Error executing query' });
        }
    });
    // function to add a new role
    app.put('/roles', async (req, res) => {
        const { title, salary, department_id } = req.body;
        const result = await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [title, salary, department_id]);
        res.json(result.rows[0]);
    });
    // function to add a new employee
    app.put('/employees', async (req, res) => {
        const { first_name, last_name, role_id, manager_id } = req.body;
        const result = await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, role_id, manager_id]);
        res.json(result.rows[0]);
    });
    // function to add a new department
    app.put('/departments/:id', async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const result = await pool.query('UPDATE departments SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
            res.json(result.rows[0]);
        }
        catch (error) {
            console.error('Error executing query: ', error);
            res.status(500).json({ error: 'Error executing query' });
        }
    });
    const promptUser = async () => {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Select an action',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
            }
        ]);
        console.log(`User selected action: ${action}`);
        return action;
    };
    app.use((_req, res) => {
        res.status(404).end();
    });
    app.listen(PORT, () => {
    });
};
startServer();
