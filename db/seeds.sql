INSERT INTO department(name)
VALUES  ("Operations"),
        ("Traffic"),
        ("Transmitter Manager"),
        ("Engineering"),
        ("Business Manager"),
        ("Accounting"),
        ("Analytics");

INSERT INTO employee_role(title, salary, department_id)
VALUES  ("Systems Programmer", 110000, 1 ),
        ("Traffic Manager", 120000, 2),
        ("Server-side Operator", 150000, 3 ),
        ("Accountant", 130000, 6),
        ("Analytic Instructor", 95000, 7),
        ("Back-end Engineer", 140000, 4),
        ("Front-end Engineer", 125000, 4),
        ("Sales Lead", 100000, 5);

INSERT INTO my_employee(first_name, last_name, role_id, manager_id)
VALUES  ("John", "Doe", 1, 1),
        ("Jane", "Doe", 2, 1),
        ("Jen", "Test", 4, 1),
        ("Jay", "Test", 3, 1);

        

