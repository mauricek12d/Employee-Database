import dotenv from 'dotenv';
dotenv.config();

import pg, { QueryResult } from 'pg';
const { Pool } = pg;

import inquirer from 'inquirer';

import 'console.table';


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
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Exit'],
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
    else if (action === 'Add Department') {
      await addDepartment();
    } else if (action === 'Add Role') {
      await addRole();
    } else if (action === 'Add Employee') {
      await addEmployee();
    } else if (action === 'Update Employee Role') {
      await updateEmployeeRole();
    }
    else {
      process.exit(0);
    }
    await connectToDb();
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
    const result: QueryResult = await pool.query('SELECT * FROM EmployeeDetails');
    console.table(result.rows);
  } catch (error) {
    console.error('Error querying the database: ', error);
  }
}
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

    const query = 'INSERT INTO department (department_name) VALUES ($1) RETURNING id';
    const values = [departmentName];
    const res = await pool.query(query, values);
    console.log(`Department ${departmentName} added successfully`);
    return res.rows[0].id;
} catch (error) {
    console.error('Error querying the database: ', error);
    throw error;
  }
};

// function to add a role
const addRole = async () => {
    let { roleName: title, salary, departmentId } = await inquirer.prompt([
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
    } else {
     const departmentResult = await pool.query('SELECT id FROM department WHERE department_name = $1', [departmentId]);
      departmentId = departmentResult.rows[0].id;
    }

    const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
    const values = [title, salary, departmentId];
    await pool.query(query, values);
    console.log(`Role ${title} added successfully to department ${departmentId}`);
};

// function to add an employee
const addEmployee = async () => {
    let { employeeName: firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'employeeName',
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
    } else {
      const roleResult = await pool.query('SELECT id FROM role WHERE title = $1', [roleId]);
      if (roleResult.rows.length === 0) {
        console.error('Role not found');
        return;
      }
      roleId = roleResult.rows[0].id;
    }
    console.log(`Looking up manager with id: ${managerId}`);
    const managerResult = await pool.query('SELECT id FROM employee WHERE first_name = $1', [managerId]);
    if (managerResult.rows.length === 0) {
      console.error('Manager not found');
      return;
    }
    managerId = managerResult.rows[0].id;

    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
    const values = [firstName, lastName, roleId, managerId];
    await pool.query(query, values);
    console.log(`Employee ${firstName} ${lastName} added successfully with role ${roleId} and manager ${managerId}`);
};

// function to update an employee's role
const updateEmployeeRole = async () => {
    try {
        const { employeeName, roleId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'employeeName',
                message: 'What is the employee\'s name?',
            },
            {
                type: 'list',
                name: 'roleId',
                message: 'What is the employee\'s new role?',
                choices: ['Sales Lead', 'Lead Engineer', 'Senior Engineer', 'Account Manager', 'Salesperson', 'Accountant', 'Finance Lead', 'Legal Team Lead', 'Lawyer'],
            },
        ]);

        // Look up the employee ID based on the employee name
        console.log(`Looking up employee with name: ${employeeName}`);
        const employeeResult = await pool.query('SELECT id FROM employee WHERE first_name || \' \' || last_name = $1', [employeeName]);
        if (employeeResult.rows.length === 0) {
            console.error('Employee not found');
            return;
        }
        const employeeId = employeeResult.rows[0].id;

        // Look up the role ID based on the role title
        console.log(`Looking up role with title: ${roleId}`);
        const roleResult = await pool.query('SELECT id FROM role WHERE title = $1', [roleId]);
        if (roleResult.rows.length === 0) {
            console.error('Role not found');
            return;
        }
        const newRoleId = roleResult.rows[0].id;

        // Update the employee's role
        const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
        const values = [newRoleId, employeeId];
        await pool.query(query, values);
        console.log(`Employee ${employeeName} updated successfully to role ${roleId}`);
    } catch (error) {
        console.error('Error updating employee role:', error);
        throw error;
    }
};

export { pool, connectToDb, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole };