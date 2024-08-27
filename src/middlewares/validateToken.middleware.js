const { verify, decode, JsonWebTokenError } = require("jsonwebtoken");
const errorHandler = require("../tools/errorHandler");
require("dotenv").config();

const validateToken = async (req, res, next) => {
  try {

    const token = req.headers["auth"];

    if (!token) {
      throw new JsonWebTokenError()

    }

    verify(token, process.env.JWT_KEY_SECRET);

    const userData = decode(token);

    req.id_user = userData.id_user
    next();
  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = {
  validateToken,
};
