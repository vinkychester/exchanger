#!/bin/sh
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}==============================================="
echo -e "==========${NC}STARTING RECREATING DATABASE${GREEN}============="
echo -e "===============================================${NC}"
echo -e ""
echo -e ""
echo -e "${RED}==========${NC}DATABASE DROP${RED}=============${NC}"
echo -e ""
echo -e ""
docker-compose exec api php bin/console doctrine:database:drop --force
echo -e ""
echo -e ""
echo -e "${GREEN}==============================================="
echo -e "==========${NC}DATABASE & SCHEMA CREATING${GREEN}============="
echo -e "===============================================${NC}"
docker-compose exec api php bin/console doctrine:database:create
docker-compose exec api php bin/console doctrine:schema:create
echo -e ""
echo -e ""
echo -e "${GREEN}==============================================="
echo -e "==========${NC}CreatePairUnitTabs & ParsePairUnit${GREEN}============="
echo -e "===============================================${NC}"
docker-compose exec api php bin/console CreatePairUnitTabs
docker-compose exec api php bin/console ParsePairUnit
docker-compose exec api php bin/console MicCNetworks:fetch
docker-compose exec api php bin/console cron:fetchFiatRates
docker-compose exec api php bin/console cron:fetchCryptoRates
docker-compose exec api php bin/console referral-levels:create:default
docker-compose exec api php bin/console cron:FetchBalancesPairUnit
echo -e ""
echo -e ""
echo -e "${GREEN}==============================================="
echo -e "==================${NC}FINISHED!${GREEN}===================="
echo -e "===============================================${NC}"