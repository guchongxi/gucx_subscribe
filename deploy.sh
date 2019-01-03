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

echo -e "\nRun container..."
# $4 pm2 secret key
# $4 pm2 pm2 public key
docker run -d -p 8181:8181 --name $3 -e PM2_SECRET_KEY=$4 -e PM2_PUBLIC_KEY=$5 -e PM2_MACHINE_NAME=$3 $1:$2
echo "Run container success"

# 立即测试可能由于服务没起来导致 502，延迟3秒
sleep 3

HOST_NAME=https://weixin.guchongxi.com

# -s Silent mode (don't output anything)
# -m Maximum time allowed for the transfer
# --connect-timeout Maximum time allowed for connection
# -I Show document info only
info=$(curl -s -m 10 --connect-timeout 10 -I $HOST_NAME)

#获取返回码
code=$(echo $info | grep "HTTP" | awk '{print $2}')
#对响应码进行判断
if [ "$code" == "200" ]; then
	echo -e "\nDeploy success🎉"
else
	echo -e "\nDeploy fail$code"
fi
