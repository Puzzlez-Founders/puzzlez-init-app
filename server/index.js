require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const User = require("./models/user.model");

const app = express();
const port = process.env.PORT || 2512;

// Global CORS Setup: Allow all origins and methods
app.use(cors()); // This allows requests from any origin
app.use(express.json());
app.use(helmet());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

// Signup Endpoint
app.post("/user/signup", async (req, res) => {
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
app.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ status: "ok", message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Update Quote
app.post("/quote", async (req, res) => {
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
