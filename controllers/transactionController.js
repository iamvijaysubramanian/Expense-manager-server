const transactionModel = require("../models/transactionModel");
const moment = require("moment");
const getAlltransaction = async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;
    const transactions = await transactionModel.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }),
      userid: req.body.userid,
      ...(type !== "all" && { type }),
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json(erorr);
  }
};

const deletetransaction = async (req, res) => {
  try {
    await transactionModel.findOneAndDelete({ _id: req.body.transacationId });
    res.status(200).send("Transaction Deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const edittransaction = async (req, res) => {
  try {
    await transactionModel.findOneAndUpdate(
      { _id: req.body.transacationId },
      req.body.payload
    );
    res.status(200).send("Edit SUccessfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addtransaction = async (req, res) => {
  try {
    // const newtransaction = new transactionModel(req.body);
    const newtransaction = new transactionModel(req.body);
    await newtransaction.save();
    res.status(201).send("transaction Created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAlltransaction,
  addtransaction,
  edittransaction,
  deletetransaction,
};
