# Componentes de ManitasRD

## Componentes de UI

La aplicación ManitasRD utiliza una serie de componentes de UI reutilizables que se encuentran en la carpeta `src/components/ui`. Estos componentes son la base para construir interfaces de usuario consistentes y accesibles.

### Drawer

El componente `Drawer` es un panel deslizante que aparece desde los bordes de la pantalla. Es útil para mostrar contenido adicional, formularios o información contextual sin tener que navegar a otra página.

[Ver documentación detallada del Drawer](./ui/Drawer/README.md)

## Componentes Especializados de Drawer

Hemos creado varias implementaciones especializadas del componente Drawer para diferentes casos de uso:

### FilterDrawer

Componente para filtrar resultados de búsqueda. Incluye:
- Versión móvil (drawer) y versión de escritorio (sidebar)
- Grupos de filtros con opciones de checkbox
- Funcionalidad para aplicar/limpiar filtros

### NotificationsDrawer

Componente para mostrar notificaciones del usuario. Incluye:
- Lista de notificaciones con diferentes tipos (info, success, warning, error)
- Funcionalidad para marcar como leída, eliminar y limpiar todas
- Indicador de notificaciones no leídas

### HelpDrawer

Componente para mostrar ayuda contextual. Incluye:
- Proveedor de contexto para gestionar el contenido de ayuda
- Hook `useHelp` para acceder al contexto
- Botón para abrir el drawer de ayuda para secciones específicas

### ServiceCartDrawer

Componente para gestionar servicios seleccionados. Incluye:
- Proveedor de contexto para gestionar el estado del carrito
- Hook `useCart` para acceder al contexto
- Componente `CartItemCard` para mostrar servicios individuales
- Botón para abrir el drawer del carrito
- Botón para agregar servicios al carrito

### ChatDrawer

Componente para mensajería entre usuarios y técnicos. Incluye:
- Lista de conversaciones
- Vista de conversación activa con entrada de mensaje
- Manejo de adjuntos
- Botón para abrir el drawer de chat

### UserProfileDrawer

Componente para gestionar el perfil y configuraciones del usuario. Incluye:
- Pestañas para perfil y configuraciones
- Campos de perfil editables
- Configuraciones de notificaciones y privacidad
- Opciones de apariencia
- Acciones de seguridad

### TechnicianDashboardDrawer

Componente para mostrar estadísticas y métricas para técnicos. Incluye:
- Estadísticas de servicios, ganancias, calificación y clientes
- Servicios próximos
- Reseñas recientes
- Pestañas para "Resumen", "Ganancias" y "Agenda"

## Ejemplos

Puedes ver ejemplos de uso de todos estos componentes en la sección de ejemplos de la aplicación:

```
/examples
```

## Componentes de Layout

Los componentes de layout se utilizan para estructurar la aplicación y proporcionar una experiencia de usuario consistente.

### Header

Barra de navegación superior con logo, enlaces de navegación y botones de autenticación.

### Footer

Pie de página con información de contacto, enlaces a redes sociales y enlaces a páginas importantes.

### SideNav

Barra lateral de navegación para el panel de usuario, con diferentes opciones según el tipo de usuario (cliente o técnico).

### Layout

Componente que combina Header y Footer para crear un layout consistente en toda la aplicación.