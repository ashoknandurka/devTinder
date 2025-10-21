const express = require("express");

const connectionDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/request");
const userRouter = require("./routes/user");
const app = express();
const port = 7777;

app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", requestRoutes);
app.use("/", userRouter);

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
