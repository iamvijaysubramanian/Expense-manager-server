const User = require("../models/userModel");
const bcrypt = require("../utils/bcrypt");
const nodemailer = require("nodemailer");
const emailConfig = require("../utils/email");

// Register a new user
exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hashPassword(password);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.comparePassword(password, user.password);
    if (passwordMatch) {
      return res.json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

// Forgot password (not implemented here, but you can add functionality)
exports.forgotPassword = async (req, res) => {
  // Implement password reset functionality here
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = await user.generateResetToken();
    const resetURL = `${process.env.BASE_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport(emailConfig);
    const mailOptions = {
      to: user.email,
      from: process.env.USER,
      subject: "Password Reset",
      text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${resetURL}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json({ error: "Email could not be sent" });
      }
      res.json({ message: "Password reset link sent to your email" });
    });
  } catch (error) {
    res.status(500).json({ error: "Password reset failed" });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update the user's password and clear the reset token
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    // Save the updated user
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Password reset failed" });
  }
};
