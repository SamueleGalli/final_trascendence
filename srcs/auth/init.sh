#!/bin/bash

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
echo "Script completato.avvio server..."

bundle exec ruby server.rb