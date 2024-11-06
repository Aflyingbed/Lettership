const express = require("express");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

const indexController = require("../controllers/indexController");

router.get("/", indexController.displayLetters);
router.delete("/delete/:id", indexController.removeLetter);
router.get("/user/:id", indexController.displayUserLetters);
router.put("/edit/:id", indexController.editLetter);

module.exports = router;
