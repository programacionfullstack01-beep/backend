const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { // e.g., "10A", "Sección A"
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model('Group', groupSchema);
