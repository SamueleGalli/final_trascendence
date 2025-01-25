#!/bin/bash

apt install net-tools
echo $(echo "My address is:"; ip -4 -o -br addr | grep 172)

postgres
