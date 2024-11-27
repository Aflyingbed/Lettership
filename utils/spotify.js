const axios = require("axios");

async function getSpotifyAccessToken() {
  const url = "https://accounts.spotify.com/api/token";

  const authHeader = `Basic ${Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64")}`;

  const data = new URLSearchParams();
  data.append("grant_type", "client_credentials");

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token from Spotify:", error);
    return null;
  }
}

async function validateSpotifyUrl(spotifyUrl) {
  const regex =
    /https:\/\/open\.spotify\.com\/(track|playlist|album|artist)\/([A-Za-z0-9]{22})/;
  const match = spotifyUrl.match(regex);

  if (match) {
    const contentType = match[1];
    const contentId = match[2];

    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) {
      return null;
    }

    try {
      await axios.get(
        `https://api.spotify.com/v1/${contentType}s/${contentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return `${contentType}/${contentId}`;
    } catch (error) {
      return null;
    }
  }

  return null;
}

module.exports = {
  validateSpotifyUrl,
};
