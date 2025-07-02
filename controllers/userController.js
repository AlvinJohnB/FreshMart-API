const User = require("../models/User");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../middleware/errorHandler");
const { createAccessToken } = require("../middleware/auth");

// Register a new user
module.exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, mobileNo } = req.body;

  //   Check if user already exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }
    })
    .catch((error) => {
      return errorHandler(error, req, res);
    });

  //   Create new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: await bcrypt.hash(password, 10),
    mobileNo,
  });

  newUser
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        message: "Registered successfully",
      });
    })
    .catch((error) => {
      return errorHandler(error, req, res);
    });
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  //   Check if email is valid
  if (!email.includes("@") && !email.includes(".")) {
    return res.status(400).json({
      error: "Invalid email.",
    });
  } else {
    User.findOne({ email }).then((user) => {
      if (!user) {
        return res.status(404).json({
          error: "No Email Found",
        });
      } else {
        //   Check if password matches
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return errorHandler(err, req, res);
          }
          if (!isMatch) {
            return res.status(400).json({
              error: "Email and password does not match",
            });
          } else {
            const accessToken = createAccessToken(user);
            return res.status(200).json({
              access: accessToken,
            });
          }
        });
      }
    });
  }
};
