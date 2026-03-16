const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
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

// Evitar duplicados: mismo grupo + curso
assignmentSchema.index({ group: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);

