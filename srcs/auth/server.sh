#!/bin/bash

sudo apt update
sudo apt install certbot

DOMAIN="miosito.com"
DOMAIN_WWW="www.miosito.com"
EMAIL="tuo@email.com"
WEBROOT="/var/www/html" # Cambia questo percorso con la root del tuo sito

# Installazione Certbot (se non già installato)
if ! [ -x "$(command -v certbot)" ]; then
  echo "Certbot non è installato. Sto installando Certbot..."
  sudo apt update
  sudo apt install -y certbot
fi

# Ottenere certificato SSL
echo "Sto ottenendo il certificato per $DOMAIN..."
sudo certbot certonly --webroot -w $WEBROOT -d $DOMAIN -m $EMAIL --agree-tos --no-eff-email

# Configurare l'auto-rinnovo
echo "Configurando il rinnovo automatico..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "Configurazione HTTPS completata! Non dimenticare di configurare il tuo web server per usare i certificati."
