// ============================================================
//  LUXE Ecommerce — Jenkinsfile
//
//  ⚠️  BEFORE USING — change these 3 things:
//  1. DOCKER_HUB_USER  → your Docker Hub username
//  2. GITHUB_REPO_URL  → your GitHub repo URL
//  3. EC2_HOST         → your EC2 public IP
// ============================================================

pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "harinimuruges"
        IMAGE_NAME      = "luxe-ecommerce"
        EC2_HOST        = "ubuntu@16.176.143.37"
        CONTAINER_NAME  = "luxe-con"
    }

    stages {

        // STAGE 1 — Pull code from GitHub
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Harini0712/jenkins-demo.git'
                echo "Code pulled — commit: ${GIT_COMMIT}"
            }
        }

        // STAGE 2 — Build Docker image
        stage('Build Docker Image') {
            steps {
                sh """
                    docker build \
                        -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER} \
                        -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest \
                        .
                """
                echo "Image built: ${DOCKER_HUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }

        // STAGE 3 — Push to Docker Hub
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest
                        docker logout
                    """
                }
                echo "Pushed to Docker Hub"
            }
        }

        // STAGE 4 — Deploy to EC2
        stage('Deploy to EC2') {
    steps {
        sshagent(['ec2-ssh-key']) {
            sh """
                ssh -o StrictHostKeyChecking=no ${EC2_HOST} '
                    docker restart ${CONTAINER_NAME}
                '
            """
        }
    }
}

        // STAGE 5 — Verify running container
        stage('Verify') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_HOST} \
                            'docker inspect ${CONTAINER_NAME} \
                            --format="Running image: {{.Config.Image}}"'
                    """
                }
            }
        }
    }

    post {
        success {
            echo "PIPELINE SUCCESS — Build #${BUILD_NUMBER} live on EC2!"
        }
        failure {
            echo "PIPELINE FAILED — Check console logs above"
        }
        always {
            // Clean local images to save disk space
            sh """
                docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER} 2>/dev/null || true
                docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest 2>/dev/null || true
            """
        }
    }
}