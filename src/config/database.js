const mongoose = require("mongoose");

const connectionDB = async () => {
  mongoose.connect(
    "mongodb+srv://ashoknandurka:ash0kAtlas@cluster0.ku3j7ht.mongodb.net/devTinder"
  );
};
module.exports = connectionDB;