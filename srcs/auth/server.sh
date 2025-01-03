
# Ottieni il certificato SSL con Certbot (se non già fatto)
echo "Configurazione SSL con Let's Encrypt..."
sudo certbot --apache
sudo systemctl enable certbot.timer

echo -e "\n\n-------------------------------------------\n\n"

echo -e "\n\n-------------------------------------------\n\n"
# Controlla se Certbot è installato, se no, installalo
if ! command -v certbot &> /dev/null; then
  echo "Certbot non trovato, installazione in corso..."
  sudo apt update
  sudo apt install -y certbot python3-certbot-apache
else
  echo "Certbot è già installato."
fi

# Controlla se Apache2 è installato, altrimenti installalo
if ! command -v apache2 &> /dev/null; then
    echo "Apache2 non trovato. Installazione in corso..."
    sudo apt update
    sudo apt install -y apache2
else
    echo "Apache2 è già installato."
fi

# Abilita SSL e configuriamo il sito HTTPS
echo "Abilitazione dei moduli SSL e configurazione del sito HTTPS..."
sudo a2enmod ssl
sudo a2ensite default-ssl.conf

echo -e "\n\n-------------------------------------------\n\n"

# Configura Apache per il redirect da HTTP a HTTPS
echo "Configurazione Apache per il redirect da HTTP a HTTPS..."
sudo bash -c 'cat > /etc/apache2/sites-available/000-default.conf <<EOL
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    Redirect permanent / https://localhost/
</VirtualHost>
EOL'

# Configura il sito per HTTPS (utilizza il certificato di Let's Encrypt)
echo "Configurazione SSL in Apache..."
sudo bash -c 'cat > /etc/apache2/sites-available/default-ssl.conf <<EOL
<VirtualHost *:443>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/localhost/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/localhost/privkey.pem
    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
EOL'

# Riavvia Apache per applicare la configurazione SSL
echo "Riavvio di Apache2 per applicare le modifiche..."
sudo systemctl restart apache2

# Verifica lo stato di Apache2
echo "Controllo stato apache2..."
sudo systemctl status apache2

# Avvia Apache2 se non è già in esecuzione
if ! systemctl is-active --quiet apache2; then
    echo "Avvio di Apache2..."
    sudo systemctl start apache2
else
    echo "Apache2 è già in esecuzione."
fi
