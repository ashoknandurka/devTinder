const express = require("express");

const { userAuth } = require("./middlewares/auth");
const connectionDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validate");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const port = 7777;

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
    res.send("Login successful");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(`${user.firstName} made a connection request !`);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.get("/user", userAuth, async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      return res.status(404).send("User not found with the given email");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("something went wrong" + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("something went wrong" + error.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found with the given ID");
    } else {
      res.send("User deleted successfully");
    }
  } catch (error) {
    res.status(400).send("something went wrong" + error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    const ALLOUTEDUPDATES = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];
    const requestedUpdates = Object.keys(data);
    const isValidOperation = requestedUpdates.every((update) =>
      ALLOUTEDUPDATES.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send("Invalid updates!");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).send("User not found with the given ID");
    } else {
      res.send(updatedUser);
    }
  } catch (error) {
    res.status(400).send("something went wrong" + error.message);
  }
});

connectionDB()
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });
