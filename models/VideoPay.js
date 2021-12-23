const mongoose = require("mongoose");

const VideoPaySchema = new mongoose.Schema({
  watcher: {
    type: mongoose.Schema.Types.ObjectId,
  },
  streamer: {
    type: mongoose.Schema.Types.ObjectId,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
  },
  paid: {
    type: Number,
    default: 0,
  },
  paidTime: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("videopay", VideoPaySchema);
