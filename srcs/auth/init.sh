#!/bin/bash

echo "Processes using port 9292 (before kill):"
lsof -i :9292

echo "Killing processes using port 9292..."
lsof -i :9292 | awk 'NR>1 {print $2}' | xargs -r kill -9

# Verifica se la porta è libera
echo "Processes using port 9292 (after kill):"
lsof -i :9292

clear

echo "Installing gems using Bundler..."
cd authentication
bundle install

echo "Starting server..."
bundle exec ruby server.rb
