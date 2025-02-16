const { gql } = require("apollo-server-express");

const typeDefs = gql`
  """
  ISO 8601 formatted DateTime
  """
  scalar DateTime

  """
  Gender Enum for employees
  """
  enum Gender {
    Male
    Female
    Other
  }

  """
  User type definition (without password field for security reasons)
  """
  type User {
    id: ID!
    username: String!
    email: String!
    created_at: DateTime
    updated_at: DateTime
  }

  """
  Employee type definition
  """
  type Employee {
    eid: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: Gender!
    designation: String!
    salary: Float!
    date_of_joining: DateTime!
    department: String!
    employee_photo: String
    created_at: DateTime
    updated_at: DateTime
  }

  """
  Auth payload for successful signup or login
  """
  type AuthPayload {
    token: String!
    user: User!
  }

  """
  Common response type for deletions
  """
  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  """
  Input type for user signup
  """
  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  """
  Input type for adding an employee
  """
  input AddEmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: Gender!
    designation: String!
    salary: Float!
    date_of_joining: DateTime!
    department: String!
    employee_photo: String
  }

  """
  Input type for updating an employee
  """
  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: Gender
    designation: String
    salary: Float
    date_of_joining: DateTime
    department: String
    employee_photo: String
  }

  """
  Queries: Fetching data
  """
  type Query {
    """
    Public: login by username/email and password
    """
    login(usernameOrEmail: String!, password: String!): AuthPayload

    """
    Auth required: Get a list of all employees
    """
    getAllEmployees: [Employee!]!

    """
    Auth required: Get a single employee by ID
    """
    getEmployeeById(eid: ID!): Employee

    """
    Auth required: Search employees by designation or department
    """
    searchEmployees(designation: String, department: String): [Employee!]!
  }

  """
  Mutations: Creating, updating, or deleting data
  """
  type Mutation {
    """
    Public: Create a new user account
    """
    signup(input: SignupInput!): AuthPayload

    """
    Auth required: Add a new employee
    """
    addEmployee(input: AddEmployeeInput!): Employee

    """
    Auth required: Update employee by ID
    """
    updateEmployee(eid: ID!, input: UpdateEmployeeInput!): Employee

    """
    Auth required: Delete employee by ID
    """
    deleteEmployee(eid: ID!): DeleteResponse
  }
`;

module.exports = typeDefs;
