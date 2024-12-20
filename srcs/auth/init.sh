#!/bin/bash

clear

echo "installing gems..."
gems=("json" "oauth2" "dotenv" "logger" "rack" "puma" "openssl")

for gem in "${gems[@]}"
do
  if gem list "$gem" -i > /dev/null 2>&1; then
    echo "$gem is already installed."
  else
    echo "$gem is not installed. Installing..."
    sudo gem install "$gem"
  fi
done

clear

# Controlla lo stato di Apache2
echo "Controllo stato apache2..."
sudo systemctl status apache2

# Avvia Apache2
echo "Avvio apache2..."
sudo systemctl start apache2

# Avvia Puma in background e prendi il suo PID
echo "Avvio Puma..."
RACK_ENV=production rackup authentication/config.ru &

# Salva il PID di Puma
PUMA_PID=$!

# Attendi che Puma si spenga e poi ferma Apache
wait $PUMA_PID

# Una volta che Puma si è fermato, ferma Apache
echo "Puma è stato fermato, fermo Apache..."
sudo systemctl stop apache2

echo "Apache fermato."
