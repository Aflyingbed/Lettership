const { check } = require("express-validator");

const validationRules = [
  check("username").trim().notEmpty().withMessage("Username is required"),
  check("password").trim().notEmpty().withMessage("Password is required"),
];

module.exports = validationRules;
