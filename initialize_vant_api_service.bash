#!/bin/bash
# Erstellt den Vant-API Service, muss im Repository Ornder ausgeführt werden

# Den Installationsort von npm ermitteln und in einer Variablen speichern
NPM_PATH=$(which npm | xargs dirname)
NODE_PATH=$(which node | xargs dirname)
REPO_PATH=$(pwd)

sudo cat > /etc/systemd/system/vantapi.service << EOF
[Unit]
Description=Vant API Service

[Service]
Type=simple
ExecStart=$REPO_PATH/vant_api.sh
Restart=on-failure
RestartSec=1
KillMode=control-group
PIDFile=/run/vant_api.pid
Environment=PATH=/usr/bin:/usr/local/bin:$NPM_PATH:$NODE_PATH
Environment=NODE_ENV=production
WorkingDirectory=$REPO_PATH

[Install]
WantedBy=multi-user.target
EOF
