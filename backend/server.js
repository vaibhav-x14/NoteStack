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
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://notestack-qs2ccvxt2-vaibhav-x14s-projects.vercel.app"
  ],
  credentials: true,
}));

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
  .catch(err => console.log(err));

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
