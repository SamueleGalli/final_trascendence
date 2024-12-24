all: prep_dirs
	make -C ./srcs/common_tools/ all
	@docker-compose -f ./srcs/docker-compose.yml up

down:
	@docker-compose -f ./srcs/docker-compose.yml down

re: prep_dirs
	make -C srcs/common_tools/ re
	@docker stop $$(docker ps -qa)
	@docker rm $$(docker ps -qa)
	@docker-compose -f ./srcs/docker-compose.yml up --build

prep_dirs:
	@mkdir -p ./srcs/logger
	@mkdir -p ./pages
	@mkdir -p ./srcs/common_tools/tools
	@mkdir -p ./srcs/receiver
	@mkdir -p ./srcs/request_manager
	@mkdir -p ./srcs/auth


clean:
	make -C srcs/common_tools/ clean
	@docker-compose -f srcs/docker-compose.yml stop
	@docker ps -qa | xargs -r docker stop
	@docker ps -qa | xargs -r docker rm
	@docker images -qa | xargs -r docker rmi -f
	@docker volume ls -q | xargs -r docker volume rm
	# @docker network ls -q | awk '!$(echo bridge|host|none) {print}' | xargs -r docker network rm
	# Destroy all directories
	rm -rf /data/wordpress

.PHONY: all re down clean
