const express = require("express");
const router = express.Router();
const Payment = require("../../models/Payment");

// Verification Required Streamer
router.get("/", async (req, res) => {
  await Payment.find({}, async (err, payments) => {
    console.log(payments);
    res.json(payments);
  });
});

router.post("/", async (req, res) => {
  const { from, to, amount } = req.body;

  let payment = new Payment({
    from,
    to,
    amount,
  });

  await payment.save();
  res.json("success");
});

module.exports = router;
