const {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} = require("obscenity");

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const { check } = require("express-validator");

const validationRules = [
  check("firstName")
    .trim()
    .optional()
    .custom((firstName) => {
      if (matcher.hasMatch(firstName)) {
        throw new Error("Your first name contains inappropriate language");
      }
      return true;
    }),
  check("lastName")
    .trim()
    .optional()
    .custom((lastName) => {
      if (matcher.hasMatch(lastName)) {
        throw new Error("Your last name contains inappropriate language");
      }
      return true;
    }),
  check("password")
    .trim()
    .optional()
    .custom((password) => {
      if (password && password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      return true;
    }),
  check("confirmPassword")
    .trim()
    .optional()
    .custom((confirmPassword, { req }) => {
      if (req.body.password && req.body.password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .withMessage("Please confirm your password"),
];

module.exports = validationRules;
