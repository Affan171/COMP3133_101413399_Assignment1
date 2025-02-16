# Employee Management GraphQL API

## 📌 Overview
This is a **GraphQL API** built using **Node.js, Express, MongoDB, and Apollo Server**. The API allows **user authentication (signup/login)** and **CRUD operations** on employee records.

## 🛠️ Technologies Used
- **Node.js** (Backend Runtime)
- **Express.js** (Web Framework)
- **MongoDB Atlas** (Cloud Database)
- **Mongoose** (ODM for MongoDB)
- **Apollo Server** (GraphQL Server)
- **JWT** (Authentication)
- **bcrypt** (Password Hashing)
- **GraphQL** (Query Language)
- **Validator** (Data Validation)
- **Render** (Deployment)

## 🚀 Live Deployment
**Base URL:** [https://comp3133-101413399-assignment1-1.onrender.com/graphql](https://comp3133-101413399-assignment1-1.onrender.com/graphql)

## 🔑 Authentication
Authentication is handled using **JWT (JSON Web Token)**. 
- **Signup/Login returns a token**
- **Include the token in the `Authorization` header** for secured queries/mutations

## 📌 GraphQL API Endpoints

### **🔹 1. User Authentication**
#### **Signup a new user**
```graphql
mutation {
  signup(input: {
    username: "michael_smith",
    email: "michael.smith@example.com",
    password: "SecurePass123"
  }) {
    token
    user { username email }
  }
}
```

#### **Login**
```graphql
query {
  login(usernameOrEmail: "michael_smith", password: "SecurePass123") {
    token
    user { username email }
  }
}
```

### **🔹 2. Employee CRUD Operations**
#### **Add Employee (Auth Required)**
```graphql
mutation {
  addEmployee(input: {
    first_name: "Michael",
    last_name: "Johnson",
    email: "michael.johnson@example.com",
    gender: Male,
    designation: "Project Manager",
    salary: 7500,
    date_of_joining: "2024-02-17",
    department: "Management",
    employee_photo: "https://example.com/michael_photo.jpg"
  }) {
    eid
    first_name
    last_name
    email
    designation
    department
    salary
    date_of_joining
  }
}
```

#### **Get All Employees (Auth Required)**
```graphql
query {
  getAllEmployees {
    eid
    first_name
    last_name
    email
    designation
    department
    salary
    date_of_joining
  }
}
```

#### **Get Employee by ID (Auth Required)**
```graphql
query {
  getEmployeeById(eid: "67b237192709b1aac69f77f8") {
    eid
    first_name
    last_name
    email
    designation
    department
    salary
    date_of_joining
  }
}
```

#### **Search Employees (Auth Required)**
```graphql
query {
  searchEmployees(designation: "Software Engineer", department: "IT") {
    eid
    first_name
    last_name
    email
    designation
    department
    salary
    date_of_joining
  }
}
```

#### **Update Employee (Auth Required)**
```graphql
mutation {
  updateEmployee(eid: "67b237192709b1aac69f77f8", input: {
    first_name: "Michael",
    last_name: "Williams",
    email: "michael.williams@example.com",
    salary: 9000,
    department: "Engineering"
  }) {
    eid
    first_name
    last_name
    email
    salary
    department
  }
}
```

#### **Delete Employee (Auth Required)**
```graphql
mutation {
  deleteEmployee(eid: "67b237192709b1aac69f77f8") {
    success
    message
  }
}
```

## 📌 Conclusion
This project implements a **secure and efficient GraphQL API** with **user authentication, employee CRUD operations, and MongoDB Atlas**. It is **fully tested** and **deployed on Render**.
