const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDb = require("./config/connectDb");

// config dot env file
dotenv.config();

//databse call
connectDb();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(cors("*"));

app.use(bodyParser.json());

//routes
app.use("api/v1/users", require("./routes/userRoute"));
//transections routes
app.use("/api/v1/transactions", require("./routes/transactionRoutes"));

//port
const PORT = 8080 || process.env.PORT;

//listen server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
