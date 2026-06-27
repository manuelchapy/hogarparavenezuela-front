## 1. Container Setup

- [x] 1.1 Add a multi-stage production `Dockerfile` (Vite build + nginx serve) that builds the SPA and serves static assets on port 8080.
- [x] 1.2 Add a `.dockerignore` that excludes local dependencies, credentials, generated files, and development-only files from the image context.

## 2. Cloud Run Service

- [x] 2.1 Add `cloudrun/service.yaml` for service `hogarparavenezuela-front` in region `us-central1` with a replaceable image placeholder.
- [x] 2.2 Ensure the service YAML contains only non-secret defaults and does not commit production secret values.

## 3. GitHub Actions Deployment

- [x] 3.1 Add `.github/workflows/deploy-cloud-run.yml` triggered by pushes to `main` and manual dispatch.
- [x] 3.2 Configure workflow permissions and OIDC authentication for Google Cloud Workload Identity Federation.
- [x] 3.3 Configure workflow steps to build the Docker image (with `VITE_API_BASE_URL` build arg), push it to Artifact Registry, render the Cloud Run service YAML, and deploy it.

## 4. Deployment Documentation

- [x] 4.1 Add `docs/deployment/cloud-run.md` with Google Cloud API, Artifact Registry, service account, and Workload Identity Federation setup commands.
- [x] 4.2 Document required GitHub repository variables/secrets and build-time configuration guidance.
- [x] 4.3 Document deployment verification and rollback notes.

## 5. Verification

- [ ] 5.1 Run the project build (`npm run build`).
- [ ] 5.2 Build the Docker image locally.
- [ ] 5.3 Verify the OpenSpec change status and task completion.
