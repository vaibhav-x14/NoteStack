const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

const app = express();

/* ======================
   MIDDLEWARE (ORDER IMPORTANT)
====================== */
app.use(cors({
  origin: [
  "http://localhost:5173",
  "https://notestack-qs2ccvxt2-vaibhav-x14s-projects.vercel.app"
],
  credentials: true,
}));

app.use(express.json());

/* ======================
   TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("Backend running OK");
});

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.post("/api/summarize", async (req, res) => {
  try {
    const { title, content } = req.body;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `
Extract the most important key points from the following note.

Return ONLY bullet points.
Each point should be short and meaningful.
Cover all important information.

Title: ${title}
Content: ${content}
`,
          parameters: {
            max_length: 150,
            min_length: 60,
            do_sample: false
          }
        }),
      }
    );

    const data = await response.json();

    console.log("HF:", data);

    let summary = "No summary generated";

    if (Array.isArray(data) && data[0]?.summary_text) {
      summary = data[0].summary_text;
    }

    res.json({ summary });

  } catch (err) {
    console.error("HF ERROR:", err);
    res.status(500).json({ error: "Failed to summarize" });
  }
});

/* ======================
   DB
====================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
