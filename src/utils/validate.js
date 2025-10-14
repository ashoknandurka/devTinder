
const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || typeof firstName !== "string") {
    throw new Error("First name is required and must be a string.");
  }

  if (typeof lastName !== "string") {
    throw new Error("Last name is must be a string.");
  }
    if (!emailId || !validator.isEmail(emailId)) {  
    throw new Error("A valid email address is required.");
  }
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Password is required and must be at least 8 characters long.");
  }
}

module.exports = { validateSignupData };