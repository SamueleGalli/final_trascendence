all: prep_dirs
	make -C ./srcs/common_tools/ all
	@docker-compose -f ./srcs/docker-compose.yml up
down:
	@docker-compose -f ./srcs/docker-compose.yml down

re: prep_dirs
	make -C srcs/common_tools/ re
	@docker stop $$(docker ps -qa);
	@docker rm $$(docker ps -qa);
	@docker-compose -f ./srcs/docker-compose.yml up --build

prep_dirs:
	@# Create all directories for databases and services
	@# @mkdir -p /path/here

clean:
	make -C srcs/common_tools/ clean
	@docker-compose -f srcs/docker-compose.yml stop
	@docker stop $$(docker ps -qa);\
	docker rm $$(docker ps -qa);\
	docker rmi -f $$(docker images -qa);\
	docker volume rm $$(docker volume ls -q);\
	docker network rm $$(docker network ls -q)

	# Destroy all directories
	rm -rf /home/leonardo/data/wordpress


.PHONY: all re down clean