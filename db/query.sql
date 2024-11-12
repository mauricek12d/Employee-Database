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