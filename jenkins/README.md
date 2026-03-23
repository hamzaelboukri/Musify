# Jenkins avec Docker CLI

Ce Dockerfile étend l'image officielle Jenkins et ajoute le client Docker, permettant d'exécuter `docker build` et `docker push` dans le pipeline.

## Build et run

```bash
cd jenkins
docker build -t jenkins-with-docker .
```

Puis (après avoir arrêté/supprimé l'ancien container) :

```bash
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkins-with-docker
```

## Sur Windows (commande sur une seule ligne)

```powershell
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkins-with-docker
```
