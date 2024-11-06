const db = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

function getForgotPasswordForm(req, res) {
  if (req.isUnauthenticated()) {
    res.render("forgot-password-form", {
      errors: [],
      oldInput: {},
    });
  } else {
    res.redirect("/");
  }
}

async function handlePassword(req, res, next) {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    return res.render("forgot-password-form", {
      errors,
      oldInput: req.body,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await db.updatePassword(
      req.body.username,
      req.body.lastName,
      hashedPassword
    );
    res.redirect("/login");
  } catch (err) {
    return next(new Error("There was some trouble recovering your password."));
  }
}

module.exports = { getForgotPasswordForm, handlePassword };
