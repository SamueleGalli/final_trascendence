#!/bin/bash

# Pulire la console
clear

# Installa le gemme necessarie
sudo gem install "json" "oauth2" "dotenv" "logger" "rack" "puma"

# Creare directory per certificato SSL temporaneo
mkdir -p https  # Crea la directory 'https' se non esiste

# Percorsi per il certificato e la chiave
CERT_FILE="https/server.crt"
KEY_FILE="https/server.key"

# Genera certificato SSL autofirmato senza output interattivo
openssl req -newkey rsa:2048 -nodes -keyout "$KEY_FILE" -x509 -out "$CERT_FILE" -days 1 \
    -subj "/C=US/ST=California/L=LosAngeles/O=MyCompany/OU=IT/CN=localhost/emailAddress=youremail@example.com" \
    > /dev/null 2>&1

# Avvia il server Puma con il certificato temporaneo
echo "Avvio il server con il certificato SSL temporaneo..."
RACK_ENV=production rackup authentication/config.ru

# Pulire i file del certificato una volta che il server è stato avviato
# Nota: Il server continuerà a funzionare anche dopo che i file sono stati eliminati
echo "Eliminazione dei certificati temporanei..."
rm -rf https  # Elimina la directory https che contiene il certificato e la chiave

# Fine script
echo "Certificato temporaneo eliminato. Server in esecuzione su https://localhost:9292"