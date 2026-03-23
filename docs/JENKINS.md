# Pipeline Jenkins - Musify

## Prérequis

### 1. Jenkins

- Jenkins 2.x ou supérieur
- Plugin **Pipeline** (inclus par défaut)
- Plugin **NodeJS** (pour la gestion des versions Node)

### 2. Configuration Node.js dans Jenkins

1. **Jenkins** → **Manage Jenkins** → **Global Tool Configuration**
2. Section **NodeJS** → **Add NodeJS**
3. Nom : `NodeJS-20` (doit correspondre exactement au nom utilisé dans le Jenkinsfile)
4. Version : cocher **Install automatically** et choisir **20.19+** ou **22.x LTS** (éviter 20.0.0)
5. Sauvegarder

> **Important** : Utiliser Node 20.19+ ou 22.x. La version 20.0.0 peut provoquer des avertissements EBADENGINE avec Vite et d'autres dépendances.

### 3. Création du job

1. **New Item** → nom : `Musify`
2. Type : **Pipeline**
3. Section **Pipeline** :
   - Definition : **Pipeline script from SCM**
   - SCM : **Git**
   - Repository URL : URL du dépôt (ex. `https://github.com/votre-org/Musify.git`)
   - Credentials : si dépôt privé
   - Branch : `*/dev` (ou `*/main` selon votre branche par défaut)
   - Script Path : `Jenkinsfile`
4. **Save**

## Prérequis Docker (pour build images)

- **Docker** installé sur l’agent Jenkins (ou socket Docker exposé)
- Pour le **push** : credentials `docker-hub-credentials` (Username + Password) dans Jenkins

## Étapes du pipeline

| Stage | Description |
|-------|-------------|
| **Checkout** | Récupération du code source |
| **Backend** (parallèle) | `npm ci` → tests unitaires → build NestJS |
| **Frontend** (parallèle) | `npm ci` → tests unitaires Vitest → build Next.js |
| **Archive** | Sauvegarde des artefacts (dist backend, .next frontend) |
| **Docker Build** | Build des images `musify-backend` et `musify-frontend` (tag = numéro de build) |
| **Docker Push** | Push vers le registry si `DOCKER_REGISTRY` est défini (optionnel) |

## Docker – Build & Push

- **Build** : à chaque run, construction des images `musify-backend:${BUILD_NUMBER}` et `musify-frontend:${BUILD_NUMBER}`
- **Push** : si la variable d’environnement `DOCKER_REGISTRY` est définie dans le job :
  - **Docker Hub** : `DOCKER_REGISTRY=hamzaelboukri` → images `hamzaelboukri/musify-backend`, etc.
  - **GHCR** : `DOCKER_REGISTRY=ghcr.io/hamzaelboukri` → images `ghcr.io/hamzaelboukri/musify-backend`, etc.
  - Credentials Jenkins : **Manage Jenkins** → **Credentials** → ajouter un secret "Username with password" avec l’ID `docker-hub-credentials`

## Artefacts archivés

- `backend/dist/**` – build compilé du backend NestJS
- `frontend/.next/**` – build Next.js (standalone + static)

## Durée estimée

~5 à 10 minutes selon les ressources du serveur Jenkins.

## Tests E2E (optionnel)

Les tests E2E (Playwright, intégration) nécessitent :
- Backend en cours d'exécution
- MongoDB

Pour les exécuter dans Jenkins, créer un job dédié ou une stage avec Docker Compose :

```groovy
stage('E2E') {
  steps {
    sh 'docker compose up -d'
    sh 'cd backend && npm run seed'
    sh 'cd frontend && npx playwright install chromium --with-deps'
    sh 'cd frontend && npm run test:e2e'
  }
  post {
    always {
      sh 'docker compose down'
    }
  }
}
```

## Variables d'environnement

Le pipeline utilise `NODE_OPTIONS=--max-old-space-size=4096` pour éviter les OOM sur des projets volumineux. Ajuster si nécessaire dans la section `environment` du `Jenkinsfile`.

## Dépannage

### ERR_SOCKET_TIMEOUT / network timeout

Si `npm ci` échoue avec un timeout réseau :
- Le pipeline configure `fetch-timeout: 300000` et `fetch-retries: 5`, et réessaie 2 fois
- Vérifier l'accès à `registry.npmjs.org` depuis le serveur Jenkins
- Si derrière un proxy : configurer `npm config set proxy` / `https-proxy` dans Jenkins
- Augmenter le timeout global du job si besoin (défaut : 45 min)
