SELECT 
    employee.id, 
    employee.name, 
    role.title, 
    department.name AS department_name
FROM 
    employee
JOIN 
    role ON employee.role_id = role.id
JOIN 
    department ON role.department_id = department.id;