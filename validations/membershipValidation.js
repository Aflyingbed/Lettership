const { check } = require("express-validator");
require("dotenv").config();

const validationRules = [
  check("membership")
    .trim()
    .notEmpty()
    .withMessage("Maybe ask me?")
    .equals(process.env.MEMBERSHIP_CODE)
    .withMessage("Wrong code, bud"),
];

module.exports = validationRules;
