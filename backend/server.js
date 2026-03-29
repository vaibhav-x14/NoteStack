const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* ======================
   ROUTES
====================== */
app.get("/", (req, res) => {
  res.send("Backend running OK");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

/* ======================
   DB
====================== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 10000; // 🔥 IMPORTANT

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
