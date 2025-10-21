const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRoutes = express.Router();

requestRoutes.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const { status, userId } = req.params;

      const validStatuses = ["interested", "ignored"];
      if (!validStatuses.includes(status)) {
        return res.status(400).send({ message: "Invalid status value" });
      }

      const toUser = await User.findById(userId);
      if (!toUser) {
        return res.status(404).send({ message: "User not found" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: user._id, toUserId: userId },
          { fromUserId: userId, toUserId: user._id },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request already exists" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId: user._id,
        toUserId: userId,
        status: status,
      });

      await connectionRequest.save();
      res.json({
        message: `Request sent to ${toUser.firstName} by ${user.firstName} with status ${status}`,
        connectionRequest,
      });
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  }
);

requestRoutes.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const validStatuses = ["accepted", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).send({ message: "Invalid status value" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .send({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      res.json({
        message: `Request ${status} by ${loggedInUser.firstName}`,
        connectionRequest,
      });
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  }
);

module.exports = requestRoutes;
