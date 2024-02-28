#!/bin/sh

docker-compose down
docker-compose down --remove-orphans
docker network prune
docker system prune -a
service docker restart
