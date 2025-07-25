# Componente Drawer

## Descripción

El componente `Drawer` es un panel deslizante que aparece desde los bordes de la pantalla. Es útil para mostrar contenido adicional, formularios o información contextual sin tener que navegar a otra página.

## Características

- **Posicionamiento flexible**: puede aparecer desde cualquier borde de la pantalla (izquierda, derecha, arriba, abajo).
- **Tamaños configurables**: varios tamaños predefinidos (sm, md, lg, xl, full).
- **Opciones de cierre**: puede cerrarse al hacer clic fuera, presionar ESC o mediante un botón de cierre.
- **Prevención de desplazamiento**: opción para bloquear el desplazamiento del contenido detrás del drawer.
- **Encabezado y pie de página**: soporte para título y contenido de pie de página.
- **Contexto de React**: incluye un proveedor de contexto para facilitar el uso en componentes anidados.

## Componentes

### Drawer

El componente principal que muestra el panel deslizante.

```tsx
<Drawer
  isOpen={boolean}
  onClose={() => {}}
  position="right"
  size="md"
  closeOnClickOutside={true}
  closeOnEsc={true}
  showCloseButton={true}
  title="Título del Drawer"
  footer={<div>Contenido del pie de página</div>}
  preventScroll={true}
>
  Contenido del drawer
</Drawer>
```

### DrawerProvider

Proveedor de contexto para gestionar el estado del drawer.

```tsx
<DrawerProvider>
  {/* Componentes hijos */}
</DrawerProvider>
```

### DrawerTrigger

Componente para abrir el drawer.

```tsx
<DrawerTrigger asChild>
  <Button>Abrir Drawer</Button>
</DrawerTrigger>
```

### DrawerContent

Componente para definir el contenido del drawer cuando se usa con DrawerProvider.

```tsx
<DrawerContent title="Título del Drawer">
  Contenido del drawer
</DrawerContent>
```

### useDrawer

Hook para acceder al contexto del drawer.

```tsx
const { open, close, isOpen } = useDrawer();
```

## Implementaciones Especializadas

Hemos creado varias implementaciones especializadas del componente Drawer para diferentes casos de uso:

1. **FilterDrawer**: Para filtrar resultados de búsqueda.
2. **NotificationsDrawer**: Para mostrar notificaciones del usuario.
3. **HelpDrawer**: Para mostrar ayuda contextual.
4. **ServiceCartDrawer**: Para gestionar servicios seleccionados.
5. **ChatDrawer**: Para mensajería entre usuarios y técnicos.
6. **UserProfileDrawer**: Para gestionar el perfil y configuraciones del usuario.
7. **TechnicianDashboardDrawer**: Para mostrar estadísticas y métricas para técnicos.

## Ejemplos

Puedes ver ejemplos de uso de todos estos componentes en la sección de ejemplos de la aplicación:

```
/examples
```

## Consideraciones de Accesibilidad

- El drawer captura el foco cuando se abre.
- Se puede cerrar con la tecla ESC.
- Incluye roles ARIA apropiados.
- Mantiene el foco dentro del drawer cuando está abierto.