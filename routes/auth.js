const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// POST /api/auth/login
router.post('/login', async (req, res) => {

  console.log("Iniciado login:", req.body)
  const user = (req.body.user || '').trim();
  const password = (req.body.password || '').trim();
  const role = (req.body.role || '').trim().toLowerCase();

  const requestedTeacher = role === 'profesor' || role === 'teacher';
  const requestedStudent = role === 'estudiante' || role === 'student';

  if (!user || !password) {
    console.log("Usuario y contraseña vacios", req.body)
    return res.status(400).json({
      success: false,
      message: 'user y password son requeridos'
    });
  }

  try {
    if (requestedTeacher || (!requestedTeacher && !requestedStudent)) {
      const teacher = await Teacher.findOne({ user });
      if (teacher) {
        if (teacher.password !== password) {
          console.log("Contraseña incorrecta", req.body)
          return res.status(401).json({
            success: false,
            message: 'Contraseña incorrecta'
          });
        }

        return res.json({
          success: true,
          role: 'teacher',
          name: `${teacher.name} ${teacher.lastname}`.trim(),
          message: 'Authentication successful'
        });
      }
    }

    if (requestedStudent || (!requestedTeacher && !requestedStudent)) {
      const student = await Student.findOne({ user });
      if (student) {
        if (student.password !== password) {
          return res.status(401).json({
            success: false,
            message: 'Contraseña incorrecta'
          });
        }

        return res.json({
          success: true,
          role: 'student',
          name: `${student.name} ${student.lastname}`.trim(),
          message: 'Authentication successful'
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Usuario no encontrado para el rol seleccionado'
    });
  } catch (error) {
    console.log("error al realizar login:", error.message)
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
