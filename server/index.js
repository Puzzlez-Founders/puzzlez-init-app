const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
require("dotenv").config();

const app = express();
const port = process.env.port || 2512;
const corsOptions = {
  origin: ["https://puzzlez.in"], // Allow this specific origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // If cookies or auth headers are sent
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    process.env.mongodb_connection_url || "mongodb://localhost:27017/Users",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

app.get("/users", async (req, res) => {
  try {
    const newUser = await User.find();
    res.status(200).json(newUser);
  } catch (error) {
    res
      .status(500)
      .json({ status: "Something went wrong", message: error.message });
  }
});

// Signup Endpoint
app.post("/user/signup", async (req, res) => {
  try {
    const newUser = await User.create(req.body); // Create and save a new user
    res.json({ status: "ok", message: "User created", data: newUser });
  } catch (error) {
    res.status(409).json({ status: "not cool", message: error.message });
  }
});

app.post("/user/login", async (req, res) => {
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
        const token = jwt.sign(
          {
            name: loginUser.name,
            email: loginUser.email,
          },
          "WillyBhaii"
        );
        res.status(200).json({
          status: "ok",
          message: "Login Successfull",
          data: token,
        });
      }
    } else {
      res.status(400).json({
        status: "Not cool",
        message: "No such user found ",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "Something went wrong", message: error.message });
  }
});

app.post("/quote", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decodedtoken = jwt.verify(token, "WillyBhaii");
    const email = decodedtoken.email;
    const user = User.updateOne(
      { email: email },
      { $set: { quote: req.body.quote } }
    );
    res.status(200).json({ status: "ok", quote: user.quote });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Something went wrong", message: error.message });
  }
});

// Start the server
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
