#!/usr/bin/env bash
set -e

if [ -z "$AZURE_RESOURCE_GROUP" ] || [ -z "$AZURE_WEBAPP_NAME" ] || [ -z "$DOCKER_REGISTRY" ]; then
  echo "ERROR: Set AZURE_RESOURCE_GROUP, AZURE_WEBAPP_NAME, and DOCKER_REGISTRY environment variables."
  echo "Example: AZURE_RESOURCE_GROUP=MyGroup AZURE_WEBAPP_NAME=MyApp DOCKER_REGISTRY=myhubuser ./azure-deploy.sh"
  exit 1
fi

if ! command -v az >/dev/null 2>&1; then
  echo "ERROR: Azure CLI not found. Install az before running this script."
  exit 1
fi

IMAGE_NAME="$DOCKER_REGISTRY/simple-app:latest"

echo "Building Docker image: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" .

echo "Pushing Docker image to registry"
docker push "$IMAGE_NAME"

echo "Creating resource group if needed: $AZURE_RESOURCE_GROUP"
az group create --name "$AZURE_RESOURCE_GROUP" --location eastus

echo "Creating App Service plan and webapp"
az appservice plan create --name "${AZURE_WEBAPP_NAME}-plan" --resource-group "$AZURE_RESOURCE_GROUP" --is-linux --sku B1 || true
az webapp create --resource-group "$AZURE_RESOURCE_GROUP" --plan "${AZURE_WEBAPP_NAME}-plan" --name "$AZURE_WEBAPP_NAME" --deployment-container-image-name "$IMAGE_NAME" || true

echo "Configuring container image for Azure Web App"
az webapp config container set --name "$AZURE_WEBAPP_NAME" --resource-group "$AZURE_RESOURCE_GROUP" --docker-custom-image-name "$IMAGE_NAME"

echo "Deployment complete. App should be available at https://$AZURE_WEBAPP_NAME.azurewebsites.net"
