#!/bin/bash

set -e

echo "==============================="
echo "Controllo installazione di Ruby..."
if ruby --version; then
    echo "✅ Ruby è già installato."
else
    echo "❌ Ruby non è installato. Installazione Ruby..."
    apt-get update
    apt-get install ruby-full -y
    echo "✅ Ruby installato correttamente."
fi

echo "==============================="
echo "Controllo installazione di Bundler..."
if bundler --version; then
    echo "✅ Bundler è già installato."
else
    echo "❌ Bundler non è installato. Tentativo di installazione..."
    gem install bundler || { echo "❌ Errore durante l'installazione di Bundler."; exit 1; }
    echo "✅ Bundler installato correttamente."
fi

echo "==============================="
echo "Pulizia delle gemme..."
if gem cleanup; then
    echo "✅ Pulizia delle gemme completata."
else
    echo "❌ Errore durante la pulizia delle gemme."
fi

cd authentication/
echo "==============================="
echo "Aggiornamento delle gemme con Bundler..."
if bundle update; then
    echo "✅ Aggiornamento completato."
else
    echo "❌ Errore durante l'aggiornamento delle gemme."
fi

echo "==============================="
echo "Installazione delle gemme..."
if bundle install; then
    echo "✅ Gemme installate correttamente."
else
    echo "❌ Errore durante l'installazione delle gemme."
    echo "Ecco i dettagli dell'errore:"
    bundle install
fi

echo "==============================="
echo "Script completato. Avvio server..."

bundle exec ruby server.rb