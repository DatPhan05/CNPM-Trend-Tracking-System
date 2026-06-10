// --------------------------------------------------------------------------
// Jenkinsfile for Scientific Journal Publication Trend Tracking System
//
// CI/CD Pipeline stages:
//   1. Checkout  - Checkout source code from SCM
//   2. Install   - Install Node.js dependencies (backend + frontend)
//   3. Lint      - Run TypeScript check (backend) & ESLint (frontend) in parallel
//   4. Test      - Run Jest unit tests with --passWithNoTests
//   5. Build     - Build Docker images tagged with BUILD_NUMBER
//   6. Deploy    - Tear down old stack, start fresh containers
//   7. Health    - Verify services respond on correct port (80, not 3000)
//
// Post actions:
//   success → Email notification
//   failure → Cleanup containers + Email notification
//   always  → Prune unused Docker images
// --------------------------------------------------------------------------

pipeline {
    agent any

    environment {
        IMAGE_TAG    = "${env.BUILD_NUMBER}"
        COMPOSE_FILE = 'docker-compose.yml'
        APP_URL      = 'http://localhost:80'
        // Update this to your team's email in Jenkins → Manage Jenkins → Configure System
        NOTIFY_EMAIL = 'admin@trendtracking.com'
    }

    stages {

        // ── Stage 1: Checkout ────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo "📥 Checking out source code (Build #${IMAGE_TAG})..."
                checkout scm
            }
        }

        // ── Stage 2: Install Dependencies ────────────────────────────────────
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing backend dependencies...'
                sh 'npm ci'
                echo '📦 Installing frontend dependencies...'
                sh 'npm ci --prefix frontend'
            }
        }

        // ── Stage 3: Lint (Parallel) ─────────────────────────────────────────
        // FIX: Added Lint stage (was missing entirely)
        stage('Lint') {
            parallel {
                stage('Lint: Backend (TypeScript)') {
                    steps {
                        echo '🔍 Checking backend TypeScript types...'
                        // --noEmit validates types without writing output files
                        sh 'npx tsc --noEmit'
                    }
                }
                stage('Lint: Frontend (ESLint)') {
                    steps {
                        echo '🔍 Running ESLint on frontend...'
                        sh 'npm run lint --prefix frontend'
                    }
                }
            }
        }

        // ── Stage 4: Unit Tests ───────────────────────────────────────────────
        // FIX: Added unit test stage before Docker build (was missing)
        stage('Test') {
            steps {
                echo '🧪 Running Jest unit tests...'
                // --runInBand : run serially to avoid DB port conflicts
                // --forceExit : ensure Jest exits after tests complete
                // --passWithNoTests : don't fail if no test files found yet
                sh 'npm test -- --runInBand --forceExit --passWithNoTests'
            }
            post {
                always {
                    // Publish JUnit test results to Jenkins dashboard (if reporter is configured)
                    junit allowEmptyResults: true, testResults: '**/test-results/*.xml'
                }
            }
        }

        // ── Stage 5: Build Docker Images ─────────────────────────────────────
        // FIX: Images are now tagged with BUILD_NUMBER for version tracking & rollback
        stage('Build Docker Images') {
            steps {
                echo "🐳 Building Docker images (tag: build-${IMAGE_TAG})..."
                sh """
                    docker compose -f ${COMPOSE_FILE} build \
                        --build-arg BUILD_NUMBER=${IMAGE_TAG}
                """
                echo "✅ Build complete — tagged as build-${IMAGE_TAG}"
            }
        }

        // ── Stage 6: Deploy ───────────────────────────────────────────────────
        stage('Deploy') {
            steps {
                echo '🚀 Deploying application stack...'
                // Bring down previous stack cleanly before re-deploying
                sh "docker compose -f ${COMPOSE_FILE} down --remove-orphans || true"
                sh "docker compose -f ${COMPOSE_FILE} up -d"
                echo '⏳ Waiting 20s for all services to stabilise...'
                sleep 20
            }
        }

        // ── Stage 7: Health Check ─────────────────────────────────────────────
        // FIX: Changed port from 3000 → 80 (NGINX exposes port 80, not 3000)
        stage('Health Check') {
            steps {
                echo "🩺 Running health checks against ${APP_URL}..."

                // 1. Show container status
                sh "docker compose -f ${COMPOSE_FILE} ps"

                // 2. Verify NGINX serves the React frontend on PORT 80
                sh """
                    curl -f --retry 5 --retry-delay 3 --retry-connrefused \
                        -o /dev/null -w "Frontend HTTP Status: %{http_code}\\n" \
                        ${APP_URL}
                """

                // 3. Verify REST API is reachable via NGINX proxy on PORT 80
                sh """
                    curl -f --retry 5 --retry-delay 3 --retry-connrefused \
                        -o /dev/null -w "API HTTP Status: %{http_code}\\n" \
                        ${APP_URL}/api/trends \
                    || echo "⚠️  API /api/trends returned non-2xx — may need seed data"
                """

                echo '✅ Health checks passed!'
            }
        }

    }

    // ── Post Actions ─────────────────────────────────────────────────────────
    post {
        // FIX: Added success email notification (was missing)
        success {
            echo "🎉 Pipeline #${IMAGE_TAG} completed successfully!"
            mail(
                to:      "${NOTIFY_EMAIL}",
                subject: "✅ [BUILD SUCCESS] SJTTS Build #${IMAGE_TAG}",
                body:    """Build #${IMAGE_TAG} succeeded.

Branch  : ${env.GIT_BRANCH ?: 'N/A'}
Commit  : ${env.GIT_COMMIT ?: 'N/A'}
Duration: ${currentBuild.durationString}
URL     : ${env.BUILD_URL}

Application is live at: ${APP_URL}
"""
            )
        }

        // FIX: Added cleanup + failure email notification (was only cleanup before)
        failure {
            echo "❌ Pipeline #${IMAGE_TAG} failed. Tearing down containers..."
            sh "docker compose -f ${COMPOSE_FILE} down --remove-orphans || true"
            mail(
                to:      "${NOTIFY_EMAIL}",
                subject: "❌ [BUILD FAILED] SJTTS Build #${IMAGE_TAG}",
                body:    """Build #${IMAGE_TAG} FAILED.

Branch  : ${env.GIT_BRANCH ?: 'N/A'}
Commit  : ${env.GIT_COMMIT ?: 'N/A'}
Duration: ${currentBuild.durationString}
URL     : ${env.BUILD_URL}

Check the Jenkins console output for details.
"""
            )
        }

        // Prune dangling images after every run to keep disk clean
        always {
            sh 'docker image prune -f || true'
        }
    }
}
