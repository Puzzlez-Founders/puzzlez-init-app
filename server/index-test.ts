import { users } from "./userinterface";
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const port = 2512;

app.use(express.json()); // Middleware to parse JSON requests

const users: users[] = [];

app.get("/users", (req: any, res: any) => {
  try {
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).send("Error retrieving users: " + error.message);
  }
});

app.post("/users", async (req: any, res: any) => {
  try {
    console.log("Request Body:", req.body); // Debugging line
    if (!req.body.password || !req.body.name) {
      return res.status(400).send("Name and password are required.");
    }
    const hashedPassword: string = await bcrypt.hash(req.body.password, 10);
    const user: users = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send("User Added Successfully.");
  } catch (error: any) {
    res.status(500).send("Error adding user: " + error.message);
  }
});

app.post("/users/login", async (req: any, res: any) => {
  try {
    if (!req.body.name || !req.body.password) {
      return res.status(400).send("Name and password are required for login.");
    }

    const loginUser: users = {
      name: req.body.name,
      password: req.body.password,
    };
    const ExistingLoginer: any = users.find(
      (exsistingUser: users) => exsistingUser.name === loginUser.name
    );

    if (!ExistingLoginer) {
      return res.status(404).send("Please Sign Up");
    }

    const IsCorrectPassword = await bcrypt.compare(
      loginUser.password,
      ExistingLoginer.password
    );

    if (!IsCorrectPassword) {
      return res.status(401).send("Invalid Credentials");
    }

    res.status(200).send(`Welcome ${ExistingLoginer.name}`);
  } catch (error: any) {
    res.status(500).send("Error logging in: " + error.message);
  }
});

app.listen(port, () => console.log(`Running on http://localhost:${port}`));
