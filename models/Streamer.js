const mongoose = require('mongoose');

const StreamerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileimage: {
    type: String
  },
  phonenumber: {
    type: String,
    required: true
  },
  birthday: {
      type: Date,
      required: true
  },
  country: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  zipcode: {
    type: String
  },
  gender: {
    type: String,
    required: true
  },
  biography: {
    type: String,
    minlength: 100
  }

});

module.exports = mongoose.model('streamer', StreamerSchema);
