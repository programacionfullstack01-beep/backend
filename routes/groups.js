const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const Student = require('../models/Student'); // Necesitamos el modelo de Estudiante

// CREAR un nuevo grupo (y así asignar un profesor a un curso)
router.post('/', async (req, res) => {
  try {
    console.log("Creando un nuevo grupos :", req.body)
    const group = new Group({
      name: req.body.name,
      course: req.body.courseId,
      teacher: req.body.teacherId
    });
    const newGroup = await group.save();
    res.status(201).json(newGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// CONSULTAR todos los grupos (puede ser útil para admin)
router.get('/', async (req, res) => {
  try {
    console.log("Consultando todos grupos :", req.body)
    const groups = await Group.find().populate('course').populate('teacher');
    res.json(groups);
  } catch (err) {
    console.log("Error consulta todos los grupos:", err.message)
    res.status(500).json({ message: err.message });
  }
});

// INSCRIBIR un estudiante en un grupo
router.post('/:groupId/students', async (req, res) => {
  try {
    console.log("inscribir un estudiante en un grupo :", req.body )
    const group = await Group.findById(req.params.groupId);
    const student = await Student.findById(req.body.studentId);

    if (!group || !student) {
      return res.status(404).json({ message: 'Grupo o estudiante no encontrado' });
    }

    // Añadir el grupo al estudiante si no lo tiene ya
    if (!student.groups.includes(group._id)) {
      student.groups.push(group._id);
      await student.save();
    }

    res.status(200).json(student);
  } catch (err) {
    console.log("Error escribir a un  estudiante a un grupo grupos:", err.message)
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
