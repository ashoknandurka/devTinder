const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 3, maxLength: 50 },
    lastName: { type: String, minLength: 3, maxLength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minLength: 4, maxLength: 12 },
    age: { type: Number, min: 18 },
    gender: { type: String, validate: { validator: (v) => ['male', 'female', 'other'].includes(v), message: 'Invalid gender' } },
    photoUrl: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    },
    about: { type: String, maxLength: 500 },
    skills: { type: [String] },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
