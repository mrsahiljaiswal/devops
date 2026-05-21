pipeline {
  agent any

  environment {
    DOCKER_IMAGE = 'mrsahiljaiswal/simple-app'
    DOCKER_TAG = "${env.BUILD_NUMBER ?: 'local'}"
    DOCKER_REGISTRY = 'docker.io'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        bat 'npm install'
      }
    }

    stage('Dependency Check') {
      steps {
        bat 'npm outdated --depth=0 || true'
      }
    }

    stage('Security Scan') {
      steps {
        bat 'npm audit --audit-level=low'
      }
    }

    stage('Docker Build') {
      steps {
        bat 'docker build -t %DOCKER_IMAGE%:%DOCKER_TAG% .'
      }
    }

    stage('Docker Push') {
      when {
        expression { env.DOCKERHUB_CREDENTIALS != null }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          bat 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin ${DOCKER_REGISTRY}'
          bat 'docker push %DOCKER_IMAGE%:%DOCKER_TAG%'
        }
      }
    }

    stage('Azure Deploy') {
      when {
        allOf {
          expression { env.AZURE_RESOURCE_GROUP != null }
          expression { env.AZURE_WEBAPP_NAME != null }
          expression { env.AZURE_SERVICE_PRINCIPAL_ID != null }
          expression { env.AZURE_SERVICE_PRINCIPAL_PASSWORD != null }
          expression { env.AZURE_TENANT_ID != null }
        }
      }
      steps {
        bat '''
          az login --service-principal -u "$AZURE_SERVICE_PRINCIPAL_ID" -p "$AZURE_SERVICE_PRINCIPAL_PASSWORD" --tenant "$AZURE_TENANT_ID"
          az webapp config container set --name "$AZURE_WEBAPP_NAME" --resource-group "$AZURE_RESOURCE_GROUP" --docker-custom-image-name "${DOCKER_IMAGE}:${DOCKER_TAG}"
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'README.md, Dockerfile, Jenkinsfile, vercel.json, sonar-project.properties', fingerprint: true
    }
  }
}
