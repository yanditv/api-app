# Documentación de WebSockets

Esta API utiliza WebSockets para comunicación en tiempo real. Los WebSockets están implementados usando Socket.IO.

## Tabla de Contenidos
1. [Instalación del Cliente](#instalación-del-cliente)
2. [Chat WebSocket](#chat-websocket)
3. [Location WebSocket](#location-websocket)
4. [Ejemplos de Implementación](#ejemplos-de-implementación)

---

## Instalación del Cliente

### Para Node.js / React Native
```bash
npm install socket.io-client
```

### Para navegadores (CDN)
```html
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
```

---

## Chat WebSocket

**Namespace:** `/chat`  
**URL de conexión:** `http://localhost:3000/chat`

### Eventos del Cliente → Servidor

#### 1. **Conexión**
```javascript
const socket = io('http://localhost:3000/chat', {
  query: { userId: 'USER_ID_AQUI' }
});
```

#### 2. **joinConversation** - Unirse a una conversación
```javascript
socket.emit('joinConversation', { 
  conversationId: 'CONVERSATION_ID' 
}, (response) => {
  console.log('Unido a la conversación:', response);
});
```

#### 3. **leaveConversation** - Salir de una conversación
```javascript
socket.emit('leaveConversation', { 
  conversationId: 'CONVERSATION_ID' 
}, (response) => {
  console.log('Salió de la conversación:', response);
});
```

#### 4. **sendMessage** - Enviar un mensaje
```javascript
socket.emit('sendMessage', {
  userId: 'USER_ID',
  conversationId: 'CONVERSATION_ID',
  content: 'Hola, ¿cómo estás?',
  type: 'text', // 'text', 'image', 'video', 'audio'
  mediaUrls: [] // Opcional: URLs de archivos multimedia
}, (response) => {
  console.log('Mensaje enviado:', response);
});
```

#### 5. **typing** - Indicador de escritura
```javascript
// Usuario está escribiendo
socket.emit('typing', {
  userId: 'USER_ID',
  conversationId: 'CONVERSATION_ID',
  isTyping: true
});

// Usuario dejó de escribir
socket.emit('typing', {
  userId: 'USER_ID',
  conversationId: 'CONVERSATION_ID',
  isTyping: false
});
```

#### 6. **markAsRead** - Marcar mensajes como leídos
```javascript
socket.emit('markAsRead', {
  userId: 'USER_ID',
  conversationId: 'CONVERSATION_ID'
}, (response) => {
  console.log('Mensajes marcados como leídos:', response);
});
```

### Eventos del Servidor → Cliente

#### 1. **newMessage** - Nuevo mensaje recibido
```javascript
socket.on('newMessage', (message) => {
  console.log('Nuevo mensaje:', message);
  /*
  {
    _id: 'MESSAGE_ID',
    conversationId: 'CONVERSATION_ID',
    sender: 'USER_ID',
    content: 'Hola!',
    type: 'text',
    mediaUrls: [],
    createdAt: '2025-10-20T...',
    read: false
  }
  */
});
```

#### 2. **userTyping** - Usuario está escribiendo
```javascript
socket.on('userTyping', (data) => {
  console.log('Usuario escribiendo:', data);
  // { userId: 'USER_ID', conversationId: 'CONVERSATION_ID' }
});
```

#### 3. **userStoppedTyping** - Usuario dejó de escribir
```javascript
socket.on('userStoppedTyping', (data) => {
  console.log('Usuario dejó de escribir:', data);
  // { userId: 'USER_ID', conversationId: 'CONVERSATION_ID' }
});
```

#### 4. **messagesRead** - Mensajes marcados como leídos
```javascript
socket.on('messagesRead', (data) => {
  console.log('Mensajes leídos:', data);
  // { userId: 'USER_ID', conversationId: 'CONVERSATION_ID' }
});
```

---

## Location WebSocket

**Namespace:** Raíz `/`  
**URL de conexión:** `http://localhost:3000`

### Eventos del Cliente → Servidor

#### 1. **Conexión**
```javascript
const locationSocket = io('http://localhost:3000', {
  query: { userId: 'USER_ID_AQUI' }
});
```

#### 2. **updateLocation** - Actualizar ubicación
```javascript
locationSocket.emit('updateLocation', {
  userId: 'USER_ID',
  latitude: -2.897880,
  longitude: -79.004320
}, (response) => {
  console.log('Ubicación actualizada:', response);
});
```

#### 3. **requestNearbyUsers** - Solicitar usuarios cercanos
```javascript
locationSocket.emit('requestNearbyUsers', {
  userId: 'USER_ID',
  maxDistance: 5000 // Distancia máxima en metros (opcional, default: 5000)
});
```

### Eventos del Servidor → Cliente

#### 1. **userOnline** - Usuario en línea
```javascript
locationSocket.on('userOnline', (data) => {
  console.log('Usuario en línea:', data);
  // { userId: 'USER_ID', isOnline: true }
});
```

#### 2. **userOffline** - Usuario desconectado
```javascript
locationSocket.on('userOffline', (data) => {
  console.log('Usuario desconectado:', data);
  // { userId: 'USER_ID', isOnline: false }
});
```

#### 3. **locationUpdated** - Ubicación actualizada
```javascript
locationSocket.on('locationUpdated', (data) => {
  console.log('Ubicación actualizada:', data);
  /*
  {
    userId: 'USER_ID',
    latitude: -2.897880,
    longitude: -79.004320,
    timestamp: '2025-10-20T...'
  }
  */
});
```

#### 4. **nearbyUsers** - Lista de usuarios cercanos
```javascript
locationSocket.on('nearbyUsers', (users) => {
  console.log('Usuarios cercanos:', users);
  /*
  [
    {
      _id: 'USER_ID',
      username: 'usuario1',
      location: {
        coordinates: [-79.004320, -2.897880]
      },
      distance: 1234 // en metros
    },
    ...
  ]
  */
});
```

---

## Ejemplos de Implementación

### 1. JavaScript Vanilla (HTML + JavaScript)

#### Chat Simple
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Chat WebSocket</title>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <div id="app">
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="Escribe un mensaje...">
    <button onclick="sendMessage()">Enviar</button>
    <div id="typing"></div>
  </div>

  <script>
    const userId = 'USER_ID_123';
    const conversationId = 'CONVERSATION_ID_456';
    
    // Conectar al chat
    const chatSocket = io('http://localhost:3000/chat', {
      query: { userId: userId }
    });

    // Eventos de conexión
    chatSocket.on('connect', () => {
      console.log('Conectado al chat');
      // Unirse a la conversación
      chatSocket.emit('joinConversation', { conversationId });
    });

    // Recibir nuevos mensajes
    chatSocket.on('newMessage', (message) => {
      const messagesDiv = document.getElementById('messages');
      const messageElement = document.createElement('div');
      messageElement.textContent = `${message.sender}: ${message.content}`;
      messagesDiv.appendChild(messageElement);
    });

    // Indicador de escritura
    chatSocket.on('userTyping', (data) => {
      if (data.userId !== userId) {
        document.getElementById('typing').textContent = 'El otro usuario está escribiendo...';
      }
    });

    chatSocket.on('userStoppedTyping', (data) => {
      document.getElementById('typing').textContent = '';
    });

    // Enviar mensaje
    function sendMessage() {
      const input = document.getElementById('messageInput');
      const content = input.value;
      
      if (content.trim()) {
        chatSocket.emit('sendMessage', {
          userId: userId,
          conversationId: conversationId,
          content: content,
          type: 'text'
        });
        input.value = '';
      }
    }

    // Detectar escritura
    let typingTimer;
    document.getElementById('messageInput').addEventListener('input', (e) => {
      clearTimeout(typingTimer);
      
      chatSocket.emit('typing', {
        userId: userId,
        conversationId: conversationId,
        isTyping: true
      });

      typingTimer = setTimeout(() => {
        chatSocket.emit('typing', {
          userId: userId,
          conversationId: conversationId,
          isTyping: false
        });
      }, 1000);
    });
  </script>
</body>
</html>
```

#### Seguimiento de Ubicación
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ubicación en Tiempo Real</title>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <div id="app">
    <h2>Ubicación en Tiempo Real</h2>
    <button onclick="startTracking()">Iniciar Seguimiento</button>
    <button onclick="stopTracking()">Detener Seguimiento</button>
    <div id="location"></div>
    <div id="nearbyUsers"></div>
  </div>

  <script>
    const userId = 'USER_ID_123';
    let trackingInterval;
    
    // Conectar al servidor de ubicación
    const locationSocket = io('http://localhost:3000', {
      query: { userId: userId }
    });

    locationSocket.on('connect', () => {
      console.log('Conectado al servidor de ubicación');
    });

    // Escuchar actualizaciones de ubicación
    locationSocket.on('locationUpdated', (data) => {
      console.log('Ubicación actualizada:', data);
      if (data.userId !== userId) {
        updateNearbyUsersList();
      }
    });

    // Escuchar usuarios en línea/offline
    locationSocket.on('userOnline', (data) => {
      console.log('Usuario en línea:', data.userId);
    });

    locationSocket.on('userOffline', (data) => {
      console.log('Usuario desconectado:', data.userId);
    });

    // Recibir usuarios cercanos
    locationSocket.on('nearbyUsers', (users) => {
      const nearbyDiv = document.getElementById('nearbyUsers');
      nearbyDiv.innerHTML = '<h3>Usuarios Cercanos:</h3>';
      users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.textContent = `${user.username} - ${Math.round(user.distance)}m de distancia`;
        nearbyDiv.appendChild(userDiv);
      });
    });

    // Función para obtener y enviar ubicación
    function updateLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          
          // Actualizar en la interfaz
          document.getElementById('location').textContent = 
            `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
          
          // Enviar al servidor
          locationSocket.emit('updateLocation', {
            userId: userId,
            latitude: latitude,
            longitude: longitude
          });
        }, (error) => {
          console.error('Error obteniendo ubicación:', error);
        });
      }
    }

    // Solicitar usuarios cercanos
    function updateNearbyUsersList() {
      locationSocket.emit('requestNearbyUsers', {
        userId: userId,
        maxDistance: 5000
      });
    }

    // Iniciar seguimiento
    function startTracking() {
      updateLocation();
      updateNearbyUsersList();
      trackingInterval = setInterval(() => {
        updateLocation();
        updateNearbyUsersList();
      }, 10000); // Actualizar cada 10 segundos
    }

    // Detener seguimiento
    function stopTracking() {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    }
  </script>
