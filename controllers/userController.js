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

// s51
module.exports.userDetails = (req, res) => {
  if (req.body.id !== req.user.id) {
    return res.status(404).send({ message: "User not found" }); // 404 not found
  }

  return User.findById(req.user.id)
    .then((user) => {
      if (user === null)
        return res
          .status(400)
          .send({ message: "User not found" }); // 400 bad request
      else {
        user.password = "";
        return res.status(200).send(user); // 200 ok for successful retrieval
      }
    })
    .catch((error) => errorHandler(error, req, res));
};
// s51

// s51
module.exports.makeAdmin = async (req, res) => {
  try {
    const userToUpdate = await User.findById(req.body.id);
    if (!userToUpdate)
      return res.status(404).json({ message: "User not found" });

    userToUpdate.isAdmin = true;
    await userToUpdate.save();

    return res
      .status(200)
      .json({ message: `${userToUpdate.firstName} is now an admin.` });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
// s51

// s51
module.exports.resetPassword = async (req, res) => {
  try {
    const userId = req.user.id; // assumes verify middleware attaches the decoded token to req.user
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Password successfully updated." });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
// s51
