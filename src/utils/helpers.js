const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const comparePasswords = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = {
  hashPassword,
  comparePasswords,
  generateToken,
};
