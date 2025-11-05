const express = require("express");

const connectionDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
const app = express();
const port = 7777;

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

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
