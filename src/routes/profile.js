const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validate");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRoutes = express.Router();

profileRoutes.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRoutes.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileEditData(req);
    const user = req.user;
    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });
    await user.save();
    res.send("Profile updated successfully");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRoutes.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    if (!user.password || !newPassword) {
      return res.status(400).send("Both old and new passwords are required");
    }
    const isPasswordValid = await user.validatePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(401).send("Old password is incorrect");
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).send("New password is not strong enough");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.send("Password changed successfully");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = profileRoutes;
