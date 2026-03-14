const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno (desde backend_PF/.env si existe, sin sobreescribir env vars del sistema)
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 4020;

// CORS básico (útil si el frontend corre en otro puerto, p. ej. Live Server)
// - En producción, recomienda setear CORS_ORIGINS="https://tu-front.com,https://otro.com"
const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isProd = process.env.NODE_ENV === 'production';

  if (origin) {
    const allowed =
      corsOrigins.length > 0 ? corsOrigins.includes(origin) : !isProd;

    if (allowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Middleware para entender JSON
app.use(express.json());

// Servir archivos estáticos desde el directorio del frontend
// Nota: en este repo el folder se llama 'frondend' (así está escrito en disco).
app.use(express.static(path.join(__dirname, '../frondend')));

// Conectar a MongoDB
if (!process.env.MONGODB_URI) {
  console.error('Falta la variable de entorno MONGODB_URI');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a la base de datos MongoDB');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

// --- Rutas ---
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);
app.use('/api/auth', authRouter);

const studentsRouter = require('./routes/students');
app.use('/students', studentsRouter);
app.use('/api/students', studentsRouter);

const teachersRouter = require('./routes/teachers');
app.use('/teachers', teachersRouter);
app.use('/api/teachers', teachersRouter);

const coursesRouter = require('./routes/courses');
app.use('/courses', coursesRouter);
app.use('/api/courses', coursesRouter);

const groupsRouter = require('./routes/groups');
app.use('/groups', groupsRouter);
app.use('/api/groups', groupsRouter);

const notesRouter = require('./routes/notes');
app.use('/notes', notesRouter);
app.use('/api/notes', notesRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frondend/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frondend/index.html'));
});

// Cualquier ruta no API vuelve al login como página inicial.
app.get(/^\/(?!auth|students|teachers|courses|groups|notes).*/, (req, res) => {
  res.redirect('/');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
