# API de Perfil de Usuario

Esta documentación describe los endpoints disponibles para gestionar el perfil de usuario.

## Tabla de Contenidos
1. [Obtener Perfil](#obtener-perfil)
2. [Actualizar Perfil](#actualizar-perfil)
3. [Campos del Perfil](#campos-del-perfil)
4. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Obtener Perfil

**Endpoint:** `GET /users/profile`  
**Autenticación:** Requerida (JWT Bearer Token)

### Respuesta

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "Desarrollador apasionado por la tecnología",
  "phone": "+593987654321",
  "dateOfBirth": "1990-01-15T00:00:00.000Z",
  "gender": "male",
  "occupation": "Ingeniero de Software",
  "company": "Tech Solutions Inc.",
  "website": "https://miportfolio.com",
  "interests": ["programación", "viajes", "fotografía"],
  "socialMedia": {
    "facebook": "https://facebook.com/usuario",
    "instagram": "https://instagram.com/usuario",
    "twitter": "https://twitter.com/usuario",
    "linkedin": "https://linkedin.com/in/usuario"
  },
  "coverPhoto": "https://example.com/cover.jpg",
  "isActive": true,
  "isOnline": true,
  "lastSeen": "2025-10-20T15:30:00.000Z",
  "location": {
    "latitude": -2.897880,
    "longitude": -79.004320,
    "updatedAt": "2025-10-20T15:30:00.000Z"
  },
  "profileCompleted": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-10-20T15:30:00.000Z"
}
```

---

## Actualizar Perfil

**Endpoint:** `PATCH /users/profile`  
**Autenticación:** Requerida (JWT Bearer Token)

### Request Body

Todos los campos son opcionales. Solo envía los campos que deseas actualizar.

```json
{
  "name": "Juan Pérez",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "Desarrollador apasionado por la tecnología",
  "phone": "+593987654321",
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "occupation": "Ingeniero de Software",
  "company": "Tech Solutions Inc.",
  "website": "https://miportfolio.com",
  "interests": ["programación", "viajes", "fotografía"],
  "socialMedia": {
    "facebook": "https://facebook.com/usuario",
    "instagram": "https://instagram.com/usuario",
    "twitter": "https://twitter.com/usuario",
    "linkedin": "https://linkedin.com/in/usuario"
  },
  "coverPhoto": "https://example.com/cover.jpg"
}
```

### Respuesta

Retorna el perfil actualizado con la misma estructura que `GET /users/profile`.

### Subir Avatar

**Endpoint:** `POST /users/profile/avatar`  
**Autenticación:** Requerida (JWT Bearer Token)  
**Content-Type:** multipart/form-data  

Sube una imagen y actualiza el campo `avatar` del perfil con la URL resultante. Usa el campo `file` en el form-data.

#### Ejemplo (curl)
```bash
curl -X POST http://localhost:3000/users/profile/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/ruta/a/mi-avatar.jpg"
```

#### Ejemplo (Fetch API)
```javascript
const token = localStorage.getItem('token');
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:3000/users/profile/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData
})
  .then(res => res.json())
  .then(data => console.log('Perfil actualizado:', data))
  .catch(err => console.error(err));
```

#### Ejemplo (Axios)
```javascript
import axios from 'axios';

const token = localStorage.getItem('token');
const formData = new FormData();
formData.append('file', fileInput.files[0]);

axios.post('http://localhost:3000/users/profile/avatar', formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
}).then(res => console.log(res.data)).catch(err => console.error(err));
```

---

## Campos del Perfil

### Campos Básicos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | String | No | Nombre completo del usuario |
| `avatar` | String (URL) | No | URL de la foto de perfil |
| `bio` | String | No | Biografía o descripción personal |
| `phone` | String | No | Número de teléfono |
| `dateOfBirth` | Date | No | Fecha de nacimiento (formato ISO 8601) |

### Campos Profesionales

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `occupation` | String | No | Ocupación o profesión |
| `company` | String | No | Empresa donde trabaja |
| `website` | String (URL) | No | Sitio web personal o portafolio |

### Campos Personales

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `gender` | String | No | Género: `male`, `female`, `other`, `prefer-not-to-say` |
| `interests` | Array[String] | No | Lista de intereses o hobbies |
| `coverPhoto` | String (URL) | No | URL de la foto de portada |

### Redes Sociales

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `socialMedia.facebook` | String (URL) | No | URL del perfil de Facebook |
| `socialMedia.instagram` | String (URL) | No | URL del perfil de Instagram |
| `socialMedia.twitter` | String (URL) | No | URL del perfil de Twitter |
| `socialMedia.linkedin` | String (URL) | No | URL del perfil de LinkedIn |

### Campos del Sistema

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `profileCompleted` | Boolean | Indica si el perfil está completo (automático) |
| `isOnline` | Boolean | Estado de conexión en línea |
| `isActive` | Boolean | Si la cuenta está activa |
| `lastSeen` | Date | Última vez que el usuario estuvo en línea |

---

## Ejemplos de Uso

### 1. JavaScript (Fetch API)

#### Obtener Perfil
```javascript
// Obtener token del localStorage
const token = localStorage.getItem('token');

