## Context

The frontend is a Vite + React 19 SPA that produces static assets. It must be deployed to Google Cloud Run alongside the existing `hogarparavenezuela-back` service.

## Decisions

### Multi-stage Docker build: Vite → nginx

The Dockerfile uses a `node:22-slim` build stage to run `npm run build` (TypeScript + Vite), then a `nginx:1.27-alpine` runtime stage to serve the compiled `dist/` directory. This keeps the final image small (~10 MB for nginx alpine).

### Nginx SPA routing

All requests for non-file paths are routed to `index.html` via `try_files` to support React Router client-side routing. Static assets under `/assets` get a 1-year cache with `immutable` directive since Vite produces content-hashed filenames.

### Build-time API URL

`VITE_API_BASE_URL` is passed as a Docker `--build-arg` and embedded in the Vite build. It cannot be changed at runtime — a new image must be built and deployed to change the API target.

### No runtime environment variables

Unlike the backend, the frontend SPA has no server-side runtime. All configuration is baked at build time.

### Sibling service in same GCP project

Both `hogarparavenezuela-front` and `hogarparavenezuela-back` share the same GCP project, Artifact Registry, and deployer service account. Each has its own Cloud Run service and GitHub Actions workflow.

## Alternatives Considered

- **Firebase Hosting / Cloud Storage static site:** Rejected because Cloud Run gives a unified deployment model with the backend and supports custom routing/headers.
- **Serve with Node.js (`serve` package):** Rejected in favor of nginx, which is more performant, smaller, and industry-standard for static SPAs.
