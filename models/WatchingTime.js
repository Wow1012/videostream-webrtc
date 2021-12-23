const mongoose = require("mongoose");

const WatchingTimeSchema = new mongoose.Schema({
  watcher: {
    type: mongoose.Schema.Types.ObjectId,
  },
  streamer: {
    type: mongoose.Schema.Types.ObjectId,
  },
  time: {
    type: Number,
    default: 300,
  },
});

module.exports = mongoose.model("watchingtime", WatchingTimeSchema);
