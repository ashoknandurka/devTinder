const express = require("express");

const { adminAuth, userAuth } = require("./middlewares/auth");
const connectionDB = require("./config/database");
const User = require("./models/user");
const app = express();
const port = 7777;

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User signed up successfully...!");
  } catch (error) {
    res.status(400).send("Error signing up user" + error.message);
  }
});

app.get("/user", userAuth, async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.find({ email: userEmail });
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
