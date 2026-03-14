const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  identification: {
    type: String,
    required: true,
    unique: true
  },
  typeIdentification: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  professorship: {
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
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);
