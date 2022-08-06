import express from 'express';
import mysql from 'mysql2';
import path from 'path';
import 'dotenv/config';
import inquirer from 'inquirer';



const PORT = process.env.PORT || 3001;
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
    // This is a console log that confirms database connection.
    console.log(`Connected to the company_db database.`)
  );


// Prompt that asks the user what they want to do
const initialPrompt = () => {
  return inquirer.prompt([
      {
          type: 'list',
          message: "What would you like to do?",
          name: "choice",
          choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
      }
  ]).then((data) => {
      if(data.choice === 'View all departments'){ 
          viewDepartment();
      } else if (data.choice === 'View all roles'){ // Working, but 'department' column doesn't show department name
          viewRole();
      } else if (data.choice === 'View all employees'){ // Working, but 'role' and 'manager' column not referencing correctly.
          viewEmployee();
      } else if (data.choice === 'Add a department'){ // Working
          promptDepartment();
      } else if (data.choice === 'Add a role'){ // Working
          promptRole();
      } else if (data.choice === 'Add an employee'){ // Working
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
  db.query("SELECT * FROM employee_role;", function (error, results) {
    for (let i = 0; i < results.length; i++){
      roleArray.push(results[i].title);
    }
  });
  db.query("SELECT * FROM employee;", function (error, results){
    for (let i = 0; i < results. length; i++){
      managerArray.push(results[i].manager);
    }
  })
  return inquirer.prompt([
      {
          type: 'input',
          message:'What is the employee`s first name?',
          name: 'firstName'
      },
      {
          type: 'input',
          message:'What is the employee`s last name?',
          name: 'lastName'
      },
      {
          type: 'list',
          message:'What is this employee`s role?',
          name: 'role',
          choices: roleArray
      },
      {
          type: 'list',
          message:'Who is this employee`s manager?',
          name: 'manager',
          choices: managerArray
      },
  ]).then(function(answers){
    db.query("INSERT INTO employee SET ?", {
      first_name: answers.firstName,
      last_name: answers.lastName,
      role: answers.role,
      manager: answers.manager,
    }, function(error){
      if (error) throw error;
      console.log(`Added ${answers.firstName} ${answers.lastName} to the database`);
      initialPrompt();
    });
  });
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
        department: department,
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
  console.log('This will prompt the user to enter the name of the department, which is added to the database.')
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
      console.log(`added ${answers.department} to the database`);
      initialPrompt();
    });
  });
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
  db.query("SELECT * FROM employee_role;", function(error, results){
    if (error) throw error;
    console.table(results);
    initialPrompt();
  });
}

// Function that allows the user to view all employees from the database
const viewEmployee = () => {
  db.query("SELECT * FROM employee;", function(error, results){
    if (error) throw error;
    console.table(results);
    initialPrompt();
  });
}

  // If response is wrong, send '404'.
  app.use((req, res) => {
    res.status(404).end();
  });

  // Function to start app
  const init = () => {
    initialPrompt()
  }

init();


