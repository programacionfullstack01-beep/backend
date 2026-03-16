const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Crear una nueva nota
router.post('/', async (req, res) => {
  try {
    console.log("Creando una nueva nota :", req.body)
    const newNote = new Note(req.body);
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.log("Error Creando una nueva nota :", error.message)

    if (error.code === 11000) {
      const keyPattern = error?.keyPattern || {};
      const isLegacyStudentGroupUnique =
        keyPattern.student === 1 &&
        keyPattern.group === 1 &&
        !("activityName" in keyPattern);

      if (isLegacyStudentGroupUnique) {
        return res.status(400).json({
          message: 'Tu base de datos aún tiene el índice único viejo (student+group) y por eso solo deja 1 nota por curso. Elimina ese índice para permitir varias actividades.'
        });
      }

      return res.status(400).json({ message: 'Ya existe una nota para esa actividad' });
    }
    console.log("Error Creando una nueva nota :", error.message)
    res.status(400).json({ message: error.message });
  }
});

// Obtener las notas de una asignación (curso+grupo+profesor)
router.get('/assignment/:assignmentId', async (req, res) => {
  try {
    const notes = await Note.find({ group: req.params.assignmentId })
      .populate('student', 'name lastname user')
      .populate({
        path: 'group',
        populate: [
          { path: 'group', model: 'Group' },
          { path: 'course', model: 'Course' },
          { path: 'teacher', model: 'Teacher' }
        ]
      });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener las notas de un estudiante
router.get('/student/:studentId', async (req, res) => {
  try {
    console.log("Obteniendo nota :", req.body)
    const notes = await Note.find({ student: req.params.studentId }).populate({
      path: 'group',
      populate: [
        { path: 'group', model: 'Group' },
        { path: 'course', model: 'Course' },
        { path: 'teacher', model: 'Teacher' }
      ]
    });
    res.json(notes);
  } catch (error) {
    console.log("Error obtener una nueva nota :", error.message)
    res.status(500).json({ message: error.message });
  }
});

// Actualizar una nota
router.put('/:noteId', async (req, res) => {
  try {
    console.log("Acttualizar una nota :", req.body)
    const updatedNote = await Note.findByIdAndUpdate(req.params.noteId, req.body, { new: true });
    res.json(updatedNote);
  } catch (error) {
    console.log("Error Actualizando una nueva nota :", error.message)
    res.status(400).json({ message: error.message });
  }
});

// Eliminar una nota
router.delete('/:noteId', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.noteId);
    console.log("Eliminar una nota :", req.body)
    res.json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    console.log("Error Eliminar una nueva nota :", error.message)
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
