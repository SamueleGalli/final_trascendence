

echo "==============================="
echo "Controllo installazione di Ruby..."
if ruby --version &>/dev/null; then
    echo "✅ Ruby è già installato."
else
    echo "❌ Ruby non è installato. Installare Ruby prima di continuare."
    exit 1
fi

echo "==============================="
echo "Controllo installazione di Bundler..."
if bundler --version &>/dev/null; then
    echo "✅ Bundler è già installato."
else
    echo "❌ Bundler non è installato. Tentativo di installazione..."
    gem install bundler || { echo "❌ Errore durante l'installazione di Bundler."; exit 1; }
    echo "✅ Bundler installato correttamente."
fi

echo "==============================="
echo "Pulizia delle gemme..."
if gem cleanup &>/dev/null; then
    echo "✅ Pulizia delle gemme completata."
else
    echo "❌ Errore durante la pulizia delle gemme."
fi

cd authentication/
echo "==============================="
echo "Aggiornamento delle gemme con Bundler..."
if bundle update &>/dev/null; then
    echo "✅ Aggiornamento completato."
else
    echo "❌ Errore durante l'aggiornamento delle gemme."
    echo "Verificare la versione di Ruby e le dipendenze delle gemme."
fi

echo "==============================="
echo "Installazione delle gemme..."
if bundle install &>/dev/null; then
    echo "✅ Gemme installate correttamente."
else
    echo "❌ Errore durante l'installazione delle gemme."
    echo "Ecco i dettagli dell'errore:"
    bundle install
fi

echo "==============================="
echo "Script completato. Avvio server..."

sudo apt update
sudo apt install -y ufw

IP=$(hostname -I | awk '{print $1}')
if [[ -z "$IP" ]]; then
    echo "❌ Impossibile rilevare l'indirizzo IP. Verifica la configurazione di rete."
    exit 1
fi
echo "Indirizzo IP del server: $IP"

echo "==============================="
echo "Configurazione di UFW per la rete locale..."

sudo ufw allow from $IP/24 to any port 9292 proto tcp

if sudo ufw status | grep -q "inactive"; then
    echo "UFW non è attivo. Abilitando UFW..."
    sudo ufw enable
else
    echo "UFW è già attivo."
fi

bundle exec ruby server.rb