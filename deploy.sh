#!/bin/sh
kubectl apply -f ./k8s/deployment.yaml
kubectl rollout restart deployment agriwatch
