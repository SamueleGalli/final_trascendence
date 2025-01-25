CONTAINERS	= tokenizer receiver postgres request_manager auth user_manager

# ========================================= #
SHELL:=/bin/bash

all: prep_dirs #stop_containers
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

	make -C srcs/common_tools/ re
	@docker ps -qa | xargs -r docker stop
	@docker ps -qa | xargs -r docker rm
	@docker-compose -f ./docker-compose.yml up --build

prep_dirs:
	@mkdir -p ./srcs/common_tools/tools
	@mkdir -p ./srcs/receiver
	@mkdir -p ./srcs/request_manager
	@mkdir -p ./srcs/auth
	@mkdir -p ./srcs/user_manager
	@chmod +x ./srcs/auth/init.sh
	@chmod +x ./srcs/request_manager/init.sh

clean:
	make -C srcs/common_tools/ clean
	@docker-compose -f docker-compose.yml stop
	@docker ps -qa | xargs -r docker stop
	@docker ps -qa | xargs -r docker rm
	#@docker images -qa | xargs -r docker rmi -f
	# @docker volume ls -q | xargs -r docker volume rm
	# @docker network ls -q | awk '!$(echo bridge|host|none) {print}' | xargs -r docker network rm
	# Destroy all directories
	rm -rf /data/wordpress

.PHONY: all stop_containers down re clean