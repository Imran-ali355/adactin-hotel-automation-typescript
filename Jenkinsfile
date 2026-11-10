pipeline {
    agent any
    options {
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
        timeout(time: 120, unit: 'MINUTES')
    }
    parameters {
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser to test')
        booleanParam(name: 'RUN_API', defaultValue: false, description: 'Also run the separate API suite')
    }
    environment {
        BASE_URL = 'https://adactinhotelapp.com/'
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Run tests in Docker') {
            steps {
                withCredentials([
                    string(credentialsId: 'ADACTIN_USERNAME', variable: 'ADACTIN_USERNAME'),
                    string(credentialsId: 'ADACTIN_PASSWORD', variable: 'ADACTIN_PASSWORD')
                ]) {
                    sh 'bash scripts/run-docker.sh'
                }
            }
        }
    }
    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
            archiveArtifacts artifacts: 'playwright-report/**,allure-results/**,test-results/**', allowEmptyArchive: true
            publishHTML(target: [reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Report', keepAll: true, alwaysLinkToLastBuild: true, allowMissing: true])
            allure results: [[path: 'allure-results']]
        }
    }
}
