#!/usr/bin/env sh
set -euo pipefail

IMAGE=ghcr.io/mariolyon/climview:latest
docker pull $IMAGE 
docker run --network="host" --env-file .env --rm -p "3000:3000" $IMAGE

