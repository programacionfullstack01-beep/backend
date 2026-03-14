const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { // e.g., "Grupo 1", "Sección A"
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }
});

// Para evitar que el mismo profesor de el mismo grupo del mismo curso dos veces.
groupSchema.index({ course: 1, teacher: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Group', groupSchema);
