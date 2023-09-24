#!/bin/bash
# Erstellt den Vant-API Service, muss im Repository Ornder ausgeführt werden

# Den Installationsort von npm ermitteln und in einer Variablen speichern
NPM_PATH=$(which npm)
REPO_PATH=$(pwd)

cat > /etc/systemd/system/vantapi.service << EOF
[Unit]
Description=Vant API Service

[Service]
Type=simple
ExecStart=$NPM_PATH run vant-api

Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=REPO_PATH

[Install]
EOF