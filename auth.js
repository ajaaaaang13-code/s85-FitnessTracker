
const jwt = require("jsonwebtoken");

const JWT_SECRET = "23007b7f72973fed931364a65ab6dfac1d8704a0c69d16b63289577b1303588458c7e386d43706d602a2bcab2f4dac9ee7fb984fd18cabc859cb6e95c5573b78";

module.exports = function authenticate(req, res, next) {
  const authorization = req.get("authorization");

  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: "Authentication token required"
    });
  }

  // Verify token
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }

  // Validate token payload
  if (typeof payload === "string" || !payload.userId) {
    return res.status(401).json({
      message: "Invalid authentication token"
    });
  }

  // Store user ID in request
  req.userId = payload.userId;

  return next();
};
