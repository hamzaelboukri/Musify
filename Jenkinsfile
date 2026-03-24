pipeline {
  agent any

  tools {
    nodejs 'NodeJS-20'
  }

  environment {
    NODE_OPTIONS = '--max-old-space-size=4096'
  }

  parameters {
    string(name: 'DOCKER_REGISTRY', defaultValue: 'hamzabkr', description: 'Docker registry namespace (Docker Hub user/org or full registry namespace)')
    booleanParam(name: 'DEPLOY_TO_STAGING', defaultValue: true, description: 'Déployer sur le serveur staging après push (nécessite STAGING_SSH_TARGET + credential staging-ssh-key)')
    string(name: 'STAGING_SSH_TARGET', defaultValue: '', description: 'Cible SSH user@hôte (ex: ubuntu@staging.example.com). Vide = étape ignorée.')
    string(name: 'STAGING_REMOTE_DIR', defaultValue: 'musify-staging', description: 'Répertoire distant sous $HOME pour docker compose staging')
  }

  options {
    skipDefaultCheckout()
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timeout(time: 45, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps {
        deleteDir()
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
                  sh 'npm config set fetch-timeout 300000 fetch-retries 5 fetch-retry-mintimeout 20000'
                  retry(2) { sh 'npm ci' }
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
                  sh 'npm config set fetch-timeout 300000 fetch-retries 5 fetch-retry-mintimeout 20000'
                  retry(2) { sh 'npm ci' }
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

    stage('Docker Build') {
      when {
        expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
      }
      steps {
        script {
          def tag = env.BUILD_NUMBER ?: 'latest'
          def imageBackend = "musify-backend:${tag}"
          def imageFrontend = "musify-frontend:${tag}"

          sh "docker build -t ${imageBackend} ./backend"
          sh "docker build -t ${imageFrontend} --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001/api --build-arg BACKEND_URL=http://localhost:3001 ./frontend"
        }
      }
    }

    stage('Docker Push') {
      when {
        expression {
          (currentBuild.result == null || currentBuild.result == 'SUCCESS') &&
          env.DOCKER_REGISTRY != null && env.DOCKER_REGISTRY != ''
        }
      }
      steps {
        script {
          def tag = env.BUILD_NUMBER ?: 'latest'
          def registry = env.DOCKER_REGISTRY ?: 'docker.io'
          def imageBackend = "${registry}/musify-backend:${tag}"
          def imageFrontend = "${registry}/musify-frontend:${tag}"

          sh "docker tag musify-backend:${tag} ${imageBackend}"
          sh "docker tag musify-frontend:${tag} ${imageFrontend}"
          withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            script {
              def loginServer = (registry.startsWith('ghcr.io')) ? 'ghcr.io' : 'docker.io'
              sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin ${loginServer}"
            }
            sh "docker push ${imageBackend}"
            sh "docker push ${imageFrontend}"
          }
        }
      }
    }

    stage('Deploy Staging') {
      when {
        allOf {
          expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
          expression { params.DEPLOY_TO_STAGING }
          expression { params.STAGING_SSH_TARGET != null && params.STAGING_SSH_TARGET.trim().length() > 0 }
          expression { env.DOCKER_REGISTRY != null && env.DOCKER_REGISTRY.trim().length() > 0 }
        }
      }
      steps {
        sshagent(credentials: ['staging-ssh-key']) {
          script {
            def reg = env.DOCKER_REGISTRY.trim()
            def tag = env.BUILD_NUMBER ?: 'latest'
            def target = params.STAGING_SSH_TARGET.trim()
            def remoteDir = params.STAGING_REMOTE_DIR?.trim() ?: 'musify-staging'
            sh """
              ssh -o StrictHostKeyChecking=accept-new ${target} 'mkdir -p ~/${remoteDir}'
              scp -o StrictHostKeyChecking=accept-new docker-compose.staging.yml ${target}:~/${remoteDir}/docker-compose.staging.yml
              ssh -o StrictHostKeyChecking=accept-new ${target} \\
                "cd ~/${remoteDir} && REGISTRY=${reg} IMAGE_TAG=${tag} docker compose -f docker-compose.staging.yml pull && REGISTRY=${reg} IMAGE_TAG=${tag} docker compose -f docker-compose.staging.yml up -d --remove-orphans"
            """
          }
        }
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
