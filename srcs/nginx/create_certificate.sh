if [ -f .env ]; then
    source .env
else
    echo -e "$RED.env file not found!$RESET"
    exit 1
fi

mkdir -p /etc/ssl/private /etc/ssl/certs /var/www/keys
chmod -R 755 /etc/ssl /var/www

if [ -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
    echo -e "$GREEN Let's Encrypt certificates found. Copying them...$RESET"


    if [ ! -f /etc/ssl/certs/server.crt ]; then
        cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /etc/ssl/certs/server.crt || handle_error "Failed to copy fullchain.pem"
    else
        echo -e "$YELLOW Certificate already exists at /etc/ssl/certs/server.crt.$RESET"
    fi


    if [ ! -f $SERVER_KEY ]; then
        cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $SERVER_KEY || handle_error "Failed to copy privkey.pem"
    else
        echo -e "$YELLOW Private key already exists at $SERVER_KEY.$RESET"
    fi
else
    echo -e "$RED No Let's Encrypt certificates found. Using self-signed certificates...$RESET"


    if [ ! -f $SERVER_KEY ]; then
        cp $SSL_DIR/private/server.key /etc/ssl/private/ || handle_error "Failed to copy self-signed server.key"
    fi

    if [ ! -f /etc/ssl/certs/server.crt ]; then
        cp $SSL_DIR/certs/server.crt /etc/ssl/certs/ || handle_error "Failed to copy self-signed server.crt"
    fi
fi