const express = require("express");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

const indexController = require("../controllers/indexController");

router.get("/", indexController.displayLetters);
router.post("/delete/:id", indexController.removeLetter);
router.get("/user/:id", indexController.displayUserLetters);
router.post("/edit/:id", indexController.editLetter);

module.exports = router;
