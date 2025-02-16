// src/validations/index.js

const { check, validationResult } = require("express-validator");

const signupValidation = [
  check("username").not().isEmpty().withMessage("Username is required"),
  check("email").isEmail().withMessage("Must be a valid email"),
  check("password").isLength({ min: 6 }).withMessage("Password at least 6 chars"),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return or throw an error
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  signupValidation,
  validateRequest,
};
