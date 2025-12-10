pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "mahesh1925"
        EC2_USER = "ubuntu"
        EC2_HOST = "13.55.102.230"
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/maheshpalakonda/Gamyartha.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    sh """
                    cd backend
                    docker build -t ${DOCKERHUB_USER}/gamyartha-backend:latest .
                    """
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    sh """
                    cd frontend
                    docker build -t ${DOCKERHUB_USER}/gamyartha-frontend:latest .
                    """
                }
            }
        }

        stage('Login DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh "docker push ${DOCKERHUB_USER}/gamyartha-backend:latest"
                sh "docker push ${DOCKERHUB_USER}/gamyartha-frontend:latest"
            }
        }

        stage('Copy Repo to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        rsync -avz --delete \
                        -e "ssh -o StrictHostKeyChecking=no" \
                        ./ ${EC2_USER}@${EC2_HOST}:/home/ubuntu/Gamyartha/
                    """
                }
            }
        }

        stage('Deploy via Docker Compose') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            cd ~/Gamyartha/deploy &&
                            docker-compose pull &&
                            docker-compose down &&
                            docker-compose up -d
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "🚀 Deployment Complete!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}

