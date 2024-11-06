const express = require("express");
const router = express.Router();
const multer = require("multer");
const validationRules = require("../validations/changeInfoValidation");

router.use(express.urlencoded({ extended: true }));

const upload = multer({
  dest: "uploads/",
  limits: 10 * 1024 * 1024,
});

const changeInfoController = require("../controllers/changeInfoController");

router.get("/", changeInfoController.getChangeForm);
router.put(
  "/personal-info",
  upload.single("profilePicture"),
  validationRules,
  changeInfoController.changeInfo
);

module.exports = router;
