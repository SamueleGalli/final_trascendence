#!/bin/bash

clear

if [ -f .env ]; then
    source .env
else
    echo -e "$RED.env file not found!$RESET"
    exit 1
fi

generate_ssl_certificate() {
    echo -e "Generating self-signed SSL certificate..."
    mkdir -p crypted_data
    chmod 777 $CERT_FILE
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $SERVER_KEY -out $CERT_FILE
    chmod 777 crypted_data/server.key crypted_data/server.crt
    echo -e "$GREEN Self-signed SSL certificate generated!$RESET"
}

handle_error() {
    echo -e "$RED Error: $1$RESET"
    exit 1
}

if [ ! -f "$CERT_FILE" ] || [ ! -f "$SERVER_KEY" ]; then
    echo -e "$GREEN SSL certificates not found. Generating new certificates...$RESET"
    generate_ssl_certificate
else
    chmod 777 $CERT_FILE
    chmod 777 crypted_data/server.key crypted_data/server.crt
    echo -e "$GREEN SSL certificate already exists.$RESET"
fi
echo -e "$GREEN The certificate are in $SERVER_KEY.\n and \n$CERT_FILE.$RESET"

openssl x509 -in $CERT_FILE -text -noout || handle_error "$RED Invalid certificate format.$RESET"

echo -e "$YELLOW Setting up SSL directory...$RESET"

if [ -f ./create_certificate.sh ]; then
    bash ./create_certificate.sh
else
    echo -e "$RED create_certificate.sh not found!$RESET"
    exit 1
fi

echo -e "$GREEN SSL setup complete.$RESET"

echo -e "$YELLOW Configuring Nginx...$RESET"

chmod +x nginix.sh

if [ -f ./nginix.sh ]; then
    bash ./nginix.sh
else
    echo -e "$RED nginix.sh not found!$RESET"
    exit 1
fi
