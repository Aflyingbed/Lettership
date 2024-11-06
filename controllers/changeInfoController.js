const db = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

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

function getTransformations(mimeType) {
	if (mimeType === "image/gif") {
		return [{ width: 110, height: 110, crop: "fill", quality: "auto" }];
	}
	if (
		mimeType === "image/png" ||
		mimeType === "image/jpeg" ||
		mimeType === "image/jpg"
	) {
		return [
			{
				width: 110,
				height: 110,
				crop: "fill",
				gravity: "face",
				quality: "auto",
			},
		];
	}
	throw new Error("Please upload an image file (JPEG, PNG, or GIF)");
}

async function uploadPicture(file) {
	const mimeType = file.mimetype;
	const transformations = getTransformations(mimeType);

	const b64 = Buffer.from(file.buffer).toString("base64");
	const dataURI = "data:" + mimeType + ";base64," + b64;

	const result = await cloudinary.v2.uploader.upload(dataURI, {
		folder: "members_profile_pictures",
		transformation: transformations,
	});

	return result.secure_url;
}

function checkAndPushImageErrors(image) {
	const imageErrors = [];

	const validMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
	if (!validMimeTypes.includes(image.mimetype)) {
		imageErrors.push({
			msg: "Please upload an image file (JPEG, PNG, or GIF)",
			path: "profilePicture",
		});
	}

	if (image.size > 10 * 1024 * 1024) {
		imageErrors.push({
			msg: "File size exceeds 10 MB limit",
			path: "profilePicture",
		});
	}

	return imageErrors;
}

async function changeInfo(req, res, next) {
	const { firstName, lastName, password } = req.body;
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
				new Error("There was some trouble changing your profile picture."),
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
