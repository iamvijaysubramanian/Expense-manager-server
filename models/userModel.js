const mongoose = require("mongoose");
const validator = require("validator");

//schema design
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required and should be unique"],
      unique: true,
      validate: {
        validator: (value) => {
          return validator.isEmail(value);
        },
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      validate: {
        validator: (value) => {
          const passwordRegex =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
          return passwordRegex.test(value);
        },
        message:
          "Password must be at least 8 characters long and contain at least 1 uppercase letter and 1 special character.",
      },
    },
  },
  { timestamps: true }
);

//export
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
