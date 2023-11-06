const userModel = require("../models/userModel");

// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

//Register Callback
const registerController = async (req, res) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    if (error.name === "ValidationError" && error.errors.password) {
      // Password validation error
      const errorMessage = error.errors.password.message;
      return res.status(400).json({ error: errorMessage });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = { loginController, registerController };
