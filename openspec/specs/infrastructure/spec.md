# Infrastructure Specification

## Purpose

This specification defines runtime services, build configuration, deployment expectations, and the CI/CD pipeline for the frontend application.

## Requirements

### Requirement: Static SPA deployment

The system SHALL be deployed as a containerized static single-page application served by nginx.

#### Scenario: Container serves the built app
- WHEN a container is built from the repository root
- THEN the image SHALL contain the Vite-built static assets served by nginx on port 8080

#### Scenario: SPA routing
- WHEN a client requests any path that does not match a static file
- THEN nginx SHALL serve `index.html` to support client-side routing

### Requirement: Build-time API configuration

The system SHALL embed the API backend URL at build time via `VITE_API_BASE_URL`.

#### Scenario: Build configures API target
- WHEN the Docker image is built with a `VITE_API_BASE_URL` build argument
- THEN the built JavaScript bundle SHALL use that value as the API base URL

### Requirement: PWA support

The system SHALL include PWA manifest and service worker support for offline-capable delivery.

#### Scenario: PWA assets are included
- WHEN the container is built
- THEN the `dist` directory SHALL include `manifest.webmanifest`, service worker, and PWA icon files

### Requirement: Cloud Run service template

The system SHALL provide a Cloud Run service YAML template for service `hogarparavenezuela-front` in project region `us-central1`.

#### Scenario: Render deployable service YAML
- WHEN the deployment workflow provides a concrete container image
- THEN the service YAML can be rendered with that image and applied to Cloud Run

### Requirement: GitHub Actions deployment

The system SHALL provide a GitHub Actions workflow that builds the frontend image, pushes it to Artifact Registry, and deploys it to Cloud Run using OIDC authentication.

#### Scenario: Deploy from main
- WHEN code is pushed to `main`
- THEN GitHub Actions builds an image tagged with the commit SHA and deploys it to Cloud Run

#### Scenario: Authenticate without JSON key
- WHEN the workflow authenticates to Google Cloud
- THEN it uses Workload Identity Federation / OIDC rather than a long-lived service account JSON key
