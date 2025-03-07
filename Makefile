CONTAINERS	= tokenizer receiver postgres request_manager auth user_manager history_manager nginx chat game_data_manager

# ========================================= #
SHELL:=/bin/bash

all: prep_dirs #stop_containers
	@clear
	@echo "Configurando il firewall..."
	./open_firewall.sh
	make -C ./srcs/common_tools/ all
	@if [ "$(DETATCH)" = "true" ]; then \
		docker-compose -f ./docker-compose.yml up -d; \
	else \
		docker-compose -f ./docker-compose.yml up; \
	fi

$(CONTAINERS): prep_dirs
	@if [ "$(docker ps -a | grep $@ | wc -l)" = "1" ]; then \
		docker stop $@ \
		docker rm $@; \
		echo "cleaned"; \
	fi
	@if [ "$(DETATCH)" = "true" ]; then \
		docker-compose -f ./docker-compose.yml up -d $@; \
	else \
		docker-compose -f ./docker-compose.yml up $@; \
	fi
	# @docker-compose -f ./docker-compose.yml up $@

stop_containers:
	clear
	@echo "Stopping existing containers..."
	@sudo chmod +x /usr/bin/docker-compose
	@docker-compose -f ./docker-compose.yml stop
	@docker ps -qa | xargs -r docker stop
	@docker ps -qa | xargs -r docker rm

down:
	@docker-compose -f ./docker-compose.yml down

re: clean prep_dirs

	@echo "Configurando il firewall..."
	chmod +x open_firewall.sh
	./open_firewall.sh
	make -C srcs/common_tools/ re
	@docker ps -qa | xargs -r docker stop
	@docker ps -qa | xargs -r docker rm
	@docker-compose -f ./docker-compose.yml up --build

prep_dirs:
	@mkdir -p ./srcs/common_tools/tools
	@mkdir -p ./srcs/receiver
	@mkdir -p ./srcs/request_manager
	@mkdir -p ./srcs/trascendence
	@mkdir -p ./srcs/user_manager
	@chmod +x ./srcs/trascendence/init.sh
	@chmod +x ./srcs/request_manager/init.sh

clean:
	@clear
	make -C srcs/common_tools/ clean
	@docker-compose -f docker-compose.yml stop
	@docker ps -qa | xargs -r docker stop || true
	@docker ps -qa | xargs -r docker rm || true
	#@docker images -qa | xargs -r docker rmi -f
	# @docker volume ls -q | xargs -r docker volume rm
	# @docker network ls -q | awk '!$(echo bridge|host|none) {print}' | xargs -r docker network rm
	# Destroy all directories
	rm -rf /data/wordpress

clean_imgs:
	@docker images -qa | xargs -r docker rmi -f

.PHONY: all stop_containers down re clean remove_all