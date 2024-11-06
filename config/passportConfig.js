const supabase = require("../db/client");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (!user || error) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !user) {
      return done(error || new Error("User not found"), null);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
