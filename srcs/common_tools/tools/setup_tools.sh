#!/bin/bash

GEMS=()

for gm in $GEMS
do
    if [ -z "$(gem list | grep $gm)" ]; then
        gem install $gm
        echo "installed $gm"
    fi
done