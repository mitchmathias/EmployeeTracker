var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeetracker_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});


function start() {
  inquirer
    .prompt({
      name: "tracker",
      type: "list",
      message: "what would you like to do?",
      choices: [
        "Add department",
        "Add role",
        "Add employee",
        "View departments",
        "View roles",
        "View employees",
        "Update departments",
        "Update roles",
        "Update employees",
        "Exit"
      ]
    })
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      switch (answer.tracker) {
        case "Add department":
          addDepartment()
          break;
        case "Add role":
          addRole();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "View departments":
          viewDepartment()
          break;
        case "View roles":
          viewRole();
          break;
        case "View employees":
          viewEmployee();
          break;
        case "Update departments":
          updateDepartment()
          break;
        case "Update roles":
          updateRole();
          break;
        case "Update employees":
          updateEmployee();
          break;
        case "Exit":
          start();
          break;
      }
    });
}

function addDepartment() {
  inquirer
    .prompt({
      name: "deptName",
      type: "input",
      message: "Enter department name: ",
      validate: function (value) {
        if (value.trim() === "") {
          return "Please enter valid name";
        }
        return true;
      }
    })
    .then(function (answer) {

      connection.query('INSERT  INTO department SET ?',
        {
          name: answer.deptName
        },
        function (err) {
          if (err) throw err;
          console.log(`${answer.deptName} has been added to departments`)
          console.table(answer)
          start()
        })
    });
}
function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Enter role title: ",
        validate: function (value) {
          if (value.trim() === "") {
            return "Please enter valid title";
          }
          return true;
        }
      },
      {
        name: "salary",
        type: "number",
        message: "Enter role salary: "
      },
      {
        name: "deptId",
        type: "number",
        message: "Enter department ID: "
      }
    ])
    .then(function (answer) {
      connection.query('INSERT  INTO role SET ?',
        [{
          title: answer.title,
          salary: answer.salary,
          department_id: answer.deptId
        }],
        function (err) {
          if (err) throw err;
          console.log(`${answer.title} has been added to roles`)
          console.table(answer)
          start()
        })
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter first name: ",
        validate: function (value) {
          if (value.trim() === "") {
            return "Please enter valid name";
          }
          return true;
        }
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter last name: ",
        validate: function (value) {
          if (value.trim() === "") {
            return "Please enter valid name";
          }
          return true;
        }
      },
      {
        name: "role",
        type: "number",
        message: "Enter role ID: "
      },
      {
        name: "manager",
        type: "number",
        message: "Enter manager ID: "
      },
    ])
    .then(function (answer) {
      connection.query('INSERT  INTO employee SET ?',
        [{
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.role,
          manager_id: answer.manager
        }],
        function (err) {
          if (err) throw err;
          console.log(`${answer.firstName} ${answer.lastName} has been added to employees`)
          console.table(answer)
          start()
        })
    });
}

function viewDepartment() {
  connection.query('SELECT * FROM department', function (err, result) {
    if (err) {
      throw err;
    }
    console.table(result)
    start()
  })
}

function viewRole() {
  connection.query('SELECT * FROM role', function (err, result) {
    if (err) {
      throw err;
    }
    console.table(result)
    start()
  })
}

function viewEmployee() {
  connection.query('SELECT * FROM employee', function (err, result) {
    if (err) {
      throw err;
    }
    console.table(result)
    start()
  })
}
function updateDepartment() {
  var departmentList = [];
  connection.query('SELECT * FROM department', function (err, result) {
    if (err) {
      throw err;
    }
    result.forEach(row => departmentList.push(row.name))
    inquirer
      .prompt([{
        name: "deptName",
        type: "list",
        message: "Select department from list: ",
        choices: departmentList
      },
      {
        name: "newName",
        type: "input",
        message: "Enter new department name: ",
        validate: function (value) {
          if (value.trim() === "") {
            return "Please enter valid name";
          }
          return true;
        }
      }
      ])
      .then(function (answer) {
        connection.query("UPDATE department SET name = '" + answer.newName + "' WHERE name = '" + answer.deptName + "'",
          function (err, result) {
            if (err) {
              throw err;
            }
            console.table(result)
            start()
          })
      });
  })
}

function updateRole() {
  var roleList = [];
  connection.query('SELECT * FROM role', function (err, result) {
    if (err) {
      throw err;
    }
    result.forEach(row => roleList.push(row.title))
    inquirer
      .prompt([{
        name: "role",
        type: "list",
        message: "Select role from list: ",
        choices: roleList
      },
      {
        name: "newSalary",
        type: "number",
        message: "Enter new salary amount: "
      },
      {
        name: "newDeptId",
        type: "number",
        message: "Enter new department id: "
      }
      ])
      .then(function (answer) {
        connection.query("UPDATE role SET salary = '" + answer.newSalary + "', department_id = " + answer.newDeptId + " WHERE title = '" + answer.role + "'",
          function (err, result) {
            if (err) {
              throw err;
            }
            console.table(result)
            start()
          })
      });
  })
}

function updateEmployee() {
  var employeeList = [];
  connection.query('SELECT * FROM employee', function (err, result) {
    if (err) {
      throw err;
    }
    result.forEach(row => employeeList.push(row.first_name + " " + row.last_name))
    inquirer
      .prompt([{
        name: "fullName",
        type: "list",
        message: "Select employee from list: ",
        choices: employeeList
      },
      {
        name: "newFirstName",
        type: "input",
        message: "Enter new first name: ",
        validate: function (value) {
          if (value.trim() === "") {
            return "Please enter valid name";
          }
          return true;
        }
      },
      {
        name: "newLastName",
        type: "input",
        message: "Enter new last name: ",
        validate: function (value) {
          if (value.trim() === "") {
            return "Please enter valid name";
          }
          return true;
        }
      },
      {
        name: "newRole",
        type: "number",
        message: "Enter new role id: "
      },
      {
        name: "newManager",
        type: "number",
        message: "Enter new manager id: "
      }
      ])
      .then(function (answer) {
        connection.query("UPDATE employee SET first_name = '" + answer.newFirstName + "', last_name = '" + answer.newLastName + "', role_id = " + answer.newRole + ", manager_id = " + answer.newManager + " WHERE first_name = '" + answer.fullName.substr(0, answer.fullName.indexOf(' ')) + "' AND last_name = '" + answer.fullName.substr(answer.fullName.indexOf(' ') + 1, answer.fullName.length) + "'",
          function (err, result) {
            if (err) {
              throw err;
            }
            console.table(result)
            start()
          })
      });
  })
}