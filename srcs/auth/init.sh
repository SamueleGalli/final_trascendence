#!/bin/bash

sudo gem install "puma" "uri" "net/http" "json" "oauth2" "dotenv" "logger" "rack" "rack/session/cookie"
# ruby -exec bundle add "rackup" "puma"

# GEMS=("sinatra" "webrick" "securerandom" "json" "oauth2" "dotenv" "logger")

#export PATH="$(ruby -e 'print Gem.user_dir')/bin:$PATH"

# for gm in ${GEMS[@]}
# do
#     if [ -z "$(gem list | grep $gm)" ]; then
#         gem install $gm
#     fi
#     echo "Installed $gm!"
# done

echo "finished installing"

cd authentication && rackup config.ru