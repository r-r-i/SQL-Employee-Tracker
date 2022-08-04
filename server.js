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
      if(data.choice === 'View all departments'){ // Partially working
          viewDepartment();
      } else if (data.choice === 'View all roles'){
          viewRole();
      } else if (data.choice === 'View all employees'){
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
          type: 'input',
          message:'What is this employee`s role id?',
          name: 'role'
      },
      {
          type: 'input',
          message:'What is this employee`s manager id?',
          name: 'manager'
      },
  ]).then(function(answers){
    db.query("INSERT INTO employee SET ?", {
      first_name: answers.firstName,
      last_name: answers.lastName,
      role_id: answers.role,
      manager_id: answers.manager,
    }, function(error){
      if (error) throw error;
      console.log(`Added ${answers.firstName} ${answers.lastName} to the database`);
      initialPrompt();
    });
  });
}
// Prompt that allows the user to add a new role to the database
const promptRole = () => {
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
          type: 'input',
          message: 'What is the department id for this role?',
          name: 'empDepartment'
      }
  ]).then(function(answers){
    db.query("INSERT INTO employee_role SET ?",{
      title: answers.name,
      salary: answers.salary,
      department_id: answers.empDepartment,
    }, function(error) {
      if (error) throw error;
      console.log(`Added ${answers.title} to the database`);
      initialPrompt();
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
// Prompt that allows the user to view all departments from the database
const viewDepartment = () => {
  db.query("SELECT * FROM department;", function(error, results){
    if (error) throw error;
    console.table(results);
  });
}

const querying = () => {
  db.query("SELECT * FROM employee", function(error, results){
    if (error) throw error;
    console.table("results:", results);
    db.end()
  })
}

// app.get(`/updateEmployee/${answers.id}`, (req, res) => {
//   let newName = answers.newName;
//   let sql = `UPDATE employee SET first_name = '${newName}' WHERE id = ${req.params.id}`;
//   let query = db.query(sql,(err) => {
//     if (err) {
//       throw err;
//     } 
//     res.send('Employee Updated')
//   })
// })

const employeeChoices = () => {
  const employeeQuery = `SELECT id AS value, name FROM department;`;
  const employees = db.query(employeeQuery);
  return employees[0];
};




const updateEmployee =  () => {
  return inquirer.prompt([
      {
        message: 'Which employee`s role do you want to update?',
        type: 'list',
        name: 'id',
        choices: employeeChoices(),
      },  
  ])
}

  app.use((req, res) => {
    res.status(404).end();
  });


  const init = () => {
    initialPrompt()
  }

init();


