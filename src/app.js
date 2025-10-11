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
