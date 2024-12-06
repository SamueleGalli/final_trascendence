#!/bin/bash

gem install "sinatra" "webrick" "securerandom" "json" "oauth2" "dotenv" "logger" "rackup" "puma"
# ruby -exec bundle add "rackup" "puma"

# GEMS=("sinatra" "webrick" "securerandom" "json" "oauth2" "dotenv" "logger")

# for gm in ${GEMS[@]}
# do
#     if [ -z "$(gem list | grep $gm)" ]; then
#         gem install $gm
#     fi
#     echo "Installed $gm!"
# done

echo "finished installing"

ruby auth.rb
