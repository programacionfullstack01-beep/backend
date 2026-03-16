const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Cargar variables de entorno (desde backend_PF/.env si existe, sin sobreescribir env vars del sistema)
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 4020;

// CORS básico (útil si el frontend corre en otro puerto, p. ej. Live Server)
// - Si defines CORS_ORIGINS, se restringe a esos orígenes (separados por coma).
// - Si NO defines CORS_ORIGINS, permite cualquier origen (modo dev-friendly).
const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin) {
    const allowed =
      corsOrigins.length > 0 ? corsOrigins.includes(origin) : true;

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

function firstExistingPath(candidates) {
  for (const candidate of candidates) {
    try {
      if (candidate && fs.existsSync(candidate)) return candidate;
    } catch {
      // ignore
    }
  }
  return null;
}

// Servir archivos estáticos desde el directorio del frontend
// (Tolerante a nombres distintos para evitar crashes en deploys)
const frontendDir = process.env.FRONTEND_DIR
  ? path.resolve(__dirname, process.env.FRONTEND_DIR)
  : firstExistingPath([
    path.join(__dirname, '../frondend'),
    path.join(__dirname, '../frontend'),
    path.join(__dirname, '../frontend_PF'),
    path.join(__dirname, '../frondend_PF')
  ]);

if (frontendDir) {
  app.use(express.static(frontendDir));
  console.log('Frontend estático:', frontendDir);
} else {
  console.warn('No se encontró directorio de frontend para servir estáticos. Define FRONTEND_DIR si aplica.');
}

const indexFile = firstExistingPath([
  frontendDir ? path.join(frontendDir, 'index.html') : null,
  path.join(__dirname, '../frondend/index.html'),
  path.join(__dirname, '../frontend/index.html'),
  path.join(__dirname, '../frontend_PF/index.html'),
  path.join(__dirname, '../frondend_PF/index.html')
]);

// Conectar a MongoDB
if (!process.env.MONGODB_URI) {
  console.error('Falta la variable de entorno MONGODB_URI');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a la base de datos MongoDB');

    // Migración opcional: eliminar índice legacy que impedía varias notas por curso/grupo.
    // Activar solo una vez con: DROP_LEGACY_NOTE_INDEX=true
    if (String(process.env.DROP_LEGACY_NOTE_INDEX || '').toLowerCase() === 'true') {
      (async () => {
        try {
          const Note = require('./models/Note');
          const indexes = await Note.collection.indexes();
          const legacy = indexes.find((idx) => {
            const key = idx?.key || {};
            return idx?.unique === true &&
              key.student === 1 &&
              key.group === 1 &&
              Object.keys(key).length === 2;
          });

          if (legacy?.name) {
            await Note.collection.dropIndex(legacy.name);
            console.log(`Índice legacy eliminado en notes: ${legacy.name}`);
          } else {
            console.log('No se encontró índice legacy (student+group) en notes.');
          }
        } catch (err) {
          console.warn('No se pudo eliminar el índice legacy de notes:', err?.message || err);
        }
      })();
    }
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

const assignmentsRouter = require('./routes/assignments');
app.use('/assignments', assignmentsRouter);
app.use('/api/assignments', assignmentsRouter);

const notesRouter = require('./routes/notes');
app.use('/notes', notesRouter);
app.use('/api/notes', notesRouter);

app.get('/', (req, res) => {
  if (!indexFile) return res.status(500).send('No se encontró index.html del frontend en el servidor.');
  res.sendFile(indexFile);
});

app.get('/login', (req, res) => {
  if (!indexFile) return res.status(500).send('No se encontró index.html del frontend en el servidor.');
  res.sendFile(indexFile);
});

// Cualquier ruta no API vuelve al login como página inicial.
app.get(/^\/(?!api|auth|students|teachers|courses|groups|notes).*/, (req, res) => {
  res.redirect('/');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
