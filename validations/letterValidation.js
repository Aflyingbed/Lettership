const { check } = require("express-validator");

const validationRules = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 45 })
    .withMessage("Title cannot exceed 45 characters"),
  check("letter")
    .trim()
    .notEmpty()
    .withMessage("Uhh, maybe write something, buster?")
    .isLength({ max: 600 })
    .withMessage("Letter cannot exceed 600 characters"),
];

module.exports = validationRules;
