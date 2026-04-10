#!/usr/bin/env sh
set -euo pipefail

IMAGE=ghcr.io/mariolyon/agriwatch:latest
docker pull $IMAGE 
docker run --env-file .env -it -p "3000:3000" $IMAGE sh

