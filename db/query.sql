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