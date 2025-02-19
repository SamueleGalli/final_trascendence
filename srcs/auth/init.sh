#!/bin/bash

echo "==============================="
echo "Controllo installazione di Ruby..."
if ruby --version &>/dev/null; then
    echo "✅ Ruby è già installato."
else
    echo "❌ Ruby non è installato. Installazione Ruby..."
    apt-get update
    apt-get install ruby-full -y
    echo "✅ Ruby installato correttamente."
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
echo "Installazione ufw..."

if ufw --version &>/dev/null; then
    echo "✅ ufw è già installato."
else
    echo "❌ ufw non è installato. Installazione ufw..."
    apt-get update  
    apt-get install -y ufw
    echo "✅ ufw installato correttamente."
fi

echo "Raccolta IP..."
IP=$(hostname -I | awk '{print $1}')
if [[ -z "$IP" ]]; then
    echo "❌ Impossibile rilevare l'indirizzo IP. Verifica la configurazione di rete."
    exit 1
fi
echo "Indirizzo IP del server: $IP"

echo "==============================="
echo "Configurazione di UFW per la rete locale..."
ufw allow from $IP/24 to any port 9292 proto tcp

if ufw status | grep -q "inactive"; then
    echo "UFW non è attivo. Abilitando UFW..."
    ufw enable
else
    echo "UFW è già attivo."
fi

echo "==============================="
echo "Script completato. Avvio server..."

bundle exec ruby server.rb