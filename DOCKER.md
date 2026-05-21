# Docker Build & Push Commands

## Prerequisites
- Docker installed
- Docker Hub account (or your preferred container registry)
- Logged in to Docker: `docker login`

## Build the Docker Image

```bash
docker build -t your-docker-username/simple-app:latest .
```

## Tag for versioned release

```bash
docker tag your-docker-username/simple-app:latest your-docker-username/simple-app:v1.0.0
```

## Push to Docker Hub

```bash
docker push your-docker-username/simple-app:latest
```

## Run the Container Locally

```bash
docker run --rm -p 3000:3000 your-docker-username/simple-app:latest
```

## Using Docker Compose

```bash
docker-compose up
```

## Azure Deployment Flow

- Build the Docker image locally
- Push the image to your registry
- Deploy to Azure App Service or Azure Container Apps

## Notes

- Replace `your-docker-username` with your actual Docker registry username.
- Use `AZURE_RESOURCE_GROUP`, `AZURE_WEBAPP_NAME`, and `DOCKER_REGISTRY` with `azure-deploy.sh`.
