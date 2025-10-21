const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["interested", "ignored", "accepted", "rejected"],
      message: "{VALUE} is not supported",
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // check if fromUserId and toUserId are the same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
