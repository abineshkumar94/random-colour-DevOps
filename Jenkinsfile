pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "abineshkumar/react-random"
        DOCKER_CREDENTIALS_ID = "docker-hub-credentials"
        AWS_CREDENTIALS_ID = "aws-eks-credentials"
        AWS_REGION = "us-east-1"
        EKS_CLUSTER = "react-app"
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    sh '''
                    rm -rf random-colour-DevOps || true
                    git clone https://github.com/abineshkumar94/random-colour-DevOps.git
                    cd random-colour-DevOps
                    git reset --hard origin/main
                    '''
                }
            }
        }

        stage('Install Dependencies & Build React App') {
            steps {
                script {
                    sh '''
                    cd random-colour-DevOps
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
                    cd random-colour-DevOps
                    export DOCKER_BUILDKIT=1
                    docker build -t $DOCKER_IMAGE .
                    """
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
                    withCredentials([aws(credentialsId: AWS_CREDENTIALS_ID, region: AWS_REGION)]) {
                        sh """
                        aws eks --region $AWS_REGION update-kubeconfig --name $EKS_CLUSTER
                        kubectl apply -f random-colour-DevOps/k8s/deployment.yaml
                        kubectl rollout status deployment/react-app
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "🚀 Deployment successful!"
        }
        failure {
            echo "❌ Deployment failed. Check logs."
        }
    }
}


