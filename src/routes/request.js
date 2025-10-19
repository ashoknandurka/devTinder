const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRoutes = express.Router();

requestRoutes.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(`${user.firstName} made a connection request !`);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = requestRoutes;
