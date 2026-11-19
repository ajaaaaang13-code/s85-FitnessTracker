
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "23007b7f72973fed931364a65ab6dfac1d8704a0c69d16b63289577b1303588458c7e386d43706d602a2bcab2f4dac9ee7fb984fd18cabc859cb6e95c5573b78";

// REGISTER USER
module.exports.registerUser = async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  try {
    await User.create({
      email,
      password
    });

    return res.status(201).json({
      message: "Registered successfully"
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    throw error;
  }
};

// LOGIN USER
module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim()
  }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.status(200).json({
    access: token
  });
};

// GET USER DETAILS
module.exports.details = async (req, res) => {
  const user = await User.findById(req.userId)
    .select("email isAdmin");

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    }
  });
};
