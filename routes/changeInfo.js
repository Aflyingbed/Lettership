const express = require("express");
const router = express.Router();
const multer = require("multer");
const validationRules = require("../validations/changeInfoValidation");

router.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: 10 * 1024 * 1024,
});

const changeInfoController = require("../controllers/changeInfoController");

router.get("/", changeInfoController.getChangeForm);
router.post(
	"/",
	upload.single("profilePicture"),
	validationRules,
	changeInfoController.changeInfo,
);

module.exports = router;
