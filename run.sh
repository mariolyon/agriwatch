#!/usr/bin/env sh
set -euo pipefail

docker pull ghcr.io/mariolyon/agriwatch:latest
docker run --rm -p "3000:3000" -e NODE_ENV=production "agriwatch:latest"