</body>
</html>
```

### 2. React / React Native

#### Hook personalizado para Chat
```javascript
// hooks/useChat.js
import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

export const useChat = (userId, conversationId) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Conectar al chat
    const chatSocket = io('http://localhost:3000/chat', {
      query: { userId }
    });

    chatSocket.on('connect', () => {
      console.log('Conectado al chat');
      setConnected(true);
      chatSocket.emit('joinConversation', { conversationId });
    });

    chatSocket.on('disconnect', () => {
      setConnected(false);
    });

    // Escuchar nuevos mensajes
    chatSocket.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Indicador de escritura
    chatSocket.on('userTyping', (data) => {
      if (data.userId !== userId) {
        setIsTyping(true);
      }
    });

    chatSocket.on('userStoppedTyping', (data) => {
      if (data.userId !== userId) {
        setIsTyping(false);
      }
    });

    setSocket(chatSocket);

    // Cleanup
    return () => {
      chatSocket.emit('leaveConversation', { conversationId });
      chatSocket.disconnect();
    };
  }, [userId, conversationId]);

  const sendMessage = useCallback((content, type = 'text', mediaUrls = []) => {
    if (socket && content.trim()) {
      socket.emit('sendMessage', {
        userId,
        conversationId,
        content,
        type,
        mediaUrls
      });
    }
  }, [socket, userId, conversationId]);

  const sendTypingStatus = useCallback((isTyping) => {
    if (socket) {
      socket.emit('typing', {
        userId,
        conversationId,
        isTyping
      });
    }
  }, [socket, userId, conversationId]);

  const markAsRead = useCallback(() => {
    if (socket) {
      socket.emit('markAsRead', {
        userId,
        conversationId
      });
    }
  }, [socket, userId, conversationId]);

  return {
    messages,
    isTyping,
    connected,
    sendMessage,
    sendTypingStatus,
    markAsRead
  };
};
```

#### Hook personalizado para Ubicación
```javascript
// hooks/useLocation.js
import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

