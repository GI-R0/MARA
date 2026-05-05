# Frontend - SportifyClub

## Descripción

Interfaz de usuario desarrollada con React y Vite para la plataforma de reservas de pistas deportivas.

## Tecnologías

- React 18
- Vite
- Tailwind CSS
- Axios para API calls
- React Router para navegación
- Context API + useReducer para estado
- Hooks personalizados avanzados

## Instalación

```bash
cd frontend/sportifyclub-frontend
npm install
```

## Configuración

Crear archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:4000/api
```

## Uso

### Desarrollo

```bash
npm run dev  # Inicia servidor de desarrollo en http://localhost:5173
```

### Build

```bash
npm run build  # Genera build de producción
```

### Preview

```bash
npm run preview  # Vista previa del build
```

## Estructura del Código

```
src/
├── api/              # Configuración de Axios
├── components/       # Componentes reutilizables
├── context/          # Context API (Auth, Reserva)
├── hooks/            # Hooks personalizados avanzados
├── pages/            # Páginas de la aplicación
├── reducers/         # Reducers para estado complejo
├── styles/           # CSS modular con variables
├── assets/           # Recursos estáticos
├── App.jsx           # Componente raíz con rutas
└── main.jsx          # Punto de entrada
```

## Funcionalidades Clave

### Hooks Avanzados

- `useAuth`: Gestión de autenticación
- `useFetch`: Fetching de datos con loading/error
- `useFormValidation`: Validación de formularios
- `useDebounce`: Optimización de búsquedas
- `useModal`: Gestión de modales
- `useReservaValidation`: Validación específica de reservas

### Componentización

- Componentes modulares y reutilizables
- Separación clara de responsabilidades
- Props drilling minimizado con Context

### Estilos

- Variables CSS globales para colores, spacings, etc.
- CSS modular por componente
- Diseño responsive
- Tema deportivo con colores Barça

## Rutas Principales

- `/`: Home
- `/pistas`: Catálogo de pistas
- `/pistas/:id`: Detalle de pista
- `/login`: Login
- `/register`: Registro
- `/perfil`: Perfil de usuario
- `/mis-reservas`: Reservas del usuario
- `/admin`: Panel de administración
- `/club`: Panel de club

## UX/UI

- Diseño intuitivo y responsive
- Navegación clara con Navbar y Footer
- Formularios validados con feedback visual
- Estados de loading y error
- Iconos de Lucide React
  vite.config.js - configuración de Vite

```

### Flujo de datos principal

1. **Autenticación** (`AuthContext`):
   - El formulario de login envía credenciales al backend.
   - El token JWT se almacena en `localStorage`.
   - `useAuth` lo recupera y lo añade a cada request (Axios interceptor).

2. **Listado de Pistas**:
   - `Pistas.jsx` obtiene el catálogo con filtros de búsqueda y deporte.
   - Cada pista se renderiza con el componente `CardPista`.

3. **Reservas** (`ReservaContext`):
   - El usuario selecciona una pista y rellenada un formulario.
   - `ReservaForm` valida los datos y envía al backend.
   - `useReservaValidation` asegura coherencia (sin solapamientos, horas válidas, etc.).

4. **Vistas según rol**:
   - Los usuarios normales ven su perfil y mis reservas.
   - Los clubs ven `GestionPistas` para administrar sus pistas.
   - Los admins ven `AdminPanel` para gestión global.

### Hooks personalizados

- `useAuth` – gestiona login/logout y obtiene el usuario actual. Aísla la lógica de token y perfiles.
- `useFormValidation` – valida campos de formulario en tiempo real, mostrando errores.
- `useFetch` – abstractión para llamadas GET a la API con estados de carga y error.
- `useReservaValidation` – reglas de validación para reservas: disponibilidad, horas, solapamientos.
- `useAsync` – manejo de promesas con loading/error para evitar código repetido.
- `useDebounce` – debounce de búsquedas para reducir peticiones.
- `useModal` – control de modales genéricos.

Cada hook está documentado con ejemplos de uso dentro de su archivo correspondiente.

### Autenticación y protección

- `ProtectedRoute.jsx` redirige a login si el usuario no está autenticado.
- Roles como `admin` o `club` se verifican en `useAuth`.
- Tokens JWT se validan en el backend antes de realizar operaciones.

### Estilos

- Variables CSS en `styles/styles.css` (colores Barça: azul, rojo, oro).
- Cada página/componente tiene su `archivo.css` asociado.
- Responsive design con media queries (@media 640px, 768px, 1024px).
- Uso de gradientes, sombras y animaciones para mejorar UX.

## Público objetivo

El frontend está orientado a tres perfiles principales:

- **Clientes** que desean búsquedas rápidas y visuales de pistas para reservar.
- **Administradores de clubes** que requieren paneles de control sencillos para añadir, editar o borrar pistas y revisar reservas.
- **Administradores de la plataforma** que necesitan vistas consolidadas de usuarios, pistas y estadísticas.

La interfaz es responsiva y minimalista, con atención a la accesibilidad básica.

## Ejecución local

## Decisiones técnicas (ampliadas)

- **React + Vite** para tiempos de desarrollo y carga muy cortos.
- **Context API** en lugar de Redux: suficiente para el alcance actual y reduce el boilerplate.
- **Custom hooks** encapsulan lógica de validación, peticiones asíncronas y manejo de formularios.
- **Arquitectura basada en componentes**: cada página (`pages/`) monta componentes de UI (`components/`) que son reutilizables y aislados.
- **Flujo de datos** unidireccional; los `Context` proporcionan funciones para actualizar el estado global.
- **CSS modularizado** en ficheros por componente/página con variables globales para facilitar cambios de tema.
- **UX con retroalimentación**: formularios muestran indicadores de carga, mensajes de error/éxito y confirmaciones; los botones se deshabilitan mientras se procesan acciones.
- **Despliegue**: la app está preparada para build (`npm run build`) y el backend se puede desplegar en cualquier servicio Node (Heroku, Vercel, Azure) ya que sólo requiere un `PORT` y `MONGODB_URI`.

Estas decisiones permiten un balance entre claridad de código y capacidad de escalar si se añaden nuevas funcionalidades.

1. Configura `frontend/sportifyclub-frontend/.env`:
```

VITE_API_URL=http://localhost:4000/api

````
2. `npm install` (dentro de la carpeta del frontend)
3. `npm run dev` para desarrollo
4. Abre `http://localhost:5173`

## Compilación para producción

```bash
npm run build
````

Genera archivos optimizados en `dist/`.

## Decisiones técnicas

- **Vite** sobre create-react-app para builds más rápidos.
- **Context API** en lugar de Redux para simplicidad.
- **CSS vanilla** + variables para evitar dependencias como styled-components.
- **Axios** para requests HTTP con interceptores automáticos.
- **Hooks personalizados** para reutilización de lógica.
- **Responsive** desde mobile-first hasta desktop.
