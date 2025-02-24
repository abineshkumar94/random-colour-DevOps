pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "abineshkumar/react-random"
        DOCKER_CREDENTIALS_ID = "docker-hub-credentials"
        AWS_REGION = "us-east-1"
        EKS_CLUSTER = "react-app"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/abineshkumar94/random-colour-DevOps.git'
            }
        }

        stage('Install Dependencies & Build React App') {
            steps {
                script {
                    sh '''
                    npm install
                    npm run build
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                    export DOCKER_BUILDKIT=1
                    docker build -t $DOCKER_IMAGE .
                    """
                }
            }
        }

    stage('Push Docker Image to Docker Hub') {
    steps {
        script {
            withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                sh """
                echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                docker push $DOCKER_IMAGE
                docker logout
                """
            }
        }
    }
}
    stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    withDockerRegistry([credentialsId: DOCKER_CREDENTIALS_ID, url: "https://index.docker.io/v1/"]) {
                        sh "docker push $DOCKER_IMAGE"
                    }
                }
            }
        }

        stage('Deploy to AWS EKS') {
            steps {
                script {
                    sh """
                    aws eks --region $AWS_REGION update-kubeconfig --name $EKS_CLUSTER
                    kubectl apply -f k8s/deployment.yaml
                    kubectl rollout status deployment/react-app
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline executed successfully! 🚀"
        }
        failure {
            echo "Pipeline failed. Check the logs for errors. ❌"
        }
    }
}

