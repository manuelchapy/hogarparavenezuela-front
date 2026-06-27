## ADDED Requirements

### Requirement: Production container image
The system SHALL define a multi-stage production Docker container for the frontend that builds the Vite application and serves it with nginx.

#### Scenario: Build container image
- **WHEN** a container image is built from the repository root
- **THEN** the image contains the built SPA assets served by nginx on port 8080

#### Scenario: Listen on Cloud Run port
- **WHEN** the container runs
- **THEN** nginx listens on port 8080 as expected by Cloud Run

#### Scenario: SPA client-side routing
- **WHEN** a request is made for a client-side route (e.g., `/dashboard`)
- **THEN** nginx serves `index.html` instead of returning 404

### Requirement: Cloud Run service template
The system SHALL provide a Cloud Run service YAML template for service `hogarparavenezuela-front` in project region `us-central1`.

#### Scenario: Render deployable service YAML
- **WHEN** the deployment workflow provides a concrete container image
- **THEN** the service YAML can be rendered with that image and applied to Cloud Run

#### Scenario: Avoid committing production secrets
- **WHEN** reviewing the Cloud Run service YAML
- **THEN** no production secret values or long-lived service account credentials are present in the repository

### Requirement: GitHub Actions deployment
The system SHALL provide a GitHub Actions workflow that builds the frontend image, pushes it to Artifact Registry, and deploys it to Cloud Run using OIDC authentication.

#### Scenario: Deploy from main
- **WHEN** code is pushed to `main`
- **THEN** GitHub Actions builds an image tagged with the commit SHA and deploys it to Cloud Run

#### Scenario: Manual deployment
- **WHEN** a maintainer runs the workflow manually
- **THEN** GitHub Actions performs the same build, push, and deploy process

#### Scenario: Authenticate without JSON key
- **WHEN** the workflow authenticates to Google Cloud
- **THEN** it uses Workload Identity Federation / OIDC rather than a long-lived service account JSON key

#### Scenario: Build-time API configuration
- **WHEN** the workflow builds the Docker image
- **THEN** `VITE_API_BASE_URL` is passed as a build argument and embedded in the Vite bundle

### Requirement: Deployment documentation
The system SHALL document the Google Cloud setup, GitHub configuration, deployment flow, and verification steps needed to operate the Cloud Run deployment.

#### Scenario: Prepare cloud resources
- **WHEN** a maintainer follows the deployment documentation
- **THEN** they can create or verify the required APIs, Artifact Registry repository, deployer service account, and Workload Identity Federation binding

#### Scenario: Configure GitHub repository
- **WHEN** a maintainer follows the deployment documentation
- **THEN** they know which GitHub variables and secrets are required by the workflow
