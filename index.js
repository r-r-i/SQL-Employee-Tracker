import fs from 'fs';
// const inquirer = require('inquirer');
import inquirer from 'inquirer';


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

const viewDepartment = () => {
    console.log('This will log out a formatted table showing department names and department ids')
}

const viewRole = () => {
    console.log('This will log out the job title, role id, the department the role belongs to, and the salary for that role')
}

const viewEmployee = () => {
    console.log('This will log out a formatted table showing employee data; ids, first & last names, job titles, departments, salaries, and managers. ')
}

const promptDepartment = () => {
    console.log('This will prompt the user to enter the name of the department, which is added to the database.')
    return inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department you would like to add?',
            name: 'department',
        }
    ])
}

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
            message: 'What department does this role work for?',
            name: 'empDepartment'
        }
    ])
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
            message:'What is this employee`s role?',
            name: 'role'
        },
        {
            type: 'input',
            message:'Who is the employee`s manager?',
            name: 'manager'
        },
    ])
}

const updateEmployee = () => {
    return inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: ['One', 'Two', 'Three']
        },
        {
            type: 'input',
            message: 'What role would you like to give this employee?',
            name: 'newRole',
        }
    ])
}

const init = () => {
    initialPrompt()
}

init();