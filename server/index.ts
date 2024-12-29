const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");

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

app.get("/users", async (req: any, res: any) => {
  try {
    const newUser = await User.find();
    res.status(200).json(newUser);
  } catch (error: any) {
    res
      .status(500)
      .json({ status: "Something went wrong", message: error.message });
  }
});

// Signup Endpoint
app.post("/user/signup", async (req: any, res: any) => {
  try {
    const newUser = await User.create(req.body); // Create and save a new user
    res.json({ status: "ok", message: "User created", data: newUser });
  } catch (error: any) {
    res.status(409).json({ status: "not cool", message: error.message });
  }
});

app.post("/user/login", async (req: any, res: any) => {
  try {
    const loginUser = await User.findOne({
      email: req.body.email,
    });
    if (loginUser) {
      if (loginUser.password !== req.body.password) {
        res.status(400).json({
          status: "not cool",
          message: "Invalid Creds",
        });
      } else {
        res.status(200).json({
          status: "ok",
          message: "Login Successfull",
          data: loginUser,
        });
      }
    } else {
      res.status(400).json({
        status: "Not cool",
        message: "No such user found ",
      });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ status: "Something went wrong", message: error.message });
  }
});

// Start the server
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
