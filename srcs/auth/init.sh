#!/bin/bash

# Verifica se lsof è installato
if ! dpkg -l | grep -q lsof; then
    echo "Installing lsof..."
    apt-get update && apt-get install -y lsof
fi

# Verifica se Bundler è installato
if ! gem list bundler -i; then
    echo "Installing Bundler..."
    gem install bundler
fi

# Mostra i processi che usano la porta 9292 prima di ucciderli
echo "Processes using port 9292 (before kill):"
lsof -i :9292

# Uccidi i processi che usano la porta 9292
echo "Killing processes using port 9292..."
lsof -i :9292 | awk 'NR>1 {print $2}' | xargs -r kill -9

# Mostra i processi che usano la porta 9292 dopo il kill
echo "Processes using port 9292 (after kill):"
lsof -i :9292

clear

# Installa i pacchetti gem con Bundler
echo "Installing gems using Bundler..."
cd authentication
bundle install

# Avvia il server
echo "Starting server..."
bundle exec ruby server.rb
