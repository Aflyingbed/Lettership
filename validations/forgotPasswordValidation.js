const { check } = require("express-validator");
const db = require("../db/queries");

const validationRules = [
  check("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .custom(async (username) => {
      const foundUser = await db.getUserByUsername(username);
      if (!foundUser) throw new Error("User not found");
      return true;
    }),
  check("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .custom(async (lastName, { req }) => {
      const isValid = await db.validateLastNameViaUsername(
        lastName,
        req.body.username
      );
      if (!isValid) throw new Error("Wrong last name");
      return true; 
    }),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password)
        throw new Error("Passwords do not match");
      return true;
    }),
];

module.exports = validationRules;
