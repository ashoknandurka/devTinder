const express = require("express");
const app = express();
const port = 7777;

app.get("/user", (req, res) => {
  res.send({ firstName: "John", lastName: "Doe" });
});

app.post("/user", (req, res) => {
  res.send("user posted successfully !");
});

app.delete("/user", (req, res) => {
  res.send("user deleted successfully !");
});

app.use("/test", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
