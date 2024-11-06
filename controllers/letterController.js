const db = require("../db/queries");
const { validationResult } = require("express-validator");

function getLetterForm(req, res) {
  if (req.isAuthenticated()) {
    res.render("letter-form", {
      errors: [],
      oldInput: {},
    });
  } else {
    res.redirect("/login");
  }
}

async function handleLetter(req, res, next) {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    return res.render("letter-form", {
      errors,
      oldInput: req.body,
    });
  }
  
  try {
    await db.insertLetter(req.body.title, req.body.letter, req.user.id);
    res.redirect("/");
  } catch (err) {
    return next(new Error("There was some trouble making a new letter."));
  }
}

module.exports = { getLetterForm, handleLetter };
