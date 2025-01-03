#!/bin/bash

clear

if ! command -v ruby &> /dev/null; then
    echo "Ruby non trovato. Installando Ruby..."
    sudo apt-get update && sudo apt-get install -y ruby-full
else
    echo "Ruby è già installato."
fi

if ! command -v lsof &> /dev/null; then
    echo "Lsof non trovato. Installando lsof..."
    sudo apt-get update && sudo apt-get install -y lsof
else
    echo "Lsof è già installato."
fi

echo "Modificando i permessi della cartella /var/lib/gems..."
sudo chown -R $USER:$USER /var/lib/gems

if ! gem list bundler -i; then
    echo "Bundler non trovato. Installando Bundler..."
    gem install bundler --user-install
else
    echo "Bundler è già installato."
fi

cd authentication

echo "Aggiornando le gemme con Bundler..."
bundle update

echo "Processes using port 9292 (before kill):"
lsof -i :9292

echo "Killing processes using port 9292..."
lsof -i :9292 | awk 'NR>1 {print $2}' | xargs -r kill -9

echo "Processes using port 9292 (after kill):"
lsof -i :9292

echo "Installing gems using Bundler..."
bundle install

echo "Starting server..."
bundle exec ruby server.rb
