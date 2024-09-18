const { verify } = require("jsonwebtoken");
const errorHandler = require("../tools/errorHandler");
require("dotenv").config();

const validateToken = async (req, res, next) => {
  try {

    const token = req.headers.auth

    if (!token && req.baseUrl === '/api/v1/post' && req.method === 'GET') {
      return next()
    }
    const data = verify(String(token), process.env.JWT_KEY_SECRET);
    req.userId = data.userId
    next();
  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = {
  validateToken,
};
