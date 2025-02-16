const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const Employee = require("../models/employee");

const generateToken = (user) => {
  return jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {
  Query: {
    // Public: Login user
    login: async (_, { usernameOrEmail, password }) => {
      try {
        const user =
          (await User.findOne({ username: usernameOrEmail })) ||
          (await User.findOne({ email: usernameOrEmail }));

        if (!user) throw new Error("User not found");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Invalid password");

        const token = generateToken(user);
        return { token, user };
      } catch (err) {
        throw new Error(err.message);
      }
    },

    // Auth required
    getAllEmployees: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized! Please provide a valid token.");
    
      const employees = await Employee.find({});
      
      return employees.map(employee => ({
        eid: employee._id.toString(),  // ✅ Convert MongoDB _id to string
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        gender: employee.gender,
        designation: employee.designation,
        salary: employee.salary,
        date_of_joining: employee.date_of_joining,
        department: employee.department,
        employee_photo: employee.employee_photo,
        created_at: employee.created_at,
        updated_at: employee.updated_at,
      }));
    },

    // Auth required
    getEmployeeById: async (_, { eid }, { user }) => {
      if (!user) throw new Error("Unauthorized! Please provide a valid token.");
    
      const employee = await Employee.findById(eid);
      if (!employee) throw new Error("Employee not found");
    
      return {
        eid: employee._id.toString(),  // ✅ Fix: Explicitly return eid
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        gender: employee.gender,
        designation: employee.designation,
        salary: employee.salary,
        date_of_joining: employee.date_of_joining,
        department: employee.department,
        employee_photo: employee.employee_photo,
        created_at: employee.created_at,
        updated_at: employee.updated_at,
      };
    },
    
    // Auth required
    searchEmployees: async (_, { designation, department }, { user }) => {
      if (!user) throw new Error("Unauthorized! Please provide a valid token.");

      const query = {};
      if (designation) query.designation = designation;
      if (department) query.department = department;

      const employees = await Employee.find(query);

      return employees.map(employee => ({
        eid: employee._id.toString(),  // ✅ Fix: Ensure _id is converted to eid
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        gender: employee.gender,
        designation: employee.designation,
        salary: employee.salary,
        date_of_joining: employee.date_of_joining,
        department: employee.department,
        employee_photo: employee.employee_photo,
        created_at: employee.created_at,
        updated_at: employee.updated_at,
      }));
    },
  },

  Mutation: {
    // Public signup
    signup: async (_, { input }) => {
      try {
        const { username, email, password } = input;

        if (username.length < 3) throw new Error("Username must be at least 3 characters.");
        if (!validator.isEmail(email)) throw new Error("Invalid email format.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) throw new Error("User already exists with provided username/email");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        });

        await newUser.save();
        const token = generateToken(newUser);

        return { token, user: newUser };
      } catch (err) {
        throw new Error(err.message);
      }
    },

    // Auth required
    addEmployee: async (_, { input }, { user }) => {
      if (!user) throw new Error("Unauthorized! Please provide a valid token.");

      const {
        first_name,
        last_name,
        email,
        gender,
        designation,
        salary,
        date_of_joining,
        department,
        employee_photo,
      } = input;

      if (!validator.isEmail(email)) throw new Error("Invalid email format.");
      if (salary < 1000) throw new Error("Salary must be at least 1000.");
      if (!["Male", "Female", "Other"].includes(gender)) throw new Error("Invalid gender.");

      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) throw new Error("Employee with this email already exists.");

      // Create employee
      const employee = new Employee({
        first_name,
        last_name,
        email,
        gender,
        designation,
        salary,
        date_of_joining: date_of_joining || new Date(),
        department,
        employee_photo: employee_photo || "",
        created_at: new Date(),
        updated_at: new Date(),
      });

      await employee.save();

      return {
        eid: employee._id.toString(),  // ✅ Convert _id to eid
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        gender: employee.gender,
        designation: employee.designation,
        salary: employee.salary,
        date_of_joining: employee.date_of_joining,
        department: employee.department,
        employee_photo: employee.employee_photo,
        created_at: employee.created_at,
        updated_at: employee.updated_at,
      };
    },

    // Auth required
    updateEmployee: async (_, { eid, input }, { user }) => {
      if (!user) throw new Error("Unauthorized! Please provide a valid token.");

      const employee = await Employee.findById(eid);
      if (!employee) throw new Error("Employee not found");

      if (input.salary !== undefined && input.salary < 1000) {
        throw new Error("Salary must be at least 1000.");
      }

      if (input.email !== undefined && !validator.isEmail(input.email)) {
        throw new Error("Invalid email format.");
      }

      if (input.gender !== undefined && !["Male", "Female", "Other"].includes(input.gender)) {
        throw new Error("Invalid gender.");
      }

      Object.assign(employee, input);
      employee.updated_at = new Date();

      await employee.save();

      return {
        eid: employee._id.toString(),  // ✅ Convert _id to eid
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        gender: employee.gender,
        designation: employee.designation,
        salary: employee.salary,
        date_of_joining: employee.date_of_joining,
        department: employee.department,
        employee_photo: employee.employee_photo,
        created_at: employee.created_at,
        updated_at: employee.updated_at,
      };
    },

    // Auth required
    deleteEmployee: async (_, { eid }, { user }) => {
      if (!user) throw new Error("Unauthorized! Please provide a valid token.");

      const deletedEmployee = await Employee.findByIdAndDelete(eid);
      if (!deletedEmployee) throw new Error("Employee not found");

      return { success: true, message: "Employee deleted successfully" };
    },
  },
};
