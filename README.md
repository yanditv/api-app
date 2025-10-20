# Chat & Social Network API

API REST completa con WebSockets para aplicación de chat, ubicación en tiempo real y red social.

## 🚀 Características

### Autenticación
- ✅ Registro y login con JWT
- ✅ Protección de rutas
- ✅ Estado online/offline

### Chat en Tiempo Real
- ✅ Mensajes instantáneos con WebSockets
- ✅ Indicador de "escribiendo..."
- ✅ Mensajes leídos/no leídos
- ✅ Conversaciones 1 a 1 y grupales
- ✅ Envío de multimedia (imágenes, videos, archivos)
- ✅ Historial de mensajes

### Red Social (Posts)
- ✅ Crear, editar y eliminar posts
- ✅ Likes en posts y comentarios
- ✅ Sistema de comentarios (con respuestas)
- ✅ Feed de publicaciones
- ✅ Posts con multimedia
- ✅ Ubicación en posts

### Ubicación en Tiempo Real
- ✅ Compartir ubicación
- ✅ Usuarios cercanos
- ✅ Actualización en tiempo real

### Perfil de Usuario ⭐ NUEVO
- ✅ Perfil completo con múltiples campos
- ✅ Foto de perfil y portada
- ✅ Biografía e información personal
- ✅ Información profesional (ocupación, empresa)
- ✅ Intereses y hobbies
- ✅ Enlaces de redes sociales
- ✅ Estado de perfil completado

### Multimedia
- ✅ Subida de imágenes (optimización automática)
- ✅ Subida de videos
- ✅ Subida múltiple de archivos

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración

Crear archivo `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
```

## 🏃 Ejecutar

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📚 Documentación API

Swagger UI: `http://localhost:3000/api/docs`

## 🔌 WebSocket Events

### Chat Namespace (`/chat`)

**Cliente → Servidor:**
- `joinConversation`: Unirse a conversación
- `leaveConversation`: Salir de conversación
- `sendMessage`: Enviar mensaje
- `typing`: Indicar que está escribiendo
- `markAsRead`: Marcar mensajes como leídos

**Servidor → Cliente:**
- `newMessage`: Nuevo mensaje recibido
- `userTyping`: Usuario está escribiendo
- `userStoppedTyping`: Usuario dejó de escribir
- `messagesRead`: Mensajes marcados como leídos

### Location Namespace (default)

**Cliente → Servidor:**
- `updateLocation`: Actualizar ubicación
- `requestNearbyUsers`: Solicitar usuarios cercanos

**Servidor → Cliente:**
- `locationUpdated`: Ubicación actualizada
- `nearbyUsers`: Lista de usuarios cercanos
- `userOnline`: Usuario conectado
- `userOffline`: Usuario desconectado

## 📡 Endpoints Principales

### Auth
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión

### Users
- `GET /users/profile` - Perfil actual
- `PATCH /users/profile` - **Actualizar perfil completo** ⭐ NUEVO
- `GET /users` - Listar usuarios
- `GET /users/nearby` - Usuarios cercanos
- `PUT /users/location` - Actualizar ubicación
- `GET /users/:id` - Ver perfil de usuario

### Chat
- `POST /chat/conversations` - Crear conversación
- `GET /chat/conversations` - Mis conversaciones
- `GET /chat/conversations/:id/messages` - Mensajes de conversación
- `POST /chat/messages` - Enviar mensaje (HTTP)
- `DELETE /chat/messages/:id` - Eliminar mensaje

### Posts
- `POST /posts` - Crear post
- `GET /posts/feed` - Feed de posts
- `GET /posts/:id` - Ver post
- `PUT /posts/:id` - Editar post
- `DELETE /posts/:id` - Eliminar post
- `POST /posts/:id/like` - Like/Unlike post
- `POST /posts/:id/comments` - Comentar post
- `GET /posts/:id/comments` - Ver comentarios
- `POST /posts/comments/:id/like` - Like/Unlike comentario
- `DELETE /posts/comments/:id` - Eliminar comentario

### Upload
- `POST /upload/image` - Subir imagen
- `POST /upload/video` - Subir video
- `POST /upload/multiple` - Subir múltiples archivos

## 🛠️ Arquitectura

This is a full-stack application built with Node.js and Express, using MongoDB as the database and WebSockets for real-time communication.

The application consists of the following components:

- **Frontend**: A web application built with React.js and Redux, providing a user interface for chat, location sharing, and social networking.
- **Backend**: A server built with Node.js and Express, handling user authentication, chat, posts, and location data.
- **Database**: MongoDB, storing user profiles, messages, posts, and location data.
- **Real-time communication**: WebSockets, enabling real-time messaging and location updates.

The application follows the MVC (Model-View-Controller) pattern, with the following components:

- **Model**: The database and data structures.
- **View**: The user interface.
- **Controller**: The logic and business rules.

The application is designed to be scalable and maintainable, with clear separation of concerns and modular code.

## 📖 Documentación Adicional

- **[WEBSOCKETS.md](WEBSOCKETS.md)** - Documentación completa de WebSockets con ejemplos
- **[PROFILE-API.md](PROFILE-API.md)** - ⭐ Documentación de API de Perfil de Usuario
- **[examples/profile-demo.html](examples/profile-demo.html)** - ⭐ Demo HTML interactivo del perfil

## 🎯 Nuevas Características de Perfil

El sistema de perfil de usuario ahora incluye:

### Campos Personales
- 👤 Nombre completo
- 📝 Biografía
- 📞 Teléfono
- 🎂 Fecha de nacimiento
- ⚧️ Género (male, female, other, prefer-not-to-say)
- 📷 Foto de perfil (avatar)
- 🖼️ Foto de portada

### Campos Profesionales
- 💼 Ocupación
- 🏢 Empresa
- 🌐 Sitio web/portafolio

### Intereses y Social
- 🎨 Lista de intereses y hobbies
- 📱 Enlaces de redes sociales (Facebook, Instagram, Twitter, LinkedIn)

### Estado del Perfil
- ✅ Indicador de perfil completado
- 🕐 Última conexión
- 🌍 Ubicación actual

## 🚀 Ejemplo Rápido - Actualizar Perfil

```javascript
// Obtener perfil actual
const response = await fetch('http://localhost:3000/users/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const profile = await response.json();

// Actualizar perfil
await fetch('http://localhost:3000/users/profile', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Juan Pérez',
    bio: 'Desarrollador Full Stack',
    avatar: 'https://example.com/avatar.jpg',
    occupation: 'Software Engineer',
    interests: ['programación', 'viajes', 'fotografía'],
    socialMedia: {
      linkedin: 'https://linkedin.com/in/juanperez'
    }
  })
});
```

## 🎨 Demo Interactivo

Abre `examples/profile-demo.html` en tu navegador para probar la funcionalidad de perfil con una interfaz visual completa.

## 📝 Licencia

MIT

