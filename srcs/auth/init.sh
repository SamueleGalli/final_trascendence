#!/bin/bash

clear

echo "Installing gems..."
gems=("json" "oauth2" "dotenv" "logger" "rack" "puma" "rack-session" "rack" "pg")

for gem in "${gems[@]}"
do
  if gem list "$gem" -i > /dev/null 2>&1; then
    echo "$gem is already installed."
  else
    echo "$gem is not installed. Installing..."
    gem install "$gem"
  fi
done

cd authentication && rackup config.ru