# Mapa de Flujo de la Aplicación de Servicios ManitasRd1

## Descripción General
Este diagrama representa el flujo de usuario para una aplicación de servicios técnicos que conecta a clientes con técnicos profesionales.

## Flujos Principales

### 1. Flujo de Registro y Autenticación

```mermaid
graph TD
    A[Página de Inicio] --> B{¿Usuario Registrado?}
    B -->|No| C[Registro]
    B -->|Sí| D[Login]
    C --> C1[Registro como Cliente]
    C --> C2[Registro como Técnico]
    C1 --> C3[Completar Perfil Cliente]
    C2 --> C4[Completar Perfil Técnico]
    C3 --> D
    C4 --> D
    D --> E[Verificación]
    E -->|Éxito| F[Dashboard]
    E -->|Fallo| G[Recuperar Contraseña]
    G --> D
```

### 2. Flujo de Cliente

```mermaid
graph TD
    A[Dashboard Cliente] --> B[Buscar Servicios]
    A --> C[Ver Técnicos]
    A --> D[Solicitudes Anteriores]
    A --> E[Mensajes]
    A --> F[Perfil]
    
    B --> B1[Filtrar por Categoría]
    B --> B2[Filtrar por Ubicación]
    B --> B3[Filtrar por Calificación]
    B1 --> B4[Ver Detalles del Servicio]
    B2 --> B4
    B3 --> B4
    B4 --> B5[Solicitar Servicio]
    
    C --> C1[Ver Perfil de Técnico]
    C1 --> C2[Ver Reseñas]
    C1 --> C3[Ver Servicios Ofrecidos]
    C1 --> C4[Contactar Técnico]
    C4 --> E
    
    B5 --> G[Formulario de Solicitud]
    G --> H[Confirmar Solicitud]
    H --> I[Pago]
    I --> J[Esperar Confirmación]
    J --> E
    
    D --> D1[Ver Estado de Solicitudes]
    D --> D2[Cancelar Solicitud]
    D --> D3[Dejar Reseña]
```

### 3. Flujo de Técnico

```mermaid
graph TD
    A[Dashboard Técnico] --> B[Solicitudes Disponibles]
    A --> C[Mis Servicios]
    A --> D[Mensajes]
    A --> E[Perfil]
    A --> F[Historial]
    
    B --> B1[Ver Detalles de Solicitud]
    B1 --> B2{¿Aceptar Solicitud?}
    B2 -->|Sí| B3[Enviar Cotización]
    B2 -->|No| B4[Rechazar]
    B3 --> D
    
    C --> C1[Agregar Servicio]
    C --> C2[Editar Servicio]
    C --> C3[Eliminar Servicio]
    
    F --> F1[Ver Historial de Servicios]
    F --> F2[Ver Reseñas Recibidas]
    F --> F3[Ver Estadísticas]
```

### 4. Flujo de Comunicación

```mermaid
graph TD
    A[Mensajes] --> B[Conversaciones]
    B --> C[Chat con Cliente/Técnico]
    C --> D[Enviar Mensaje]
    C --> E[Enviar Imagen]
    C --> F[Enviar Ubicación]
    C --> G[Acordar Cita]
    G --> H[Confirmar Cita]
    H --> I[Notificación]
```

### 5. Flujo de Servicio

```mermaid
graph TD
    A[Solicitud Aceptada] --> B[Programar Visita]
    B --> C[Realizar Servicio]
    C --> D[Marcar como Completado]
    D --> E[Solicitar Pago]
    E --> F[Cliente Confirma]
    F --> G[Dejar Reseña]
    G --> H[Servicio Finalizado]
```

## Puntos de Entrada

- Registro directo
- Login
- Búsqueda de servicios
- Notificaciones
- Enlaces de referencia

## Puntos de Decisión Clave

1. Tipo de usuario (Cliente/Técnico)
2. Aceptación/Rechazo de solicitudes
3. Confirmación de pagos
4. Finalización de servicios

## Consideraciones de Diseño

- Minimizar pasos para completar tareas principales
- Proporcionar retroalimentación clara en cada etapa
- Diseñar para dispositivos móviles primero
- Implementar notificaciones para mantener a los usuarios informados
- Asegurar que los flujos de pago sean seguros y transparentes
- Facilitar la comunicación entre clientes y técnicos
- Incorporar sistema de reseñas para construir confianza