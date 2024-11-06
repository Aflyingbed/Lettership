const express = require("express");
const router = express.Router();
const validationRules = require("../validations/letterValidation");

router.use(express.urlencoded({ extended: true }));

const letterController = require("../controllers/letterController");

router.get("/", letterController.getLetterForm);
router.post("/", validationRules, letterController.handleLetter);

module.exports = router;
