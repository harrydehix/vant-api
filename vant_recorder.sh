#!/bin/bash
# Ein Skript, um den Hauptprozess des Service zu ermitteln und ihn an systemd zu senden

# Starten Sie den Service mit npm start und speichern Sie die Prozess-ID in einer Variablen
PID=$(npm run vant-recorder & echo $!)

# Senden Sie die Prozess-ID an systemd
echo $PID > /run/vant_recorder.pid

# Warten Sie, bis der Service beendet wird
wait $PID
