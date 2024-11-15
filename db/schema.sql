DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

\c employee_db;

CREATE TABLE Department (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE Role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL
);

CREATE TABLE Employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30)NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER
);

INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('Jim', 'Hannon', 1, NULL);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, 1);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('David', 'Taylor', 3, 2);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('Ken', 'Cunningham', 4, 2);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('Jennifer', 'Cooke', 5, 3);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('Malia', 'Singh', 6, 3);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('Tom', 'Allen', 7, 3);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('Kevin', 'Lourd', 8, 4);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('Sabrina', 'Chan', 9, 4);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('Jocelyn', 'Lewis', 10, 4);



CREATE VIEW EmployeeDetails AS 
SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    role.salary,
    role.title, 
    department.department_name,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name 
    
FROM 
    employee 
JOIN 
    role ON employee.role_id = role.id
JOIN
    department ON role.department_id = department.id
LEFT JOIN
    employee manager ON employee.manager_id = manager.id;

  INSERT INTO Department (department_name) 
VALUES 
('Engineering'),
('Sales'), 
('Finance'), 
('Legal');

INSERT INTO Role (department_id, title, salary)
VALUES 
(1, 'Lead Engineer', 100000),
(1, 'Senior Engineer', 120000),
(1, 'Account Manager', 150000),
(2, 'Salesperson', 80000),
(2, 'Sales Lead', 120000),
(3, 'Accountant', 125000),
(3, 'Finance Lead', 150000),
(4, 'Legal Team Lead', 125000),
(4, 'Lawyer', 190000);  

SELECT * FROM EmployeeDetails;