const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');


// CREAR un nuevo estudiante
router.post('/', async (req, res) => {
  try {
    const { identification, name, lastname, user, password, status } = req.body;

    if (!identification || !name || !lastname || !user || !password) {
      return res.status(400).json({
        message: 'Faltan campos requeridos: identification, name, lastname, user, password'
      });
    }

    console.log('Iniciar creacion de estudiante:', req.body);
    const student = new Student({
      identification,
      name,
      lastname,
      user,
      password,
      status: typeof status === 'boolean' ? status : true
    });

    const newStudent = await student.save();
    console.log('Estudiante creado con exito:', newStudent._id.toString());
    res.status(201).json(newStudent);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'identification o user ya existe' });
    }
    console.error('Error creando estudiante:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// CONSULTAR todos los estudiantes
router.get('/', async (req, res) => {
  try {
    console.log('Iniciar consulta de estudiantes:', req.body);
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.log('Error consulta los estudiantes:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// CONSULTAR los grupos de un estudiante específico
router.get('/:studentId/groups', async (req, res) => {
  try {
    console.log('Iniciar consulta de grupo de estudiantes:', req.body);

    const student = await Student.findById(req.params.studentId)
      .populate('groups');

    if (!student) {
      return res.status(404).json({ message: 'Estudiantes no encontrado' });
    }

    res.json(student.groups);
  } catch (err) {
    console.log('Error consulta los grupos de estudiantes:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// CONSULTAR las asignaciones (curso+grupo+profesor) de un estudiante
router.get('/:studentId/assignments', async (req, res) => {
  try {
    console.log('Iniciar consulta de asignaciones de estudiantes:', req.body);
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ message: 'Estudiantes no encontrado' });

    const assignments = await Assignment.find({ _id: { $in: student.assignments || [] } })
      .populate('group')
      .populate('course')
      .populate('teacher');

    res.json(assignments);
  } catch (err) {
    console.log('Error consulta las asignaciones de estudiantes:', err.message);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
