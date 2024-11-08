const axios = require("axios");

async function getTimezone(req, res, next) {
	try {
		const ip =
			req.ip ||
			req.headers["x-forwarded-for"] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.remoteAddress;

		const response = await axios.get(
			`https://ipinfo.io/${ip}?token=${process.env.IPINFO_API}`,
		);

		req.userTimezone = response.data.timezone || "Asia/Shanghai";
	} catch (error) {
		console.error("Error fetching timezone:", error.message);
		req.userTimezone = "UTC";
	}
	next();
}

module.exports = getTimezone;
