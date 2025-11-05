pipeline {
    agent any
    
    environment {
        S3_BUCKET = 'trng2309-8'
        AWS_REGION = 'us-east-2'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/revature-training-projects-team8/movie-review-app-frontend.git'
            }
        }
        
        stage('Build React Frontend') {
            steps {
                    sh 'npm install'
                    sh 'npm run build'
            }
        }
        
        stage('Deploy Frontend to S3') {
            steps {
                dir('movie-review-app-frontend/dist') {
                    sh 'aws s3 sync . s3://${S3_BUCKET}/ --delete --region ${AWS_REGION}'
                    // sh 'aws s3 cp index.html s3://${S3_BUCKET}/index.html --region ${AWS_REGION}'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}