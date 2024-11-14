const {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} = require("obscenity");

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const spotifyUrlPattern =
  /https:\/\/open\.spotify\.com\/(track|playlist|artist)\/([A-Za-z0-9]{22})/;

const { check } = require("express-validator");

const validationRules = [
  check("firstName")
    .trim()
    .optional()
    .custom((firstName) => {
      if (matcher.hasMatch(firstName)) {
        throw new Error("Your first name contains inappropriate language");
      }
      return true;
    }),
  check("lastName")
    .trim()
    .optional()
    .custom((lastName) => {
      if (matcher.hasMatch(lastName)) {
        throw new Error("Your last name contains inappropriate language");
      }
      return true;
    }),
  check("password")
    .trim()
    .optional()
    .custom((password) => {
      if (password && password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      return true;
    }),
  check("spotifyUrl")
    .optional()
    .custom((spotifyUrl) => {
      if (spotifyUrl && !spotifyUrlPattern.test(spotifyUrl)) {
        throw new Error(
          "Please provide a valid Spotify URL (track, playlist, or artist)"
        );
      }
      return true;
    }),
];

module.exports = validationRules;
