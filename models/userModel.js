const mongoose = require("mongoose");
const { isEmail } = require("validator"); // For email validation
const bcrypt = require("../utils/bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // You can adjust the minimum password length
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: isEmail, // Validate email using the 'validator' library
      message: "Invalid email format",
    },
  },
  isEmailVerified: {
    type: Boolean,
    default: false, // Set to true when email is verified
  },
  resetToken: String,
  resetTokenExpiration: Date,
  emailVerificationToken: String,
  emailVerificationTokenExpiration: Date,
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hashPassword(this.password);
  }
  next();
});

// Generate and store a reset token
userSchema.methods.generateResetToken = async function () {
  this.resetToken = crypto.randomBytes(20).toString("hex");
  this.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
  return this.resetToken;
};

module.exports = mongoose.model("User", userSchema);
