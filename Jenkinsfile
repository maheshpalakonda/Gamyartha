pipeline {
    agent any

    environment {
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
                    docker build -t gamyartha-backend:latest .
                    """
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    sh """
                    cd frontend
                    docker build -t gamyartha-frontend:latest .
                    """
                }
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
                            docker-compose down &&
                            docker-compose up -d --build
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

