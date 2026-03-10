# Frontend de SportifyClub

Aplicación de una sola página (SPA) construida con React y Vite. Su objetivo es proporcionar una interfaz fluida para buscar pistas y gestionar reservas.

## Estructura principal

```
frontend/sportifyclub-frontend/
  public/                 - activos estáticos (imagenes, favicon)
  src/
    api/                  - configuración de Axios con interceptores
    assets/               - imágenes y logos usadas en componentes
    components/           - componentes reutilizables (Navbar, Footer, Cards)
    context/              - providers React (AuthContext, ReservaContext)
    hooks/                - custom hooks para lógica compartida
    pages/                - vistas principales (Home, Pistas, Login...)
    reducers/             - reducers para useReducer
    styles/               - archivos CSS por página/componente
    App.jsx               - router y estructura básica
    main.jsx              - punto de entrada
  package.json            - dependencias y scripts
```

## Flujo de información

1. El usuario interactúa con la UI (forms, botones, etc.).
2. Los componentes consumen contextos (`useAuth`, `useReserva`) y hooks propios (`useFetch`, `useFormValidation`).
3. Las peticiones de datos se realizan con `axios` configurado en `api/axiosConfig.js`, que añade el token JWT a las cabeceras y maneja errores 401.
4. Los datos devueltos se usan para renderizar vistas o actualizar el estado.

## Hooks personalizados usados

- `useAuth` – login/logout y persistencia de token
- `useFetch` – abstrae peticiones GET con manejo de loading/errores
- `useFormValidation`, `useReservaValidation` – lógica de validación de formularios
- `useModal`, `useAsync`, `useDebounce` – utilidades varias para UI

## Estilos y UI

- CSS modularizado por vista; se usan variables CSS globales definidas en `styles/styles.css`.
- Se adoptan colores basados en la paleta del Barça para una estética deportiva.
- Clases utilitarias para botones común (`.btn`, `.btn-primary`, etc.).

## Público objetivo

Usuarios que desean visualizar y reservar pistas deportivas; clubes que desean administrar sus instalaciones; administradores del sistema.

## Decisiones técnicas relevantes

- **Vite** elegido por su velocidad de arranque y HMR.
- **React Router v6** para navegación sin recargas.
- Gestión de estado ligera con `useContext` + `useReducer` (no Redux).
- Validaciones de formularios manuales y con helpers para mantener UX.

## Ejecución local

```bash
cd frontend/sportifyclub-frontend
npm install
npm run dev
```

El frontend espera que la API esté accesible en la URL configurada en `VITE_API_URL`.

## Favicon

Se ha añadido un icono personalizado (`public/favicon.svg`) para mejorar la percepción profesional.
