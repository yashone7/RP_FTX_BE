const _ = require("lodash");

module.exports.checkAdmin = function (req, res, next) {
  const role = req.user.role;

  if (role !== "admin") {
    return res.status(403).json({ message: "access denied" });
  }
  next();
};