fetch('http://localhost:3000/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
    console.log('Perfil:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

#### Actualizar Perfil Completo
```javascript
const token = localStorage.getItem('token');

const profileData = {
  name: 'Juan Pérez Actualizado',
  avatar: 'https://example.com/new-avatar.jpg',
  bio: 'Desarrollador Full Stack especializado en Node.js y React',
  phone: '+593987654321',
  dateOfBirth: '1990-01-15',
  gender: 'male',
  occupation: 'Senior Software Engineer',
  company: 'Tech Innovations Corp.',
  website: 'https://juanperez.dev',
  interests: ['programación', 'inteligencia artificial', 'viajes', 'fotografía'],
  socialMedia: {
    facebook: 'https://facebook.com/juanperez',
    instagram: 'https://instagram.com/juanperez',
    twitter: 'https://twitter.com/juanperez',
    linkedin: 'https://linkedin.com/in/juanperez'
  },
  coverPhoto: 'https://example.com/cover-photo.jpg'
};

fetch('http://localhost:3000/users/profile', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(profileData)
})
  .then(response => response.json())
  .then(data => {
    console.log('Perfil actualizado:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

#### Actualización Parcial (Solo algunos campos)
```javascript
const token = localStorage.getItem('token');

// Actualizar solo el avatar y la biografía
const partialUpdate = {
  avatar: 'https://example.com/new-avatar.jpg',
  bio: 'Nueva biografía actualizada'
};

fetch('http://localhost:3000/users/profile', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(partialUpdate)
})
  .then(response => response.json())
  .then(data => {
    console.log('Perfil actualizado:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### 2. Axios (JavaScript/Node.js)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000';
const token = localStorage.getItem('token');

// Configurar axios con el token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Obtener perfil
async function getProfile() {
  try {
    const response = await api.get('/users/profile');
    console.log('Perfil:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo perfil:', error.response?.data);
  }
}

// Actualizar perfil
async function updateProfile(profileData) {
  try {
    const response = await api.patch('/users/profile', profileData);
    console.log('Perfil actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error actualizando perfil:', error.response?.data);
  }
}

// Ejemplo de uso
updateProfile({
  name: 'Juan Pérez',
  bio: 'Desarrollador apasionado',
  interests: ['programación', 'viajes']
});
```

### 3. React Hook Personalizado

```javascript
// hooks/useProfile.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000';
  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Obtener perfil
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/profile');
      setProfile(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener perfil');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.patch('/users/profile', profileData);
      setProfile(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile
  };
};
```

#### Componente de Perfil en React

```javascript
// components/ProfileEditor.jsx
import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';

export const ProfileEditor = () => {
  const { profile, loading, error, updateProfile } = useProfile();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  // Inicializar formulario cuando se cargue el perfil
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        occupation: profile.occupation || '',
        company: profile.company || '',
        website: profile.website || '',
        interests: profile.interests || [],
        gender: profile.gender || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestsChange = (e) => {
    const interests = e.target.value.split(',').map(i => i.trim());
    setFormData(prev => ({
      ...prev,
      interests
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile(formData);
      alert('Perfil actualizado exitosamente!');
    } catch (err) {
      alert('Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No hay perfil disponible</div>;

  return (
    <div className="profile-editor">
      <h2>Editar Perfil</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre completo"
          />
        </div>

        <div className="form-group">
          <label>Biografía:</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Cuéntanos sobre ti..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+593987654321"
          />
        </div>

        <div className="form-group">
          <label>Género:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
            <option value="prefer-not-to-say">Prefiero no decir</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ocupación:</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Ej: Ingeniero de Software"
          />
        </div>

        <div className="form-group">
          <label>Empresa:</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Nombre de tu empresa"
          />
        </div>

        <div className="form-group">
          <label>Sitio Web:</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://tuportfolio.com"
          />
        </div>

        <div className="form-group">
          <label>Intereses (separados por coma):</label>
          <input
            type="text"
            value={formData.interests.join(', ')}
            onChange={handleInterestsChange}
            placeholder="programación, viajes, fotografía"
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>

      <div className="profile-status">
        <p>
          Estado del perfil: {' '}
          <strong>
            {profile.profileCompleted ? '✅ Completo' : '⚠️ Incompleto'}
          </strong>
        </p>
      </div>
    </div>
  );
};
```

### 4. React Native

```javascript
// services/profileService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const profileService = {
  getProfile: async () => {
    const token = await getToken();
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateProfile: async (profileData) => {
    const token = await getToken();
    const response = await axios.patch(`${API_URL}/users/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
```

```javascript
// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import { profileService } from '../services/profileService';

export const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    occupation: '',
    company: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        bio: data.bio || '',
        phone: data.phone || '',
        occupation: data.occupation || '',
        company: data.company || ''
      });
    } catch (error) {
      console.error('Error cargando perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updated = await profileService.updateProfile(formData);
      setProfile(updated);
      alert('Perfil actualizado exitosamente!');
    } catch (error) {
      alert('Error actualizando perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        placeholder="Tu nombre"
      />

      <Text style={styles.label}>Biografía</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={formData.bio}
        onChangeText={(text) => setFormData({ ...formData, bio: text })}
        placeholder="Cuéntanos sobre ti..."
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        placeholder="+593987654321"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Ocupación</Text>
      <TextInput
        style={styles.input}
        value={formData.occupation}
        onChangeText={(text) => setFormData({ ...formData, occupation: text })}
        placeholder="Tu ocupación"
      />

      <Text style={styles.label}>Empresa</Text>
      <TextInput
        style={styles.input}
        value={formData.company}
        onChangeText={(text) => setFormData({ ...formData, company: text })}
        placeholder="Nombre de tu empresa"
      />

      <Button
        title={loading ? "Guardando..." : "Guardar Cambios"}
        onPress={handleUpdate}
        disabled={loading}
      />

      {profile && (
        <Text style={styles.status}>
          Perfil: {profile.profileCompleted ? '✅ Completo' : '⚠️ Incompleto'}
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center'
  }
});
```

### 5. cURL (Testing/Desarrollo)

#### Obtener Perfil
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Actualizar Perfil
```bash
curl -X PATCH http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "bio": "Desarrollador Full Stack",
    "phone": "+593987654321",
    "occupation": "Software Engineer",
    "company": "Tech Solutions",
    "interests": ["programación", "viajes", "música"]
  }'
```

---

## Validaciones

### URLs
- Los campos `avatar`, `coverPhoto`, `website` y redes sociales deben ser URLs válidas
- Formato: `https://example.com` o `http://example.com`

### Teléfono
- Formato recomendado: Incluir código de país
- Ejemplo: `+593987654321`

### Fecha de Nacimiento
- Formato ISO 8601: `YYYY-MM-DD`
- Ejemplo: `1990-01-15`

### Género
- Valores permitidos: `male`, `female`, `other`, `prefer-not-to-say`

### Intereses
- Array de strings
- Cada interés debe ser un string no vacío

---

## Estado del Perfil

El campo `profileCompleted` se marca como `true` automáticamente cuando el usuario completa estos campos mínimos:
- ✅ `avatar`
- ✅ `bio`
- ✅ `phone`
- ✅ `dateOfBirth`

---

## Errores Comunes

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Solución:** Verificar que el token JWT sea válido y esté incluido en el header.

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["avatar must be a URL address"],
  "error": "Bad Request"
}
```
**Solución:** Verificar que los datos cumplan con las validaciones.

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Usuario no encontrado"
}
```
**Solución:** El usuario no existe en la base de datos.

---

## Notas Importantes

1. **Seguridad:** Nunca se retorna el campo `password` en las respuestas
2. **Actualización Parcial:** Solo envía los campos que quieres actualizar
3. **Validación:** Todos los campos son opcionales en la actualización
4. **URLs:** Asegúrate de que las URLs sean válidas y accesibles
5. **Token JWT:** Debe incluirse en todas las peticiones

---

## Próximas Mejoras

- [ ] Subida de avatar directamente (integración con upload)
- [ ] Validación de URLs de redes sociales más estricta
- [ ] Verificación de teléfono
- [ ] Privacidad de perfil (público/privado)
- [ ] Historial de cambios de perfil
