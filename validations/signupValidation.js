const { check } = require("express-validator");
const db = require("../db/queries");

const {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} = require("obscenity");

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const validationRules = [
  check("firstName")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('First name must be between 2 and 30 characters')
    .matches(/^[A-Za-zÀ-ÿ\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes')
    .custom((firstName) => {
      if (matcher.hasMatch(firstName)) {
        throw new Error("Your first name contains inappropriate language");
      }
      return true;
    }),
  check("lastName")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Last name must be between 2 and 30 characters')
    .matches(/^[A-Za-zÀ-ÿ\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes')
    .custom((lastName) => {
      if (matcher.hasMatch(lastName)) {
        throw new Error("Your last name contains inappropriate language");
      }
      return true;
    }),
  check("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, periods, and hyphens")
    .custom(async (username) => {
      const foundUser = await db.getUserByUsername(username);
      if (foundUser) {
        throw new Error("Username not available");
      }
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
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .withMessage("Please confirm your password"),
];

module.exports = validationRules;
