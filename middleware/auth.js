const jwt = require("jsonwebtoken");

module.exports.createAccessToken = (user) => {
  // payload - the data we want to include to our token
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};
