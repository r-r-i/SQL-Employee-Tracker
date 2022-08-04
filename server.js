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

const querying = () => {
  db.query("SELECT * FROM employee", function(error, results){
    if (error) throw error;
    console.log("results:", results);
    db.end()
  })
}

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
      
  })
}

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
      console.log('Added employee');
      initialPrompt();
    })
  })
}

  app.use((req, res) => {
    res.status(404).end();
  });

    // Port listener
  // app.listen(PORT, () => {
  //   console.log(`Server running on port ${PORT}`);
  // });


  const init = () => {
    initialPrompt()
  }

init();