export const useLocation = (userId) => {
  const [socket, setSocket] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Conectar al servidor de ubicación
    const locationSocket = io('http://localhost:3000', {
      query: { userId }
    });

    locationSocket.on('connect', () => {
      console.log('Conectado al servidor de ubicación');
      setConnected(true);
    });

    locationSocket.on('disconnect', () => {
      setConnected(false);
    });

    // Usuarios en línea/offline
    locationSocket.on('userOnline', (data) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]));
    });

    locationSocket.on('userOffline', (data) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    // Actualización de ubicación
    locationSocket.on('locationUpdated', (data) => {
      console.log('Ubicación actualizada:', data);
    });

    // Usuarios cercanos
    locationSocket.on('nearbyUsers', (users) => {
      setNearbyUsers(users);
    });

    setSocket(locationSocket);

    // Cleanup
    return () => {
      locationSocket.disconnect();
    };
  }, [userId]);

  const updateLocation = useCallback((latitude, longitude) => {
    if (socket) {
      socket.emit('updateLocation', {
        userId,
        latitude,
        longitude
      });
    }
  }, [socket, userId]);

  const requestNearbyUsers = useCallback((maxDistance = 5000) => {
    if (socket) {
      socket.emit('requestNearbyUsers', {
        userId,
        maxDistance
      });
    }
  }, [socket, userId]);

  return {
    nearbyUsers,
    onlineUsers,
    connected,
    updateLocation,
    requestNearbyUsers
  };
};
```

#### Componente de Chat en React
```javascript
// components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';

