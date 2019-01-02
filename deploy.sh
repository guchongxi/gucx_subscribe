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
# $4 pm2 secret key
# $4 pm2 pm2 public key
docker run -d -p 8181:8181 --name $3 -e PM2_SECRET_KEY=$4 -e PM2_PUBLIC_KEY=$5 -e PM2_MACHINE_NAME=$3 $1:$2
echo "Run container success🎉"
