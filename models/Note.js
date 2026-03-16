const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  activityName: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  }
});

// Evitar duplicados: misma actividad para el mismo estudiante en la misma asignación
noteSchema.index({ student: 1, group: 1, activityName: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);
