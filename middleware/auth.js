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

module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.status(403).send({ auth: "Failed", message: "No Token" });
  } else {
    // removes "Bearer " - to include only the token
    token = token.slice(7, token.length);

    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
      if (err) {
        return res.send({
          auth: "Failed",
          message: err.message,
        });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  }
};

module.exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden",
    });
  }
};
