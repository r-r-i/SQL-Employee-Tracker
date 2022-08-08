import express from 'express';
import mysql from 'mysql2';
import path from 'path';
import 'dotenv/config';
import inquirer from 'inquirer';
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    // Confirming database connection.
    console.log(`Connected to the company_db database.`)
  );
// Prompt that asks the user what they want to do
const initialPrompt = () => {
  return inquirer.prompt([
      {
          type: 'list',
          message: "What would you like to do?",
          name: "choice",
          choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
      }
  ]).then((data) => {
      if(data.choice === 'View all departments'){ 
          viewDepartment();
      } else if (data.choice === 'View all roles'){ 
          viewRole();
      } else if (data.choice === 'View all employees'){ 
          viewEmployee();
      } else if (data.choice === 'Add a department'){ 
          promptDepartment();
      } else if (data.choice === 'Add a role'){ 
          promptRole();
      } else if (data.choice === 'Add an employee'){
          promptEmployee();
      } else if (data.choice === 'Update an employee role'){
          updateEmployee();
      }
  });
}
// Prompt that allows the user to add a new employee to the database
const promptEmployee = () => {
  let roleArray = [];
  let managerArray = [];

  db.query("SELECT * FROM employee_role;", function (error, results){
    for (let i = 0; i < results.length; i++){
      roleArray.push(results[i].title);
    }
    db.query("SELECT * FROM my_employee;", function (error, results){
      for (let i = 0; i < results.length; i++){
        let newEmployee = `${results[i].first_name} ${results[i].last_name}`
        managerArray.push({
          value: results[i].id,
          name: newEmployee
        });
      }
      return inquirer.prompt([
        {
          type:'input',
          message: 'What is the employee`s first name?',
          name: 'firstName'
        },
        {
          type: 'input',
          message: 'What is the employee`s last name?',
          name: 'lastName'
        },
        {
          type: 'list',
          message: 'What is this employee`s role?',
          name: 'role',
          choices: roleArray
        },
        {
          type: 'list',
          message: 'Does this employee have a manager?',
          name: 'employeeManager',
          choices: ['Yes', 'No']
        }
      ]).then((answers1) => {
        let managerName = null;
        if (answers1.employeeManager === 'Yes'){
          return inquirer.prompt([
            {
              type: 'list',
              message: 'Select the employee`s manager from the list below',
              name: 'manager',
              choices: managerArray
            }
          ]).then((answers2) => {
            managerName = answers2.manager;
            db.query(`SELECT id FROM employee_role WHERE employee_role.title = ?;`, answers1.role, (error, results) => {
              if (error) throw error;
              let role_id = results[0].id;
              db.query('INSERT INTO my_employee SET ?;', {
                first_name: answers1.firstName,
                last_name: answers1.lastName,
                role_id: role_id,
                manager_id: managerName,
              }),
              console.log(`Added ${answers1.firstName} ${answers1.lastName} to database`)
              initialPrompt()
            })
          })
        }
      })
    })
  })
}
// Prompt that allows the user to add a new role to the database
const promptRole = () => {
  let departments = [];
  db.query("SELECT * FROM department;" , function (error, results){
    for (let i = 0; i < results.length; i++){
      departments.push(results[i].name);
    };
  });
  return inquirer.prompt([
      {
          type: 'input',
          message: 'What is the name of the role you are adding?',
          name: 'name'
      },
      {
          type: 'input',
          message: 'What is the yearly salary for this role?',
          name: 'salary'
      },
      {
          type: 'list',
          message: 'What department does this role belong to?',
          name: 'empDepartment',
          choices: departments
      }
  ]).then(function(answers){
    db.query("SELECT id FROM department WHERE department.name = ?", answers.empDepartment, (err, results) => {
      let department = results[0].id
      db.query("INSERT INTO employee_role SET ?", {
        title: answers.name,
        salary: answers.salary,
        department_id: department,
      },function(error) {
        if (error) throw error;
        console.log(`Added ${answers.name} to the database`);
        initialPrompt();
      });
    });
  });
}
// Prompt that allows the user to add a department to the database
const promptDepartment = () => {
  return inquirer.prompt([
      {
          type: 'input',
          message: 'What is the name of the department?',
          name: 'department',
      }
  ]).then(function(answers){
    db.query("INSERT INTO department SET ?", {
      name: answers.department,
    }, function(error){
      if (error) throw error;
      console.log(`Added ${answers.department} to the database`);
      initialPrompt();
    });
  });
}
// Function that allows the user to update an employee's role
const updateEmployee = () => {
  const roleArray = [];
  const employeeArray = [];

  db.query("SELECT * FROM employee_role;", (error, results) => {
    for (let i = 0; i< results.length; i++){
      roleArray.push(results[i].title);
    }
    db.query("SELECT * FROM my_employee;", (error, results) => {
      for (let i = 0; i < results.length; i++){
        let newEmployee = `${results[i].first_name} ${results[i].last_name}`
        employeeArray.push({
          value: results[i].id,
          name: newEmployee
        });
      }
      return inquirer.prompt([
        {
          type: 'list',
          message: 'Which employee`s role would do you want to update?',
          name: 'employeeRole',
          choices: employeeArray
        },
        {
          type: 'list',
          message: 'Which role do you want to assign the selected employee?',
          name: 'newRole',
          choices: roleArray
        }
      ]).then((answers) => {
        db.query("UPDATE employee_role SET title = ? WHERE id = ?;", [answers.newRole, answers.employeeRole], (error, results) => {
          if (error) throw error;
          console.log("Updated employee role");
          initialPrompt()
        })
      })
    })
  })
}
// Function that allows the user to view all departments from the database
const viewDepartment = () => {
  db.query("SELECT * FROM department;", function(error, results){
    if (error) throw error;
    console.table(results);
    initialPrompt();
  })
}
// Function that allows the user to view all roles from the database
const viewRole = () => {
  db.query("SELECT department.name AS department, employee_role.title, employee_role.salary FROM employee_role LEFT JOIN department ON employee_role.department_id = department.id ORDER BY department.name; ", function(error, results){
    if (error) throw error;
    console.table(results);
    initialPrompt();
  });
}
// Function that allows the user to view all employees from the database
const viewEmployee = () => {
  db.query("SELECT department.name AS department, employee_role.title, employee_role.salary, employee.first_name, employee.last_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM department INNER JOIN employee_role ON department.id = employee_role.department_id INNER JOIN my_employee AS employee ON employee_role.id = employee.role_id INNER JOIN my_employee AS manager ON employee.manager_id = manager.id;", function(error, results){
    if (error) throw error;
    console.table(results);
    initialPrompt();
  });
}
  // If response is bad, send '404'.
  app.use((req, res) => {
    res.status(404).end();
  });

  // Function to start app
  const init = () => {
    initialPrompt()
  }

// Start app
init();


