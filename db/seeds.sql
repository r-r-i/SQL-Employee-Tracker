INSERT INTO department(name)
VALUES  ("Marketing"),
        ("Sales"),
        ("Front end"),
        ("Back end");

INSERT INTO employee_role(title, salary, department_id)
VALUES  ("Intern", "50000", 2),
        ("Junior", "120000", 1),
        ("Senior", "150000", 3),
        ("Manager", "200000", 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ("John", "Doe", 2, 3),
        ("Jane", "Doe", 4, 1),
        ("Jen", "Doe", 1, 2),
        ("Jay", "Doe", 3, 2);

