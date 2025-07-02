
// s51
module.exports.userDetails = (req, res) => {
   if (req.body.id !== req.user.id) {
      return res.status(404).send({ message: "User not found" })  // 404 not found
   }

   return User.findById(req.user.id)
      .then(user => {
         if (user === null) return res.status(400).send({ message: "User not found" })  // 400 bad request
         else {
            user.password = "";
            return res.status(200).send(user);  // 200 ok for successful retrieval
         }
      })
      .catch(error => errorHandler(error, req, res));
};
// s51

// s51
module.exports.makeAdmin = async (req, res) => {
  try {
    const userToUpdate = await User.findById(req.body.id);
    if (!userToUpdate) return res.status(404).json({ message: 'User not found' });

    userToUpdate.isAdmin = true;
    await userToUpdate.save();

    return res.status(200).json({ message: `${userToUpdate.firstName} is now an admin.` });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
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

