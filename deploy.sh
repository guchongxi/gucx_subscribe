#!/bin/bash
# $1: repo
# $2: image tag
echo "Pull origin image..."
docker pull $1:$2
echo "Pull origin image success"

# $3 container name
echo -e "\nGet local contaienr id..."
CID=$(docker ps -q -a -f name=$3)

if [ ! -z $CID ]; then
	echo "Remove local container..."
	docker stop $CID
	docker rm $CID
	echo "Remove local container success"
else
	echo "No local container"
fi

# docker run -d -p 8181:8181 --name $3 --env-file .env $1:$2
echo -e "\nRun container..."
docker run -d -p 8181:8181 --name $3 $1:$2
echo "Run container success🎉"
