const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();

const transcriptionRoutes = require("./routes/transcriptionRoutes");
const translationRoutes = require("./routes/translationRoutes");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", transcriptionRoutes);
app.use("/api", translationRoutes);
app.use("/api", authRoutes);

// MongoDB Connection
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
