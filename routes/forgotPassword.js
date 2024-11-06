const express = require("express");
const router = express.Router();
const validationRules = require("../validations/forgotPasswordValidation");

router.use(express.urlencoded({ extended: true }));

const forgotPasswordController = require("../controllers/forgotPasswordController");

router.get("/", forgotPasswordController.getForgotPasswordForm);
router.post("/", validationRules, forgotPasswordController.handlePassword);

module.exports = router;
