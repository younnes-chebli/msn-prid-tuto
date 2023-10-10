source publish-appname.sh
cd publish
# supprime le conteneur s'il existe déjà
docker rm -f $DOCKER_APP_NAME
# crée l'image en utilisant le fichier Dockerfile
docker build . -t $DOCKER_APP_NAME
# crée un conteneur du même nom en démarrant l'image et rend le port 80 (HTTP) du conteneur accessible 
docker run -d --name $DOCKER_APP_NAME -p 80:80 $DOCKER_APP_NAME
