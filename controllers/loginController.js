const db = require("../db/queries");
const passport = require("passport");
const { validationResult } = require("express-validator");

function getLoginForm(req, res) {
  if (req.isUnauthenticated()) {
    res.render("login-form", {
      errors: [],
      oldInput: {},
    });
  } else {
    res.redirect("/");
  }
}

function handleLogin(req, res, next) {
  const errors = validationResult(req).array();
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(new Error("There was some trouble logging in."));
    }
    if (!user) {
      if (info.message.includes("username")) {
        errors.push({ msg: info.message, path: "username" });
      } else if (info.message.includes("password")) {
        errors.push({ msg: info.message, path: "password" });
      }
      return res.render("login-form", { errors, oldInput: req.body });
    }

    req.login(user, async (err) => {
      if (err) {
        return next(new Error("There was some trouble logging in."));
      }
      try {
        await db.incrementLoginCount(user.id);
      } catch (error) {
        console.error("Error updating login count:", error);
      }

      return res.redirect("/");
    });
  })(req, res, next);
}

module.exports = { getLoginForm, handleLogin };
