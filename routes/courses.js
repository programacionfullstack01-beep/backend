const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// CREAR un nuevo curso
router.post('/', async (req, res) => {
  try {
    console.log("Iniciado creación del curso:", req.body)

    const course = new Course({
      name: req.body.name,
      description: req.body.description
    });
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
      console.log("Error creado  cursos :", err.message )
    res.status(400).json({ message: err.message });
  }
});

// CONSULTAR todos los cursos
router.get('/', async (req, res) => {
  try {
    console.log("Iniciado consulta de cursos curso:", req.body)

    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.log("Error consulta de cursos :", err.message )
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
