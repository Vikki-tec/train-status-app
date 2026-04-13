const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("public"));

const PORT = 3000;

app.get("/train/:number", async (req, res) => {
  const trainNumber = req.params.number;

  try {
    const response = await axios.get(
      "https://indian-railway-irctc.p.rapidapi.com/api/trains/v1/train/status",
      {
        params: {
          departure_date: "20260413",
          isH5: "true",
          client: "web",
          train_number: trainNumber,
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "indian-railway-irctc.p.rapidapi.com",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching train data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});