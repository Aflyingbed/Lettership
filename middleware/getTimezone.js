const axios = require("axios");

async function getTimezone(req, res, next) {
	try {
		const ip =
			req.headers["x-forwarded-for"]?.split(",")[0] ||
			req.connection.remoteAddress;
            
		const response = await axios.get(
			`https://ipinfo.io/${ip}?token=${process.env.IPINFO_API}`,
		);
		
		req.userTimezone = response.data.timezone || "UTC";
	} catch (error) {
		console.error("Error fetching timezone:", error.message);
		req.userTimezone = "UTC";
	}
	next();
}

module.exports = getTimezone;
