const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema({
  streamer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("upload", UploadSchema);
