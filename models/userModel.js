const mongoose = require("mongoose");
const { isEmail } = require("validator"); // For email validation

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
});

module.exports = mongoose.model("User", userSchema);