export const Chat = ({ userId, conversationId }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const {
    messages,
    isTyping,
    connected,
    sendMessage,
    sendTypingStatus,
    markAsRead
  } = useChat(userId, conversationId);

  // Auto-scroll a los nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Marcar como leído cuando se reciben mensajes
  useEffect(() => {
    if (messages.length > 0) {
      markAsRead();
    }
  }, [messages, markAsRead]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    
    // Enviar indicador de escritura
    sendTypingStatus(true);
    
    // Detener indicador después de 1 segundo de inactividad
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
      sendTypingStatus(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat</h2>
        <span className={connected ? 'status-online' : 'status-offline'}>
          {connected ? '● Conectado' : '○ Desconectado'}
        </span>
      </div>
      
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === userId ? 'sent' : 'received'}`}
          >
            <div className="message-content">{msg.content}</div>
            <div className="message-time">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            El otro usuario está escribiendo...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};
```

#### Componente de Mapa con Ubicación en React
```javascript
// components/LocationTracker.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from '../hooks/useLocation';

export const LocationTracker = ({ userId }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  
  const {
    nearbyUsers,
    onlineUsers,
    connected,
    updateLocation,
    requestNearbyUsers
  } = useLocation(userId);

  useEffect(() => {
    let intervalId;

    if (tracking && navigator.geolocation) {
      // Obtener ubicación inmediatamente
      getCurrentLocation();
      
      // Actualizar cada 10 segundos
      intervalId = setInterval(() => {
        getCurrentLocation();
      }, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [tracking]);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        updateLocation(latitude, longitude);
        requestNearbyUsers(5000);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
      },
      { enableHighAccuracy: true }
    );
  };

  const toggleTracking = () => {
    setTracking(!tracking);
  };

  return (
    <div className="location-tracker">
      <div className="location-header">
        <h2>Seguimiento de Ubicación</h2>
        <span className={connected ? 'status-online' : 'status-offline'}>
          {connected ? '● Conectado' : '○ Desconectado'}
        </span>
      </div>
      
      <button onClick={toggleTracking}>
        {tracking ? 'Detener Seguimiento' : 'Iniciar Seguimiento'}
      </button>
      
      {currentLocation && (
        <div className="current-location">
          <h3>Tu Ubicación:</h3>
          <p>Latitud: {currentLocation.latitude.toFixed(6)}</p>
          <p>Longitud: {currentLocation.longitude.toFixed(6)}</p>
        </div>
      )}
      
      <div className="nearby-users">
        <h3>Usuarios Cercanos ({nearbyUsers.length}):</h3>
        {nearbyUsers.map((user) => (
          <div key={user._id} className="user-card">
            <div className="user-info">
              <strong>{user.username}</strong>
              <span className={onlineUsers.has(user._id) ? 'online' : 'offline'}>
                {onlineUsers.has(user._id) ? '● En línea' : '○ Desconectado'}
              </span>
            </div>
            <div className="user-distance">
              {Math.round(user.distance)} metros de distancia
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Node.js (Backend/Testing)

```javascript
// test-websockets.js
const io = require('socket.io-client');

// Configuración
const userId = 'test-user-123';
const conversationId = 'test-conversation-456';

// ===== CHAT WEBSOCKET =====
const chatSocket = io('http://localhost:3000/chat', {
  query: { userId }
});

chatSocket.on('connect', () => {
  console.log('✅ Conectado al chat');
  
  // Unirse a una conversación
  chatSocket.emit('joinConversation', { conversationId }, (response) => {
    console.log('📥 Unido a conversación:', response);
  });
});

chatSocket.on('newMessage', (message) => {
  console.log('💬 Nuevo mensaje:', message);
});

chatSocket.on('userTyping', (data) => {
  console.log('✍️ Usuario escribiendo:', data);
});

chatSocket.on('userStoppedTyping', (data) => {
  console.log('🛑 Usuario dejó de escribir:', data);
});

// Enviar un mensaje de prueba
setTimeout(() => {
  chatSocket.emit('sendMessage', {
    userId,
    conversationId,
    content: 'Hola desde Node.js!',
    type: 'text'
  }, (response) => {
    console.log('📤 Mensaje enviado:', response);
  });
}, 2000);

// ===== LOCATION WEBSOCKET =====
const locationSocket = io('http://localhost:3000', {
  query: { userId }
});

locationSocket.on('connect', () => {
  console.log('✅ Conectado al servidor de ubicación');
});

locationSocket.on('userOnline', (data) => {
  console.log('🟢 Usuario en línea:', data);
});

locationSocket.on('userOffline', (data) => {
  console.log('🔴 Usuario desconectado:', data);
});

locationSocket.on('locationUpdated', (data) => {
  console.log('📍 Ubicación actualizada:', data);
});

locationSocket.on('nearbyUsers', (users) => {
  console.log('👥 Usuarios cercanos:', users);
});

// Actualizar ubicación de prueba
setTimeout(() => {
  locationSocket.emit('updateLocation', {
    userId,
    latitude: -2.897880,
    longitude: -79.004320
  }, (response) => {
    console.log('📍 Ubicación actualizada:', response);
    
    // Solicitar usuarios cercanos
    locationSocket.emit('requestNearbyUsers', {
      userId,
      maxDistance: 5000
    });
  });
}, 3000);

// Mantener el script ejecutándose
process.on('SIGINT', () => {
  console.log('\n👋 Desconectando...');
  chatSocket.disconnect();
  locationSocket.disconnect();
  process.exit();
});
```

---

## Manejo de Errores y Reconexión

```javascript
// Configuración de reconexión
const socket = io('http://localhost:3000/chat', {
  query: { userId: 'USER_ID' },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

// Eventos de error
socket.on('connect_error', (error) => {
  console.error('Error de conexión:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Desconectado:', reason);
  if (reason === 'io server disconnect') {
    // El servidor forzó la desconexión, reconectar manualmente
    socket.connect();
  }
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconectado después de', attemptNumber, 'intentos');
});

socket.on('reconnect_error', (error) => {
  console.error('Error de reconexión:', error);
});

socket.on('reconnect_failed', () => {
  console.error('Falló la reconexión después de todos los intentos');
});
```

---

## Mejores Prácticas

1. **Siempre desconectar al salir**: Usa eventos de limpieza para cerrar las conexiones
2. **Manejar reconexiones**: Implementa lógica de reconexión automática
3. **Validar datos**: Verifica que los datos recibidos sean válidos antes de usarlos
4. **Debouncing para typing**: Usa debounce para el indicador de escritura
5. **Optimizar frecuencia de ubicación**: No envíes actualizaciones de ubicación demasiado frecuentemente
6. **Manejo de errores**: Siempre implementa manejo de errores apropiado
7. **Autenticación**: Asegúrate de enviar el userId correcto en la conexión

---

## Notas Adicionales

- **CORS**: Los WebSockets están configurados con CORS habilitado
- **Persistencia**: Los mensajes se guardan en MongoDB
- **Escalabilidad**: Para producción, considera usar Redis Adapter para Socket.IO
- **Seguridad**: Implementa autenticación JWT para conexiones WebSocket en producción

---

## Troubleshooting

### El cliente no se conecta
- Verifica que el servidor esté ejecutándose
- Revisa la URL de conexión
- Asegúrate de que CORS esté configurado correctamente

### No se reciben eventos
- Verifica que estés conectado (`socket.connected`)
- Asegúrate de haber hecho `joinConversation` para el chat
- Revisa la consola del navegador/servidor para errores

### Mensajes duplicados
- Evita crear múltiples conexiones para el mismo usuario
- Limpia los listeners cuando el componente se desmonte (React)

---

## Recursos Adicionales

- [Documentación oficial de Socket.IO](https://socket.io/docs/)
- [Socket.IO Client API](https://socket.io/docs/v4/client-api/)
- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
