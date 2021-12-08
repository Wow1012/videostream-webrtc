const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  logo: {
    type: String,
  },
  genders: {
    type: Array,
  },
  theme: {
    type: Array,
  },
  language: {
    type: Array,
  },
  payment: {
    type: Array,
  },
});

module.exports = mongoose.model('setting', SettingSchema);
