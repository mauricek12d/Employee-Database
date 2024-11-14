import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

import inquirer from 'inquirer';

import 'console.table';

import fs from 'fs';
import path from 'path';


// The Pool class is used to create a new pool of connections to the database
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  database: process.env.DB_NAME,
  port: 5432,
});

// connect to the database
const connectToDb = async () => {
  try {
    await pool.connect();
    console.log('What would you like to do?');

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Select an action',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
      },
    ]);

    console.log('You selected: ', action);

    if (action === 'View All Departments') {
      await viewAllDepartments();
    } else if (action === 'View All Roles') {
      await viewAllRoles();
    } else if (action === 'View All Employees') {
      await viewAllEmployees();
    }
  } catch (error) {
    console.error('Error connecting to the database: ', error);
    process.exit(1);
  }
};

// function to view all departments
const viewAllDepartments = async () => {  
  try {
    const result = await pool.query('SELECT * FROM department');
    console.table(result.rows);
  } catch (error) {
    console.error('Error querying the database: ', error);
  }
};

// function to view all roles
const viewAllRoles = async () => {
  try {
    const result = await pool.query('SELECT * FROM role');
    console.table(result.rows);
  } catch (error) {
    console.error('Error querying the database: ', error);
  }
};

// function to view all employees
const viewAllEmployees = async () => {  
  try {
    const query = fs.readFileSync(path.join(__dirname, 'query.sql'), 'utf8');
    const result = await pool.query(query);
    console.table(result.rows);
  } catch (error) {
    console.error('Error querying the database: ', error);
  }
};

// function to add a department
const addDepartment = async () => { 
  try {
    const { departmentName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?',
      },
    ]);

    const query = 'INSERT INTO department (name) VALUES ($1) RETURNING id';
    const values = [departmentName];
    const res = await pool.query(query, values);
    console.log(`Department ${departmentName} added successfully`);
    return res.rows[0].id;
  } catch (error) {
    console.error('Error querying the database: ', error);
  }
};

// function to add a role
const addRole = async () => {
  try {
    let { roleName, salary, departmentId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this role?',
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'What department does this role belong to?',
        choices: ['Engineering', 'Finance', 'Legal', 'Sales', 'Add new department'],
      },
    ]);

    if (departmentId === 'Add new department') {
      departmentId = await addDepartment();
    }

    const query = 'INSERT INTO role (name, salary, department_id) VALUES ($1, $2, $3)';
    const values = [roleName, salary, departmentId];
    await pool.query(query, values);
    console.log(`Role ${roleName} added successfully to department ${departmentId}`);
  } catch (error) {
    console.error('Error querying the database: ', error);
  }
};

// function to add an employee
const addEmployee = async () => {
  try {
    let { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'What is the employee\'s first name?',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is the employee\'s last name?',
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'What is the employee\'s role?',
        choices: ['Sales Lead', 'Lead Engineer', 'Senior Engineer', 'Account Manager', 'Salesperson', 'Accountant', 'Finance Lead', 'Legal Team Lead', 'Lawyer',  'Add new role'],
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Who is the employee\'s manager?',
        choices: ['Jane Smith', 'David Taylor', 'Ken Cunningham'],
      },
    ]);

    if (roleId === 'Add new role') {
      roleId = await addRole();
    }

    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
    const values = [firstName, lastName, roleId, managerId];
    await pool.query(query, values);
    console.log(`Employee ${firstName} ${lastName} added successfully`);
  } catch (error) {
    console.error('Error querying the database: ', error);
  }
};

// function to update an employee's role
const updateEmployeeRole = async () => {
  try {
    const { employeeId, roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Which employee would you like to update?',
        choices: ['Jim Hannon', 'Jane Smith', 'David Taylor', 'Ken Cunningham', 'Jennifer Cooke', 'Malia Singh', 'Tom Allen', 'Kevin Lourd', 'Sabrina Chan', 'Jocelyn Lewis'],
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'What is the employee\'s new role?',
        choices: ['Sales Lead', 'Lead Engineer', 'Senior Engineer', 'Account Manager', 'Salesperson', 'Accountant', 'Finance Lead', 'Legal Team Lead', 'Lawyer'],
      },
    ]);

    const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
    const values = [roleId, employeeId];
    await pool.query(query, values);
    console.log(`Employee ${employeeId} updated successfully`);
  } catch (error) {
    console.error('Error querying the database: ', error);
  }
};

export { pool, connectToDb, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole };