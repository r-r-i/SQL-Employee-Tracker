SELECT department.name AS department, employee_role.title, employee_role.salary
FROM employee_role
LEFT JOIN department
ON employee_role.department_id = department.id
ORDER BY department.name; 


SELECT department.name AS department, employee_role.title, employee_role.salary, my_employee.first_name, my_employee.last_name, manager_id
FROM department
INNER JOIN employee_role
ON department.id = employee_role.department_id
LEFT JOIN my_employee
ON employee_role.id = my_employee.role_id;
































SELECT 
    department.name AS department,
    employee_role.title AS title,
    employee_role.salary AS salary
FROM 
    employee_role
INNER JOIN
    department
ON 
    employee_role.department_id = department.id
INNER JOIN
    employee_role
ON
    my_employee.role_id = employee_role.id
ORDER BY 
    department.id;


SELECT department.name AS department, employee_role.title, employee_role.salary, my_employee.first_name, my_employee.last_name
    FROM employee_role
    INNER JOIN department
    ON employee_role.department_id = department.id
    INNER JOIN my_employee
    ON employee_role.id = my_employee.role_id;
    






    SELECT pa.ProjectID, p.Project_Title, a.Account_ID, a.Username, a.Access_Type, c.First_Name, c.Last_Name
      FROM Project_Assigned pa
INNER JOIN Account a
        ON pa.AccountID = a.Account_ID
INNER JOIN Project p
        ON pa.ProjectID = p.Project_ID
INNER JOIN Clients c
        ON a.Account_ID = c.Account_ID
     WHERE a.Access_Type = 'Client';



