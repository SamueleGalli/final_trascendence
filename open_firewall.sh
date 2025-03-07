#!/bin/bash

if ! command -v ufw &> /dev/null
then
    echo "ufw non è installato. Procedo con l'installazione..."
    sudo apt-get update -y
    sudo apt-get install -y ufw
else
    echo "ufw è già installato."
fi

echo -e "\e[32mil primo ip e l'usabile $(hostname -I)\e[0m"

echo "Configurando il firewall per consentire il traffico sulla porta 9292..."
sudo ufw allow 9292
sudo ufw reload

if ! sudo ufw status | grep -q "active"
then
    echo "Abilitando il firewall..."
    sudo ufw enable
else
    echo "Il firewall è già abilitato."
fi

sudo ufw status verbose
