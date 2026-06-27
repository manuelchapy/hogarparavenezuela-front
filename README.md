# Hogar para Venezuela — Frontend NNA

Plataforma PWA de rescate y trazabilidad de Niños, Niñas y Adolescentes (NNA). Diseñada para operar en campo con conectividad limitada.

## Stack

- React 19 + Vite 6 + TypeScript
- Tailwind CSS 4
- Zustand (estado global)
- Dexie.js (IndexedDB / offline-first)
- Axios + axios-retry
- React Hook Form + Zod
- React Router + vite-plugin-pwa

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

## Estructura

```
src/
├── api/          # Cliente Axios e interceptores
├── components/   # UI compartida (Button, Input, Layout)
├── constants/    # Roles, rutas, endpoints
├── hooks/        # useAuth, useOnlineStatus, useSync
├── modules/      # Vistas por dominio (auth, nna, dashboard)
├── router/       # Rutas con lazy loading
├── services/     # IndexedDB, sincronización, compresión de imágenes
└── store/        # Zustand stores
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL base del backend (ej. `http://localhost:3000/api`) |
| `VITE_API_PROXY_TARGET` | Target del proxy en desarrollo |

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Compilación TypeScript + Vite |
| `npm run preview` | Vista previa del build |
| `npm run lint` | ESLint |
