# Spybee Maps - Gestión de Incidencias

Aplicación web desarrollada como prueba técnica, recreando la vista de mapa de Spybee la cual fue enviada por la empresa como muestra, con funcionalidad de creación de incidencias, visualización en mapa y dashboard analítico.

## Demo en producción Vercel

[Ver aplicación desplegada](https://spybeemaps.vercel.app/)

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| React 19 + Next.js 16 | Framework con App Router y SSR |
| TypeScript | Tipado en componentes, store y tipos |
| SCSS Modules | Estilos modulares con variables y diseño responsive |
| Zustand | Gestión de estado global con persistencia en localStorage |
| Mapbox GL JS | Mapa interactivo con heatmap, estilos y marcadores |
| Clerk | Autenticación (Google + Email) con middleware de protección |
| Recharts | Gráficos de barras y torta para el dashboard |
| React Select | Selects avanzados con búsqueda y multi-selección |

---

## Cómo ejecutar el proyecto localmente

### Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Cuenta en [Clerk](https://clerk.com) (API keys)
- Cuenta en [Mapbox](https://mapbox.com) (token público)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Julian0399/spybeeMaps.git
cd spybeemaps

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus keys de Clerk y Mapbox

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Variables de entorno necesarias

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_tu_key
CLERK_SECRET_KEY=sk_test_tu_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/map
NEXT_PUBLIC_MAPBOX_TOKEN=pk.tu_token
```

---

## Funcionalidades

### Vista de Mapa (`/`)
- Mapa interactivo con Mapbox GL JS centrado en Bogotá
- Toggle 2D/3D con animación de perspectiva
- 4 estilos de mapa: Satélite, 3D Edificios, Normal y Relieve
- Barra de herramientas lateral derecha con acciones
- Barra inferior con controles de vista y toggle 360°
- Marcadores de incidencias con color según prioridad y popup informativo
- Persistencia de incidencias con Zustand + localStorage

### Creación de Incidencias
- Modo creación activado con botón `+` (cursor crosshair)
- Click en el mapa captura coordenadas automáticamente
- Geocodificación inversa con API de Mapbox para obtener dirección
- Formulario completo: título, descripción, fecha, categoría con colores, prioridad, etiquetas con árbol jerárquico, asignados y observadores con búsqueda, ubicación con mini mapa interactivo, y carga de archivos
- Mini mapa con marcador arrastrable, zoom, fullscreen y cambio de estilo
- Vista previa de imágenes adjuntas

### Dashboard (`/dashboard`)
- Filtro global por rango de fecha (Hoy, 7, 15, 30 días, Todo)
- 4 tarjetas de estadísticas: Total, Abiertas, En progreso, Cerradas
- Gráfico de barras: incidencias por tipo
- Gráfico de torta: incidencias por prioridad
- Mapa de calor geográfico con Mapbox heatmap layer
- Calendario de actividad con badges por día
- Desempeño del equipo: quién resuelve más, quién reporta más, carga de trabajo
- Tabla con búsqueda, filtros (estado, prioridad, tipo, proyecto, rango de fechas) y paginación
- Avatares de responsables y asignados
- Tags con colores personalizados

### Autenticación
- Login con Google y Email via Clerk
- Protección de rutas con proxy middleware (Next.js 16)
- Información del usuario en el header con dropdown de cierre de sesión
- Localización en español (esMX)

---

## Autor

**Julian Andres Rodriguez**
[GitHub](https://github.com/Julian0399) · [LinkedIn](https://www.linkedin.com/in/julianrod-ing/)