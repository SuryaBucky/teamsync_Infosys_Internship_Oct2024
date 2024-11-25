const jwt = require("jsonwebtoken");
require("dotenv").config();

const tokenValidation = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //extract user_id from decodes token
    const userId = decoded.user_id;
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = {tokenValidation};
