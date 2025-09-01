# Firebase Seeding System

Este documento explica cómo usar el sistema de seeding para poblar Firebase Firestore con datos de prueba.

## 📁 Archivos Creados

- `src/services/firebaseSeed.ts` - Datos y funciones básicas de seeding
- `src/services/seedService.ts` - Servicio completo para operaciones de seeding
- `scripts/seed.ts` - Script ejecutable desde línea de comandos

## 🚀 Comandos Disponibles

### Seeding Completo
```bash
npm run seed
# o
npm run seed all
```
Ejecuta el proceso completo: limpia datos existentes y siembra servicios y usuarios.

### Seeding Específico
```bash
# Solo servicios
npm run seed:services

# Solo usuarios
npm run seed:users

# Limpiar todas las colecciones
npm run seed:clear

# Ver estadísticas de las colecciones
npm run seed:stats

# Ver ayuda
npm run seed:help

# Scripts simplificados (sin Auth)
npm run seed:services-only  # Solo agregar servicios
npm run seed:stats-only     # Solo ver estadísticas
```

## 📊 Datos Incluidos

### Servicios
El sistema incluye servicios de ejemplo en las siguientes categorías:
- **Plomería**: Instalación de inodoros, reparación de grifos, etc.
- **Electricidad**: Instalación de tomacorrientes, abanicos de techo, etc.
- **Pintura**: Pintura de habitaciones, techos, exteriores, etc.
- **Jardinería**: Corte de césped, poda de arbustos, mantenimiento, etc.
- **Limpieza**: Limpieza general, oficinas, post-construcción, etc.
- **Carpintería**: Reparación de muebles, instalación de puertas, etc.
- **Automotriz**: Cambio de aceite, revisión de frenos, diagnósticos, etc.

### Usuarios de Prueba
Se crean usuarios de ejemplo tanto clientes como técnicos:

**Clientes:**
- cliente1@test.com / password123
- cliente2@test.com / password123

**Técnicos:**
- tecnico1@test.com / password123 (Plomería, Electricidad)
- tecnico2@test.com / password123 (Pintura, Limpieza)

## 🛠️ Uso Programático

También puedes usar el servicio directamente en tu código:

```typescript
import { SeedService } from './src/services/seedService';

// Seeding completo
await SeedService.runFullSeed();

// Solo servicios
await SeedService.seedServices();

// Solo usuarios
await SeedService.seedUsers();

// Limpiar colección específica
await SeedService.clearCollection('services');

// Ver estadísticas
const stats = await SeedService.getCollectionStats();
```

## 🔧 Personalización

### Agregar Servicios Personalizados
```typescript
const customServices = [
  {
    name: 'Mi Servicio Personalizado',
    category: 'Mi Categoría',
    description: 'Descripción del servicio',
    basePrice: 1000,
    priceModifiers: [
      { name: 'Opción extra', additionalCost: 200 }
    ]
  }
];

await SeedService.seedServices(customServices);
```

### Agregar Usuarios Personalizados
```typescript
const customUsers = [
  {
    email: 'mi-usuario@test.com',
    password: 'password123',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: '+1234567890',
    userType: 'client' as const
  }
];

await SeedService.seedUsers(customUsers);
```

## ⚠️ Consideraciones Importantes

1. **Datos de Prueba**: Los datos incluidos son solo para desarrollo y pruebas.
2. **Limpieza**: El comando `seed:clear` eliminará TODOS los datos de las colecciones.
3. **Usuarios**: Los usuarios se crean tanto en Firebase Auth como en Firestore.
4. **Contraseñas**: Todas las contraseñas de prueba son "password123".
5. **Conexión**: Asegúrate de que tu configuración de Firebase esté correcta antes de ejecutar.

## 🔍 Verificación

Después de ejecutar el seeding, puedes verificar los datos:

1. **Firebase Console**: Ve a tu proyecto en Firebase Console
2. **Firestore Database**: Revisa las colecciones `services` y `users`
3. **Authentication**: Verifica que los usuarios se crearon en la sección Auth
4. **Aplicación**: Los servicios deberían aparecer en tu aplicación

## 🐛 Solución de Problemas

### Error de API Key
Si encuentras errores `auth/invalid-api-key`:
1. **Elimina las comillas de las variables de entorno**: Las variables en `.env` NO deben tener comillas
   ```bash
   # ❌ Incorrecto - con comillas
   VITE_FIREBASE_API_KEY="tu-api-key"
   
   # ✅ Correcto - sin comillas
   VITE_FIREBASE_API_KEY=tu-api-key
   ```
2. Reinicia tu servidor de desarrollo después de cambiar `.env`
3. Verifica que todas las variables de entorno de Firebase estén configuradas correctamente

### Error de Autenticación
```
Error: Firebase Auth not configured
```
**Solución**: Verifica que tu archivo `.env` tenga las variables de Firebase correctas.

### Configuración de Autenticación
Si encuentras errores `auth/configuration-not-found`:
1. Habilita los métodos de autenticación en Firebase Console
2. Ve a: `https://console.firebase.google.com/project/TU_PROJECT_ID/authentication/providers`
3. Habilita los proveedores de autenticación que necesites (Email/Password, Anonymous, etc.)

### Error de Permisos
```
Error: Missing or insufficient permissions
```
**Solución**: Revisa las reglas de Firestore en Firebase Console.

### Usuario Ya Existe
```
auth/email-already-in-use
```
**Solución**: Normal si ejecutas el seeding múltiples veces. Usa `seed:clear` primero.

## 📝 Logs

El sistema proporciona logs detallados:
- ✅ Operaciones exitosas
- ❌ Errores
- ⚠️ Advertencias
- 📊 Estadísticas
- 🧹 Operaciones de limpieza

¡El sistema de seeding está listo para usar! 🎉