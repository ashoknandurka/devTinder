const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const userRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName age gender skills about photoUrl"
    );

    res.json({
      message: "Connection requests received successfully",
      data: userRequests,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = userRouter;
