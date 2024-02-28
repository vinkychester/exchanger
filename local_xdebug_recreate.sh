#!/bin/sh
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}==============================================="
echo -e	"==========${NC}STARTING REBUILD PROCESS${GREEN}============="
echo -e "===============================================${NC}"
echo -e ""
echo -e "${GREEN}==============================================="
echo -e "==========${NC}STOP ALL DOCKER CONTAINERS${GREEN}==========="
echo -e "===============================================${NC}"
echo -e ""
docker stop $(docker ps -aq)
echo -e ""
echo -e "${RED}==============================================="
echo -e "========${NC}DELETING ALL DOCKER CONTAINERS${RED}========="
echo -e "===============================================${NC}"
echo -e ""
docker rm $(docker ps -aq)
echo -e ""
echo -e ""
echo -e "${GREEN}========${NC}START REBUILDING ALL DOCKER CONTAINERS${GREEN}=========${NC}"
echo -e ""
docker-compose -f docker-compose.yaml -f docker-compose.xdebug_local.yaml up --build -d
echo -e ""
echo -e ""
echo -e "${GREEN}==============================================="
echo -e "===============${NC}COMPOSER INSTALL!${GREEN}==============="
echo -e "===============================================${NC}"

docker-compose exec api composer config --global --auth http-basic.repo.packagist.com igor-itlab 825866aa17573d24b9cd498e1ea534ad363873a92ae8e44a6ee877f435cb
docker-compose exec api composer config repositories.private-packagist composer https://repo.packagist.com/it-lab-studio/
docker-compose exec api composer config repositories.packagist.org false
docker-compose exec api composer update

echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}========${NC}COPYING SUPERVISOR CONFIG${GREEN}==============${NC}"
echo -e "${GREEN}===============================================${NC}"
docker-compose exec api /usr/bin/supervisord -c /etc/supervisord.conf
docker-compose exec mercure /usr/bin/supervisord -c /etc/supervisord.conf
echo -e ""
echo -e ""
echo -e ""
echo -e ""
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}========${NC}PREPARE AND STARTING CRONS${GREEN}=============${NC}"
echo -e "${GREEN}===============================================${NC}"
echo -e ""
echo -e ""
docker-compose exec api /usr/bin/crontab /cronfiles/crontab.ini
echo -e "${GREEN}copy to /usr/bin/crontab from /cronfiles/crontab.ini${NC}"
echo -e ""
docker-compose exec api chmod 755 /cronfiles/script.sh /cronfiles/entry.sh
echo -e "${GREEN}chmod 755 /cronfiles/script.sh /cronfiles/entry.sh${NC}"
echo -e ""
docker-compose exec -d api /cronfiles/entry.sh
echo -e "${GREEN}starting /cronfiles/entry.sh${NC}"
echo -e ""
key=$(awk -F= '/JWT_PASSPHRASE/ { print $2 }' api/.env)
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}========${NC}THIS IS YOUR P_F (COPY PLEASE)${GREEN}=========${NC}"
echo -e ""
echo -e $key
echo -e ""
echo -e "${GREEN}===============================================${NC}"
echo -e ""
echo -e ""
echo -e "${GREEN}==============================================="
echo -e "=====${NC}DELETING OLD JWT KEYS & DIRECTORIES${GREEN}======="
echo -e "===============================================${NC}"
rm -r api/config/jwt
mkdir -p api/config/jwt
chmod 777 api/config/jwt
echo -e ""
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}========${NC}GENERATING NEW JWT KEYS${GREEN}=========${NC}"
echo -e "${GREEN}===============================================${NC}"
echo -e ""
openssl genrsa -out api/config/jwt/private.pem -aes256 4096
openssl rsa -pubout -in api/config/jwt/private.pem -out api/config/jwt/public.pem
chmod -R 777 api/config/jwt
docker-compose exec frontend npm install

docker-compose exec api php bin/console cache:clear
docker-compose exec api chmod -R 777 var/cache
docker-compose exec api chmod -R 777 var/log
docker-compose exec api chown www-data:www-data -R var/cache/
echo -e "${GREEN}==============================================="
echo -e "==================${NC}FINISHED!${GREEN}===================="
echo -e "===============================================${NC}"
