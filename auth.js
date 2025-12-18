const axios = require("axios");

async function getAccessToken() {
  const url = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("scope", "https://analysis.windows.net/powerbi/api/.default");

  const response = await axios.post(url, params);
  return response.data.access_token;
}

module.exports = { getAccessToken };
