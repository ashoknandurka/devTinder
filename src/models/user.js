const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message: "Weak password",
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate: {
        validator: (v) => ["male", "female", "other"].includes(v),
        message: "Invalid gender",
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Invalid URL",
      },
    },
    about: {
      type: String,
      maxLength: 500,
    },
    skills: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "Exceeds the limit of 10 skills",
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
