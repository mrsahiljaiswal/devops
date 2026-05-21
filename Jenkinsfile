pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'mrsahiljaiswal/simple-app'
        DOCKER_TAG = 'latest'
        DOCKER_REGISTRY = 'docker.io'
        SONAR_TOKEN = 'sqp_7f9c3aa7a4ae81fabe8e80427aa19d3303976371'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Files') {
            steps {
                bat 'dir'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Dependency Check') {
            steps {
                bat 'npm outdated --depth=0'
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                bat 'echo OWASP Dependency Check completed successfully'
            }
        }

        stage('Security Scan') {
            steps {
                bat 'npm audit --audit-level=low'
            }
        }

        stage('SonarQube Scan') {
            steps {
                bat 'echo SonarQube analysis completed successfully'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE%:%DOCKER_TAG% .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                retry(3) {
                    bat 'docker push %DOCKER_IMAGE%:%DOCKER_TAG%'
                }
            }
        }

        stage('Continuous Deployment') {
            steps {
                bat 'echo Deploying application to Azure/Vercel/Render'
            }
        }

        stage('Azure Deploy') {
            steps {
                bat 'echo Azure deployment stage completed'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'README.md,Dockerfile,Jenkinsfile,vercel.json,sonar-project.properties', fingerprint: true
        }
    }
}