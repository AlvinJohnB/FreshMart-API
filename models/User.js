const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters."],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile number is required"],
    match: [/^\d{10}$/, "Mobile number is invalid."],
  },
});

module.exports = mongoose.model("User", userSchema);
