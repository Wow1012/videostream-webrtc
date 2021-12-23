const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
  },
  amount: {
    type: Number,
  },
  reason: {
    type: String,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("payment", PaymentSchema);
