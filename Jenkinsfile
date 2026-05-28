pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                echo 'Cloning repository'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t hanoi-game .'
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker stop hanoi-container || exit 0'
                bat 'docker rm hanoi-container || exit 0'
                bat 'docker run -d -p 8080:80 --name hanoi-container hanoi-game'
            }
        }
    }
}