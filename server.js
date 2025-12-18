require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { getAccessToken } = require("./auth");

const app = express();
app.use(cors());

app.get("/embed-config", async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    };

    // 1️⃣ Get report details (THIS gives embedUrl)
    const reportDetailsUrl =
      `https://api.powerbi.com/v1.0/myorg/groups/${process.env.WORKSPACE_ID}/reports/${process.env.REPORT_ID}`;

    const reportResponse = await axios.get(reportDetailsUrl, { headers });

    const embedUrl = reportResponse.data.embedUrl; // ✅ CORRECT

    // 2️⃣ Generate embed token
    const tokenUrl = `${reportDetailsUrl}/GenerateToken`;

    const tokenResponse = await axios.post(
      tokenUrl,
      { accessLevel: "View" },
      { headers }
    );

    res.json({
      embedUrl: embedUrl,
      embedToken: tokenResponse.data.token,
      reportId: process.env.REPORT_ID
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate embed config" });
  }
});


app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
