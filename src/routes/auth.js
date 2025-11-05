const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateSignupData } = require("../utils/validate");

const authRoutes = express.Router();

authRoutes.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.send("User signed up successfully...!");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRoutes.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address.");
    }
    if (!password) {
      throw new Error("Password is required.");
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    }
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRoutes.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully");
});

module.exports = authRoutes;
