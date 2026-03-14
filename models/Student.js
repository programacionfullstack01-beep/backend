const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  identification: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  user: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }]
});

module.exports = mongoose.model('Student', studentSchema);
