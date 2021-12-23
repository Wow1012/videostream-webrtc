const mongoose = require('mongoose');

const BroadcasterSchema = new mongoose.Schema({
  streamer: {
    type: mongoose.Schema.Types.ObjectId
  },
  name: {
    type: String,
    required: true
  },
  profileimage: {
    type: String
  },
  gender: {
    type: String
  },
});

module.exports = mongoose.model('broadcaster', BroadcasterSchema);
