#!/bin/bash

clear

echo "Installing gems using Bundler..."
cd authentication
bundle install

echo "Starting server..."
bundle exec ruby server.rb