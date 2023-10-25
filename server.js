const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDb = require("./config/connectDb");
// config dot env file
dotenv.config();

//databse call
connectDb();

//rest object
const app = express();

//middlewares
// app.use(morgan("dev"));
app.use(express.json());
app.use(cors("*"));

//routes

//user routes
app.use("/api/v1/users", require("./routes/userRoute"));
//transactions routes
app.use("/api/v1/transactions", require("./routes/transactionRoutes"));
//forgot password routes
app.use("/api/v1/password-reset", require("./routes/passwordReset"));
//password reset routes
app.use("/api/v1/auth", require("./routes/auth"));

//port
const PORT = 8080 || process.env.PORT;

//listen server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
