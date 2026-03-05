const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists. Please use a different email.",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      return res.status(400).json({
        status: "fail",
        message: errors.join(". "),
      });
    }

    res.status(500).json({
      status: "error",
      message: "Something went wrong during signup",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong during login",
      error: error.message,
    });
  }
};