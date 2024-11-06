const express = require("express");
const router = express.Router();
const validationRules = require("../validations/signupValidation");

router.use(express.urlencoded({ extended: true }));

const signUpController = require("../controllers/signupController");

router.get("/", signUpController.getSignupForm);
router.post("/", validationRules, signUpController.handleSignup);

module.exports = router;
