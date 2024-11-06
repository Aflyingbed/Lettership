const express = require("express");
const router = express.Router();
const validationRules = require("..//validations/loginValidation")

router.use(express.urlencoded({ extended: true }));

const loginController = require("../controllers/loginController");

router.get("/", loginController.getLoginForm);
router.post("/", validationRules, loginController.handleLogin);

module.exports = router;
