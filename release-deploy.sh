#!/bin/bash

GIT_SHA=$(git rev-parse --short HEAD)

RELEASE="release-$1"

echo "Release: $1"

echo "running npm install..."
npm i

echo "building prod build..."
npm run build

echo "building docker image..."
docker build -t buildbench/analytic-ui-v2:latest .

echo "tagging docker image..."
docker tag buildbench/analytic-ui-v2:latest us.gcr.io/container-registry-276316/buildbench/analytic-ui-v2:$RELEASE
docker tag buildbench/analytic-ui-v2:latest us.gcr.io/container-registry-276316/buildbench/analytic-ui-v2:$GIT_SHA
docker tag buildbench/analytic-ui-v2:latest us.gcr.io/container-registry-276316/buildbench/analytic-ui-v2:latest

echo "pushing docker image"
docker push us.gcr.io/container-registry-276316/buildbench/analytic-ui-v2:latest
docker push us.gcr.io/container-registry-276316/buildbench/analytic-ui-v2:$GIT_SHA
docker push us.gcr.io/container-registry-276316/buildbench/analytic-ui-v2:$RELEASE

sleep 10
echo "redeploying kubernetes pod..."
#Windows
kubectl -n dev rollout restart deploy buildbench-analytic-ui-v2

#Mac
kubectl --kubeconfig=/Users/kirchner/.kube/ks_config  -n dev rollout restart deploy buildbench-analytic-ui-v2

 echo "done!"
