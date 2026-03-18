# Sistema de Notas

Este proyecto es un sistema para la gestión de notas escolares.

## 🚀 Instalación y Configuración

Sigue estos pasos para descargar el código y restaurar las librerías necesarias.

### 1. Clonar el proyecto
Si aún no tienes el proyecto en tu equipo, descárgalo usando git:

```bash
git clone <URL_DEL_REPOSITORIO>
```

### 2. Instalar los módulos (node_modules)
Dado que la carpeta `node_modules` no se sube al repositorio (por buenas prácticas), debes reinstalar las dependencias manualmente.

Navega hasta la carpeta `backend_PF` (donde se encuentra el archivo `package.json`) y ejecuta:

```bash
cd backend_PF
npm install
```

Esto descargará automáticamente todas las dependencias listadas en el `package.json`.

## Deploy (Render)

Si en Render “no coge” la base de datos, normalmente es por 1 de estas razones:

1) **No está seteada `MONGODB_URI` en Render** (Render no “lee” tu `.env` local automáticamente).
2) **El servicio no está apuntando al subdirectorio**: el backend vive en `backend_PF`, así que en Render configura el **Root Directory** como `backend_PF` (o ajusta los comandos para correr desde ahí).
3) **MongoDB Atlas bloquea la conexión** por configuración de red (whitelist/IP Access List).

Variables de entorno mínimas en Render:
- `MONGODB_URI`
- (Opcional) `JWT_SECRET`

Comandos típicos en Render (si Root Directory es `backend_PF`):
- Build: `npm install`
- Start: `npm start`

## DESPLIEGUE DE APLICACIÓN:
  - https://backend-ytap.onrender.com/api/
  - https://sistemdenotas.netlify.app/

## API (Postman)

La documentacion de la API en Postman se guarda dentro del repo en `docs/postman/`.

- Coleccion: `docs/postman/SistemaDeNotas.postman_collection.json`
- Environment local: `docs/postman/Local.postman_environment.json`
- Guia rapida: `docs/postman/README.md`
