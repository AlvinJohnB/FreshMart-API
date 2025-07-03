const User = require("../models/User");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../middleware/errorHandler");
const { createAccessToken } = require("../middleware/auth");

// Register a new user
module.exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobileNo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNo,
    });

    await newUser.save();
    return res.status(201).json({
      message: "Registered successfully",
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  //   Check if email is valid email format
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email." });
  } else {
    User.findOne({ email })
      .then((user) => {
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
              console.log(user)
              const accessToken = createAccessToken(user);
              return res.status(200).json({
                access: accessToken,
              });
            }
          });
        }
      })
      .catch((error) => {
        return errorHandler(error, req, res);
      });
  }
};

// s51
module.exports.userDetails = (req, res) => {
  console.log("User ID from request:", req.user.id);
  if (!req.user.id) {
    return res.status(404).send({ message: "User not found" }); // 404 not found
  }

  return User.findById(req.user.id)
    .then((user) => {
      if (user === null)
        return res.status(400).send({ message: "User not found" });
      // 400 bad request
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
    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate)
      return res.status(404).json({ message: "User not found" });

    userToUpdate.isAdmin = true;
    await userToUpdate.save();

    return res
      .status(200)
      .json({ message: `${userToUpdate.firstName} is now an admin.` });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};
// s51

// s51
module.exports.updatePassword = async (req, res) => {
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
    console.error("Password update error:", error);
    return errorHandler(error, req, res);
  }
};
// s51
