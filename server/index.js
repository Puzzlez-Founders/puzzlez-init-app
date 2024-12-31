require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const User = require("./models/user.model");

const app = express();
const port = process.env.port || 2512;

// Global CORS Setup: Allow all origins and specific headers
app.use(
  cors({
    origin: "*", // Update this to specific origins in production for security
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, x-access-token",
  })
);

// Middleware
app.use(express.json());
app.use(helmet());

// Handle preflight requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-access-token");
  res.sendStatus(200);
});

// Connect to MongoDB
mongoose
  .connect(process.env.mongodb_connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

// Signup Endpoint
app.post("/api/user/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ status: "ok", message: "User created", data: newUser });
  } catch (error) {
    res.status(409).json({ status: "error", message: error.message });
  }
});

// Login Endpoint
app.post("/api/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email, name: user.name }, "Willy123", {
      expiresIn: "1h",
    });
    res.status(200).json({ status: "ok", message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Update Quote Endpoint
app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { quote: req.body.quote } },
      { new: true }
    );
    if (!updatedUser)
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    res.status(200).json({ status: "ok", quote: updatedUser.quote });
  } catch (error) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
  }
});

// Start Server
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
