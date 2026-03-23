pipeline {
  agent any

  tools {
    nodejs 'Node 20'
  }

  environment {
    NODE_OPTIONS = '--max-old-space-size=4096'
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Backend') {
      parallel {
        stage('Backend - Build & Test') {
          stages {
            stage('Backend Install') {
              steps {
                dir('backend') {
                  sh 'npm ci'
                }
              }
            }
            stage('Backend Unit Tests') {
              steps {
                dir('backend') {
                  sh 'npm test -- --passWithNoTests'
                }
              }
            }
            stage('Backend Build') {
              steps {
                dir('backend') {
                  sh 'npm run build'
                }
              }
              post {
                success {
                  stash name: 'backend-dist', includes: 'backend/dist/**'
                }
              }
            }
          }
        }

        stage('Frontend') {
          stages {
            stage('Frontend Install') {
              steps {
                dir('frontend') {
                  sh 'npm ci'
                }
              }
            }
            stage('Frontend Unit Tests') {
              steps {
                dir('frontend') {
                  sh 'npm test -- --run'
                }
              }
            }
            stage('Frontend Build') {
              steps {
                dir('frontend') {
                  sh 'npm run build'
                }
              }
              post {
                success {
                  stash name: 'frontend-standalone', includes: 'frontend/.next/standalone/**', allowEmpty: true
                  stash name: 'frontend-static', includes: 'frontend/.next/static/**', allowEmpty: true
                  stash name: 'frontend-public', includes: 'frontend/public/**', allowEmpty: true
                }
              }
            }
          }
        }
      }
    }

    stage('Archive') {
      when {
        expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
      }
      steps {
        archiveArtifacts artifacts: 'backend/dist/**/*', fingerprint: true, allowEmptyArchive: true
        archiveArtifacts artifacts: 'frontend/.next/**/*', fingerprint: true, allowEmptyArchive: true
      }
    }
  }

  post {
    always {
      cleanWs(deleteDirs: true, patterns: [
        [pattern: 'node_modules', type: 'INCLUDE'],
        [pattern: '.npm', type: 'INCLUDE']
      ])
    }
    success {
      echo 'Pipeline Musify réussi.'
    }
    failure {
      echo 'Pipeline Musify échoué.'
    }
  }
}
