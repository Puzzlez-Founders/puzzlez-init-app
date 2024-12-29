const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model"); // Import the User model

const app = express();
const port = 2512;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/Users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error: any) => console.error("Failed to connect to MongoDB:", error));

// Signup Endpoint
app.post("/user/signup", async (req: any, res: any) => {
  try {
    const newUser = await User.create(req.body); // Create and save a new user
    res.json({ status: "ok", message: "User created", data: newUser });
  } catch (error: any) {
    res.status(409).json({ status: "not cool", message: error.message });
  }
});

// Start the server
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
