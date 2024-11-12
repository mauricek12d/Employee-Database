INSERT INTO Department (employee_name) 
VALUES ('Engineering'),
('Sales'), 
('Finance'), 
('Legal');

INSERT INTO Role (department_id, title, salary)
VALUES (1, 'Lead Engineer', 100000),
(1, 'Senior Engineer', 120000),
(1, 'Account Manager', 150000),
(2, 'Salesperson', 80000),
(2, 'Sales Lead', 120000),
(3, 'Accountant', 125000),
(3, 'Finance Lead', 150000),
(4, 'Legal Team Lead', 125000),
(4, 'Lawyer', 190000);

INSERT INTO Employee (role_id, first_name, last_name, manager_id) 
VALUES (1, 'Jim', 'Hannon', NULL),
(2, 'Jane', 'Smith', 1),
(3, 'David', 'Taylor', 2),
(4, 'Ken', 'Cunningham', 2),
(5, 'Jennifer', 'Cooke', 3),
(6, 'Malia', 'Singh', 3),
(7, 'Tom', 'Allen', 3),
(8, 'Kevin', 'Lourd', 4),
(9, 'Sabrina', 'Chan', 4),
(10, 'Jocelyn', 'Lewis', 4);
