const db = require("../db/queries");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const {
	RegExpMatcher,
	TextCensor,
	englishDataset,
	englishRecommendedTransformers,
} = require("obscenity");

const matcher = new RegExpMatcher({
	...englishDataset.build(),
	...englishRecommendedTransformers,
});

const asteriskStrategy = (ctx) => '*'.repeat(ctx.matchLength);
const censor = new TextCensor().setStrategy(asteriskStrategy);

dayjs.extend(utc);
dayjs.extend(timezone);

function processLetters(rows, userTimezone) {
	return rows.map((row) => {
		const titleMatches = matcher.getAllMatches(row.title);
		const messageMatches = matcher.getAllMatches(row.message);
		return {
			...row,
			filteredTitle: censor.applyTo(row.title, titleMatches),
			filteredMessage: censor.applyTo(row.message, messageMatches),
			formattedTimestamp: dayjs
				.utc(row.timestamp)
				.tz(userTimezone)
				.format("ddd, MMM D, YYYY - h:mm A"),
			editTimestamp: row.edit_timestamp
				? dayjs
						.utc(row.edit_timestamp)
						.tz(userTimezone)
						.format("ddd, MMM D, YYYY - h:mm A")
				: null,
		};
	});
}

async function displayLetters(req, res, next) {
	try {
		if (req.isAuthenticated()) {
			const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const sortOrder = req.query.sort || "Newest";
			const page = parseInt(req.query.page) || 1;
			const lettersPerPage = 5;
			const offset = (page - 1) * lettersPerPage;

			const rows = await db.getLetters(
				sortOrder !== "Newest",
				offset,
				lettersPerPage,
			);

			const targetUser = null;

			const totalCount = await db.getLettersCount();

			const maxPages = Math.ceil(totalCount / lettersPerPage);
			if (page > maxPages && maxPages > 0) {
				return res.redirect(`/?page=${maxPages}&sort=${sortOrder}`);
			}

			const formattedRows = await processLetters(rows, userTimezone);
			await db.incrementVisitCount(req.user.id);

			res.render("index", {
				formattedRows,
				userTimezone,
				timezoneFlags,
				currentSortOrder: sortOrder,
				currentPageNumber: page,
				lettersPerPage,
				totalCount,
				targetUser,
			});
		} else {
			res.redirect("/login");
		}
	} catch (err) {
		return next(new Error("There was some trouble displaying the letters."));
	}
}

async function displayUserLetters(req, res, next) {
	let userFirstName = "User";

	try {
		if (req.isAuthenticated()) {
			const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const sortOrder = req.query.sort || "Newest";
			const page = parseInt(req.query.page) || 1;
			const lettersPerPage = 5;
			const offset = (page - 1) * lettersPerPage;

			const targetUser = await db.getUserById(req.params.id);
			if (!targetUser) {
				return next(new Error("User not found"));
			}
			userFirstName = targetUser.first_name;

			const rows = await db.getUserLetters(
				req.params.id,
				sortOrder !== "Newest",
				offset,
				lettersPerPage,
			);

			const totalCount = await db.getUserLettersCount(req.params.id);

			const maxPages = Math.ceil(totalCount / lettersPerPage);
			if (page > maxPages && maxPages > 0) {
				return res.redirect(
					`/user/${targetUser.id}?page=${maxPages}&sort=${sortOrder}`,
				);
			}

			const formattedRows = await processLetters(rows, userTimezone);

			res.render("user-letters", {
				formattedRows,
				userTimezone,
				timezoneFlags,
				noLettersMessage:
					formattedRows.length === 0
						? `${userFirstName} has written 0 letters.`
						: null,
				currentSortOrder: sortOrder,
				currentPageNumber: page,
				lettersPerPage,
				totalCount,
				targetUser,
			});
		} else {
			res.redirect("/login");
		}
	} catch (err) {
		console.log(err);
		return next(
			new Error(
				`There was some trouble displaying ${userFirstName}'s letters.`,
			),
		);
	}
}

async function removeLetter(req, res, next) {
	try {
		await db.deleteLetter(req.params.id);
		res.redirect("/");
	} catch (err) {
		return next(new Error("There was some trouble removing your letter."));
	}
}

async function editLetter(req, res, next) {
	try {
		await db.updateLetter(req.params.id, req.body.title, req.body.message);
		res.redirect(`/user/${req.user.id}`);
	} catch (err) {
		return next(new Error("There was some trouble updating your letter."));
	}
}

module.exports = {
	displayLetters,
	displayUserLetters,
	removeLetter,
	editLetter,
};

const timezoneFlags = {
	"America/New_York": "🇺🇸", // USA
	"Europe/London": "🇬🇧", // UK
	"Asia/Tokyo": "🇯🇵", // Japan
	"Europe/Berlin": "🇩🇪", // Germany
	"Australia/Sydney": "🇦🇺", // Australia
	"Asia/Kuala_Lumpur": "🇲🇾", // Malaysia
	"Asia/Karachi": "🇵🇰", // Pakistan
	"Asia/Bangkok": "🇹🇭", // Thailand
	"Asia/Shanghai": "🇨🇳", // China
	"Europe/Paris": "🇫🇷", // France
	"Asia/Delhi": "🇮🇳", // India
	"Africa/Cairo": "🇪🇬", // Egypt
	"America/Toronto": "🇨🇦", // Canada
	"Europe/Moscow": "🇷🇺", // Russia
	"Asia/Dubai": "🇦🇪", // UAE
	"America/Los_Angeles": "🇺🇸", // USA (West Coast)
	"America/Sao_Paulo": "🇧🇷", // Brazil
	"Africa/Johannesburg": "🇿🇦", // South Africa
	"Asia/Singapore": "🇸🇬", // Singapore
	"Asia/Seoul": "🇰🇷", // South Korea
	"Europe/Amsterdam": "🇳🇱", // Netherlands
	"Europe/Madrid": "🇪🇸", // Spain
	"Europe/Rome": "🇮🇹", // Italy
	"Pacific/Auckland": "🇳🇿", // New Zealand
	"America/Mexico_City": "🇲🇽", // Mexico
	"Europe/Zurich": "🇨🇭", // Switzerland
	"Europe/Oslo": "🇳🇴", // Norway
	"Europe/Stockholm": "🇸🇪", // Sweden
	"Europe/Vienna": "🇦🇹", // Austria
	"Europe/Brussels": "🇧🇪", // Belgium
	"America/Chicago": "🇺🇸", // USA (Central)
	"America/Denver": "🇺🇸", // USA (Mountain)
	"America/Phoenix": "🇺🇸", // USA (Arizona)
	"Africa/Nairobi": "🇰🇪", // Kenya
	"Asia/Hong_Kong": "🇭🇰", // Hong Kong
	"Asia/Jakarta": "🇮🇩", // Indonesia
	"America/Bogota": "🇨🇴", // Colombia
	"Europe/Dublin": "🇮🇪", // Ireland
	"America/Argentina/Buenos_Aires": "🇦🇷", // Argentina
	"Europe/Lisbon": "🇵🇹", // Portugal
	"Europe/Bucharest": "🇷🇴", // Romania
	"Europe/Warsaw": "🇵🇱", // Poland
	"Europe/Athens": "🇬🇷", // Greece
};
