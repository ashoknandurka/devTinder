const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token is invalid...");
    }
    const decoded = jwt.verify(token, "devTinder@123");
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send("ERROR : " + error.message);
  }
};

module.exports = { userAuth };
