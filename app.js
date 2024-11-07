const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("./config/passportConfig");
const methodOverride = require("method-override");
const path = require("node:path");

require("dotenv").config();

const indexRoutes = require("./routes/index");
const loginRoutes = require("./routes/login");
const signupRoutes = require("./routes/signup");
const membershipRoutes = require("./routes/membership");
const letterRoutes = require("./routes/letter");
const changeRoutes = require("./routes/changeInfo");
const forgotPasswordRoutes = require("./routes/forgotPassword");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
		},
	}),
);

app.use(passport.session());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use(methodOverride("_method"));

app.use("/", indexRoutes);
app.use("/login", loginRoutes);
app.use("/sign-up", signupRoutes);
app.use("/membership", membershipRoutes);
app.use("/letter", letterRoutes);
app.use("/change", changeRoutes);
app.use("/forgot-password", forgotPasswordRoutes);

app.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/login");
	});
});

app.all("*", (req, res) => {
	if (req.isAuthenticated()) {
		res.status(404).render("404");
	} else {
		res.redirect("/login");
	}
});

app.use((err, req, res, next) => {
	const errorMessage = err.message || "Something went wrong. Please try again.";
	res.status(err.status || 500).render("error", { errorMessage });
});

module.exports = app;
