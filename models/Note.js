const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  grade: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  }
});

// To prevent a student from having multiple notes for the same group
noteSchema.index({ student: 1, group: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);
