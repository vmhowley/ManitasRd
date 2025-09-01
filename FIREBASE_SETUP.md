# 🔥 Configuración de Firebase para ManitasRD

## 📋 Pasos para Configurar Firebase

### 1. Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto" o "Add project"
3. Nombra tu proyecto (ej: `manitas-rd-app`)
4. Habilita Google Analytics (opcional)
5. Crea el proyecto

### 2. Configurar Firestore Database

1. En el panel izquierdo, ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (para desarrollo)
4. Elige una ubicación (recomendado: `us-central1`)
5. Haz clic en "Listo"

### 3. Configurar Reglas de Seguridad

En la pestaña "Reglas" de Firestore, reemplaza las reglas con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para mensajes - solo usuarios autenticados pueden leer/escribir sus propios mensajes
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.senderId;
    }
    
    // Reglas para otros documentos (ajustar según necesidades)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Registrar Aplicación Web

1. En "Configuración del proyecto" (ícono de engranaje)
2. Ve a la pestaña "General"
3. En "Tus aplicaciones", haz clic en el ícono web `</>`
4. Registra la aplicación con un nombre (ej: `ManitasRD Web`)
5. **NO** marques "También configura Firebase Hosting"
6. Haz clic en "Registrar aplicación"

### 5. Obtener Credenciales

Después de registrar la aplicación, verás un objeto de configuración como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 6. Configurar Variables de Entorno

1. Copia el archivo `.env.firebase.example` a `.env.local`:
   ```bash
   cp .env.firebase.example .env.local
   ```

2. Edita `.env.local` con tus credenciales de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyC...
   VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu-proyecto
   VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### 7. Reiniciar el Servidor de Desarrollo

Después de configurar las variables de entorno:

```bash
npm run dev
```

## 🧪 Pruebas

### Verificar Conexión

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Deberías ver mensajes de conexión exitosa a Firebase
4. No deberías ver errores relacionados con Firebase

### Probar Mensajería

1. Inicia sesión con dos usuarios diferentes
2. Desde un usuario, ve a "Servicios" y haz clic en "Iniciar Chat" con un técnico
3. Envía un mensaje
4. Cambia al otro usuario y verifica que el mensaje aparezca en tiempo real

## 🔧 Desarrollo con Emulador (Opcional)

Para usar el emulador de Firebase en desarrollo:

1. Instala Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Inicia sesión:
   ```bash
   firebase login
   ```

3. Inicializa Firebase en el proyecto:
   ```bash
   firebase init firestore
   ```

4. Inicia el emulador:
   ```bash
   firebase emulators:start --only firestore
   ```

5. Agrega a tu `.env.local`:
   ```env
   VITE_FIREBASE_USE_EMULATOR=true
   ```

## 🚨 Solución de Problemas

### Error: "Firebase config is invalid"
- Verifica que todas las variables de entorno estén configuradas correctamente
- Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo

### Error: "Permission denied"
- Verifica las reglas de seguridad en Firestore
- Asegúrate de que el usuario esté autenticado

### Los mensajes no aparecen en tiempo real
- Verifica la conexión a internet
- Revisa la consola del navegador para errores
- Asegúrate de que Firestore esté configurado correctamente

## 📚 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de Firestore](https://firebase.google.com/docs/firestore)
- [Reglas de Seguridad](https://firebase.google.com/docs/firestore/security/get-started)

---

¡Una vez completada la configuración, tu aplicación ManitasRD tendrá mensajería en tiempo real con Firebase! 🎉