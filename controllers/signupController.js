const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

function getSignupForm(req, res) {
  if (req.isUnauthenticated()) {
    res.render("sign-up-form", {
      errors: [],
      oldInput: {},
    });
  } else {
    res.redirect("/");
  }
}

function selectRandomLink() {
  const urls = [
    "https://res.cloudinary.com/drewn2qxg/image/upload/v1729578126/members_profile_pictures/jrespaxfvm4dkkhkgdqr.jpg",
    "https://res.cloudinary.com/drewn2qxg/image/upload/v1729578101/members_profile_pictures/f0ki3temav6ke6c6u3iv.gif",
    "https://res.cloudinary.com/drewn2qxg/image/upload/v1729578076/members_profile_pictures/ih7ge8x6auv9obth9zqd.jpg",
    "https://res.cloudinary.com/drewn2qxg/image/upload/v1729539198/members_profile_pictures/l1sdvkdbpr1xerggmgwk.gif",
  ];

  const randomIndex = Math.floor(Math.random() * urls.length);
  return urls[randomIndex];
}

async function handleSignup(req, res, next) {
  const errors = validationResult(req).array();

  if (errors.length > 0) {
    return res.render("sign-up-form", {
      errors,
      oldInput: req.body,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const profilePic = selectRandomLink();

    const user = await db.insertSignUpData(
      req.body.firstName,
      req.body.lastName,
      req.body.username,
      hashedPassword,
      profilePic
    );

    req.login(user, async (err) => {
      if (err) {
        return next(new Error("There was some trouble logging in."));
      }
      try {
        await db.incrementLoginCount(user.id);
      } catch (error) {
        console.error("Error updating login count:", error);
      }

      res.redirect("/");
    });
  } catch (err) {
    return next(new Error("There was some trouble signing up."));
  }
}

module.exports = { getSignupForm, handleSignup };
