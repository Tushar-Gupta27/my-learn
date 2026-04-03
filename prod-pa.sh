export DATABASE_URL=
export DATABASE_URL_REPLICA=
export DATABASE_URL_REPLICA2=
export DATABASE_URL_ALT=
export REDIS_PORT=6380
export ANALYTICS_REDIS_PORT=6380
export KAFKA_BROKERS=localhost:9093
export ANALYTICS_KAFKA_BROKERS=localhost:9093
export ORDERS_OPENSEARCH_HOST=
export ORDERS_OPENSEARCH_USERNAME=
export ORDERS_OPENSEARCH_PASSWORD=
export ORDERS_OPENSEARCH_ORDERS_INDEX=
export WALLET_TXN_OPENSEARCH_HOST=
export WALLET_TXN_OPENSEARCH_USERNAME=
export WALLET_TXN_OPENSEARCH_PASSWORD=
export WALLET_TXN_OPENSEARCH_INDEX=
# export NODE_ENV=production
# export APP_ENV=development
# echo APP_ENV=$APP_ENV
echo DATBASE_URL=$DATABASE_URL
echo REDIS_PORT=$REDIS_PORT
echo KAFKA_BROKERS=$KAFKA_BROKERS
echo ORDERS_OPENSEARCH_HOST=$ORDERS_OPENSEARCH_HOST
echo ORDERS_OPENSEARCH_ORDERS_INDEX=$ORDERS_OPENSEARCH_ORDERS_INDEX
echo WALLET_TXN_OPENSEARCH_HOST=$WALLET_TXN_OPENSEARCH_HOST
echo WALLET_TXN_OPENSEARCH_INDEX=$WALLET_TXN_OPENSEARCH_INDEX

docker start redis-server
echo REDIS_SERVER_RUNNING

cd ./dev/citymall-services
git stash apply $(git stash list | grep leaderMW | cut -d : -f 1)
nodemon packages/server/src/customer/partner-apis.js

trap "echo HELLO SIGINT" SIGINT 
# traps the signal & executes the command inside quotes
docker stop redis-server
sleep 1
echo REDIS_SERVER_STOPPED
git restore .
cd ../..
kill -2 $$ 
# kills current terminal / session