const db = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { validateSpotifyUrl } = require("../utils/spotify");
const { uploadPicture, checkAndPushImageErrors } = require("../utils/images");

function getChangeForm(req, res) {
  if (req.isAuthenticated()) {
    res.render("change-info", {
      errors: [],
      oldInput: {},
    });
  } else {
    res.redirect("/login-form");
  }
}

async function changeInfo(req, res, next) {
  const { firstName, lastName, password, spotifyUrl } = req.body;
  const profilePicture = req.file;

  const errors = validationResult(req).array();
  const allErrors = [...errors];

  if (profilePicture) {
    const imageErrors = checkAndPushImageErrors(profilePicture);
    allErrors.push(...imageErrors);
  }

  if (allErrors.length > 0) {
    return res.render("change-info", {
      errors: allErrors,
      oldInput: req.body,
    });
  }

  const updates = {};

  if (firstName) updates.first_name = firstName;
  if (lastName) updates.last_name = lastName;
  
  if (spotifyUrl) {
    const spotifyId = await validateSpotifyUrl(spotifyUrl);
    if (spotifyId) {
      updates.spotify_track_id = spotifyId;
    } else {
      allErrors.push({
        msg: "Invalid Spotify URL. Please provide a valid track, playlist, or artist URL.",
        path: "spotifyUrl",
      });
      return res.render("change-info", {
        errors: allErrors,
        oldInput: req.body,
      });
    }
  }

  if (password) {
    try {
      updates.password = await bcrypt.hash(password, 10);
    } catch (err) {
      return next(new Error("There was some trouble changing your password."));
    }
  }

  if (profilePicture) {
    try {
      updates.profile_picture_url = await uploadPicture(profilePicture);
    } catch (err) {
      return next(
        new Error("There was some trouble changing your profile picture.")
      );
    }
  }

  try {
    await db.updateUserInfo(req.user.id, updates);
    res.redirect(`/user/${req.user.id}`);
  } catch (err) {
    next(new Error("There was some trouble updating your information."));
  }
}

module.exports = {
  getChangeForm,
  changeInfo,
};
