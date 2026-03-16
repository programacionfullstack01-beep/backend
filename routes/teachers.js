const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Assignment = require('../models/Assignment');
// CREAR un nuevo profesor
router.post('/', async (req, res) => {
  try {
    console.log('Iniciar creacion de profesor:', req.body);

    const {
      identification,
      typeIdentification,
      name,
      lastname,
      professorship,
      user,
      password,
      status
    } = req.body;

    if (!identification || !typeIdentification || !name || !lastname || !professorship || !user || !password) {
      return res.status(400).json({
        message: 'Faltan campos requeridos: identification, typeIdentification, name, lastname, professorship, user, password'
      });
    }

    const teacher = new Teacher({
      identification,
      typeIdentification,
      name,
      lastname,
      professorship,
      user,
      password,
      status: typeof status === 'boolean' ? status : true
    });

    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    if (err.code === 11000) {
      console.log('identification o user ya existe');
      return res.status(400).json({ message: 'identification o user ya existe' });
    }
    console.log('Error creando profesor:', err.message);

    res.status(400).json({ message: err.message });
  }
});

// CONSULTAR todos los profesores
router.get('/', async (req, res) => {

  try {
    console.log('Consultando todos los profesor:', req.body);
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    console.log('Error Consultando todo los profesor:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// CONSULTAR las asignaciones (grupo + curso) de un profesor específico
router.get('/:teacherId/assignments', async (req, res) => {
  try {
    console.log('Consultando los grupos del profesor:', req.body);
    const assignments = await Assignment.find({ teacher: req.params.teacherId })
      .populate('group')
      .populate('course');
    res.json(assignments);
  } catch (err) {
    console.log('Error Consultando grupos de profesores:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Alias legacy
router.get('/:teacherId/groups', async (req, res) => {
  req.url = `/${req.params.teacherId}/assignments`;
  return router.handle(req, res);
});


module.exports = router;
