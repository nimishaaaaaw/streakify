const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* ===============================
   TEMP CORS (OPEN FOR DEPLOY)
================================ */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

/* ===============================
   ROUTES
================================ */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/habits", require("./routes/habitRoutes"));

/* ===============================
   HEALTH CHECK ROUTE
================================ */

app.get("/", (req, res) => {
  res.send("Streakify backend running 🚀");
});

/* ===============================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});