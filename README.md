# Simple Frontend & Backend Project

A simple web application with a static frontend served from `public/` and an Express.js backend that can run on Render, Docker, or Azure.

## Project Structure

```
├── api/                # Vercel serverless API endpoints
│   ├── message.js
│   └── submit.js
├── public/             # Frontend static assets
│   ├── index.html
│   ├── script.js
│   └── style.css
├── server.js           # Express backend server used by Docker/Azure deployments
├── Dockerfile          # Docker container build
├── Jenkinsfile         # Jenkins CI/CD pipeline configuration
├── vercel.json         # Vercel route configuration
├── azure-deploy.sh     # Azure CLI deployment helper
├── sonar-project.properties # SonarQube/SonarCloud configuration
├── package.json        # Node dependencies and scripts
├── .dockerignore       # Docker ignore rules
└── README.md           # Project documentation
```

## Local Development

### Prerequisites
- Node.js installed
- npm installed
- Docker installed (for container build)

### Install & Run Locally

```bash
npm install
npm start
```

Open your browser at:

```bash
http://localhost:3000
```

For production, the frontend should point to the Render backend via the centralized config file or `API_URL` environment variable.

## Docker Setup

### Build image

```bash
docker build -t simple-app .
```

### Run container

```bash
docker run --rm -p 3000:3000 simple-app
```

### Docker Compose

```bash
docker-compose up
```

## CI/CD Pipelines

This repository includes both Azure DevOps and Jenkins CI/CD definitions.

### Azure DevOps

- Pipeline file: `azure-pipelines.yml`
- Runs on pushes to `main`
- Stages:
  - Build & Test
  - SonarCloud Analysis
  - Docker Build
- Key checks:
  - `npm install`
  - `npm outdated --depth=0`
  - `npm audit --audit-level=low`
  - `sonar-scanner`

### Jenkins

- Pipeline file: `Jenkinsfile`
- Stages include:
  - Checkout
  - Verify files
  - Install dependencies
  - Dependency check
  - OWASP dependency check
  - Security scan
  - SonarQube scan
  - Docker build
  - Docker login and push

You can use Jenkins credentials for Docker Hub and Azure service principal authentication.

See `CICD_PIPELINE.md` for a full CI/CD flow summary.

## Azure Integration

A helper script `azure-deploy.sh` is included. It can deploy the built Docker image to Azure App Service by using:

- `AZURE_RESOURCE_GROUP`
- `AZURE_WEBAPP_NAME`
- `DOCKER_REGISTRY`

Example:

```bash
AZURE_RESOURCE_GROUP=MyGroup AZURE_WEBAPP_NAME=MyWebApp DOCKER_REGISTRY=mydockerhubuser ./azure-deploy.sh
```

## Vercel Hosting

This project is configured as a static frontend deployment on Vercel that calls a dedicated backend on Render.

The frontend uses a centralized config generator (`scripts/generateConfig.js`) and `public/config.js` to resolve the Render backend URL at build-time.

### Deploy to Vercel

- Set environment variable `API_URL=https://devops-rkyj.onrender.com`
- Set environment variable `FRONTEND_URL=https://<your-vercel-domain>` for backend CORS if desired
- Vercel will run the `build` script if present, which generates `public/config.js`
- Static frontend is served from `public/`

## Dependency and Vulnerability Checks

### Dependency check

```bash
npm run check-deps
```

### Vulnerability scan

```bash
npm run check-vuln
```

## Security & Code Quality

A sample `sonar-project.properties` file is included for SonarQube or SonarCloud integration.

## Notes for Lab Demonstration

- Explain Docker: build image, run container, push to registry
- Explain Jenkins: automated stages, build image, audit, deploy
- Explain Azure: container deployment using Azure App Service or ACR
- Explain Vercel: static frontend + serverless functions

## Current Status

- Dependency check: `npm outdated --depth=0`
- Vulnerability scan: `npm audit --audit-level=low` (0 vulnerabilities found)
- Dockerfile is configured and ready
- Jenkinsfile is configured for CI/CD
- Azure deployment helper is included
- Vercel hosting configuration is included
# devops
