module.exports.verifyToken = (req, res, next) => {
  try {
    const { token } = req.query;
    const jwtSecret = config.get("jwtSecret");
    jwt.verify(
      token,
      jwtSecret,
      { algorithms: ["HS256"] },
      (err, decodedToken) => {
        if (err) {
          return res.status(401).send({
            message: "The token that is provided is invalid or expired",
          });
        }
        return res
          .status(200)
          .send({ payload: decodedToken, message: "token verified" });
      }
    );
    next();
  } catch (err) {
    return res.status(500).send({ message: "server error" });
  }
};
