# 🧑‍💼 Employee Database Management System


A command-line interface (CLI) application built with Node.js, Inquirer, and MySQL to manage employee records for a company. It allows users to view, add, update, and delete departments, roles, and employees through a dynamic SQL-powered interface.


## 📚 Table of Contents


- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Database Schema](#database-schema)
- [Demo](#demo)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)


## ✅ Features


- View all departments, roles, and employees
- Add a new department, role, or employee
- Update an employee's role
- Delete employees, roles, or departments
- Perform queries using asynchronous MySQL logic
- Organized interface using `Inquirer.js` prompts


## 📦 Installation


```bash
git clone https://github.com/mauricek12d/Employee-Database.git
cd Employee-Database
npm install
```


Ensure you have MySQL installed and a database created. Import the schema provided in `db/schema.sql` and optionally seed data via `db/seeds.sql`.


## 🚀 Usage


To start the application:


```bash
node index.js
```


You will be prompted to select from various employee management options in a dynamic menu.


## 🛠️ Technologies Used


- [Node.js](https://nodejs.org/)
- [Inquirer.js](https://www.npmjs.com/package/inquirer)
- [MySQL2](https://www.npmjs.com/package/mysql2)
- JavaScript (ES6)
- SQL


## 🧮 Database Schema


The database contains three tables:


- `departments`
- `roles`
- `employees`


Each table is related using foreign keys to reflect a normalized relational structure.


## 🎥 Demo


*(Optional)* Embed or link to a walkthrough video or screenshot of the application in use.


## 📁 Folder Structure


```
Employee-Database/
├── db/
│   ├── schema.sql          # SQL script to create database schema
│   ├── seeds.sql           # SQL seed data
├── index.js                # Entry point with CLI logic
├── package.json
└── README.md
```


## 🤝 Contributing


Contributions are welcome! 
To contribute:


1. Fork this repo 
2. Create a branch (`git checkout -b feature/YourFeature`) 
3. Commit your changes (`git commit -m 'Add feature'`) 
4. Push to GitHub (`git push origin feature/YourFeature`) 
5. Create a Pull Request


## 📄 License


This project is licensed under the [MIT License](./LICENSE).


## 📬 Contact


**Maurice Zuniga** 
🔗 [LinkedIn](https://www.linkedin.com/in/maurice-zuniga424/) 
💻 [GitHub](https://github.com/mauricek12d) 
📧 [YourEmail@example.com]


> 🧩 Built to simplify and streamline employee record management using SQL and Node.js.









