#!/bin/bash

GEMS=("pg" "digest")

for gm in $GEMS
do
    if [ -z "$(gem list | grep $gm)" ]; then
        gem install $gm
    fi
done

# if [ -z "$(gem list | grep digest)" ]; then
#     gem install digest
# fi

ruby main.rb
