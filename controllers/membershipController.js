const db = require("../db/queries");
const { validationResult } = require("express-validator");
require("dotenv").config();

function getMembership(req, res) {
  if (req.isAuthenticated()) {
    res.render("membership-form", {
      errors: [],
      oldInput: {},
    });
  } else {
    res.redirect("/");
  }
}

async function changeMembership(req, res, next) {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    return res.render("membership-form", {
      errors,
      oldInput: req.body,
    });
  }
  if (
    req.body.membership === process.env.MEMBERSHIP_CODE ||
    req.user.membership === true
  ) {
    try {
      await db.checkMembership(req.user.id);
      res.redirect("/membership");
    } catch (err) {
      return next(new Error("We ran into some trouble while checking your membership."));
    }
  } else {
    res.status(400).send("Invalid membership code");
  }
}

module.exports = { getMembership, changeMembership };
