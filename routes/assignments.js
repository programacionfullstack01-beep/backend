const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');

// CREAR una asignación (grupo + curso + profesor)
router.post('/', async (req, res) => {
  try {
    console.log('Creando asignación:', req.body);
    const assignment = new Assignment({
      group: req.body.groupId,
      course: req.body.courseId,
      teacher: req.body.teacherId
    });
    const created = await assignment.save();
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Ya existe una asignación para ese grupo y curso' });
    }
    res.status(400).json({ message: err.message });
  }
});

// CONSULTAR todas las asignaciones (admin)
router.get('/', async (req, res) => {
  try {
    console.log('Consultando asignaciones:', req.body);
    const assignments = await Assignment.find()
      .populate('group')
      .populate('course')
      .populate('teacher');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listar estudiantes matriculados en una asignación
router.get('/:assignmentId/students', async (req, res) => {
  try {
    const students = await Student.find({ assignments: req.params.assignmentId })
      .select('name lastname user identification status');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// INSCRIBIR un estudiante en una asignación (curso + grupo + profesor)
router.post('/:assignmentId/students', async (req, res) => {
  try {
    console.log('Matriculando estudiante en asignación:', req.body);
    const assignment = await Assignment.findById(req.params.assignmentId);
    const student = await Student.findById(req.body.studentId);

    if (!assignment || !student) {
      return res.status(404).json({ message: 'Asignación o estudiante no encontrado' });
    }

    if (!student.assignments.includes(assignment._id)) {
      student.assignments.push(assignment._id);
      await student.save();
    }

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
