const express = require("express");
const router = express.Router();
const validationRules = require("../validations/membershipValidation");

router.use(express.urlencoded({ extended: true }));

const membershipController = require("../controllers/membershipController");

router.get("/", membershipController.getMembership);
router.put("/", validationRules, membershipController.changeMembership);
router.put("/cancel", membershipController.changeMembership);

module.exports = router;
