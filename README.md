# exchanger

Configure docker to up container.

## Getting Started

These instructions will cover usage information and for the docker container

### Prerequisities

In order to run this container you'll need docker installed.

* [Windows](https://docs.docker.com/windows/started)
* [OS X](https://docs.docker.com/mac/started/)
* [Linux](https://docs.docker.com/linux/started/)

### Usage

Build container in `local` version in the background

```shell
docker-compose -f docker-compose.yaml -f docker-compose.local.yaml up --build -d
```

Build container in `development` version in the background

```shell
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build -d
```

Build container in `production` version in the background

```shell
docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up --build -d
```

Stop, delete all containers and recreate this in `local` version

```shell
./local_recreate_docker.sh
```

Stop, delete all containers and recreate this in `development` version

```shell
./dev_recreate_docker.sh
```

Stop, delete all containers and recreate this in `production` version

```shell
./prod_recreate_docker.sh
```

### Only one container REBUILD - USAGE EXAMPLES

Rebuild only `frontend` layer for `local` environment

```shell
./one_container_rebuild.sh -container frontend -environment local
```

Rebuild only `nginx` layer for `dev` environment

```shell
./one_container_rebuild.sh -container nginx -environment dev
```
It works for layers ( api / frontend / nginx )


Configure file `hosts` to start container in local domain

```text
# local domains for production and development
127.0.0.1 exchanger.prod.com
127.0.0.1 exchanger.dev.com
# etc...
```

#### Symfony .env.local configuration

Database configuration

```text
DATABASE_URL=mysql://exchanger-user:UdUYFv8AERNwr4tK@172.22.0.8:3306/exchanger?serverVersion=5.7
```

RabbitMQ configuration

```text
MESSENGER_TRANSPORT_DSN=amqp://exchanger-rabbitmq-user:yECrrehD6yU9nwzM@172.22.0.6:5672/%2f/messages
```

SMTP configuration
```text
MAILER_DSN=smtp://172.22.0.5:1025
```

#### In browser

Mailcatcher and PhpMyAdmin only work in `development` version, RabbitMQ in both. Don't forget to start container.

* [Mailcatcher](http://172.22.0.5:1080)
* [PhpMyAdmin](http://exchanger.dev.com:8080)
* [Mongo Express](http://exchanger.dev.com:8085)
* [RabbitMQ](http://localhost:15672)

Monitoring tools

* [Grafana](http://exchanger.dev.com:8082)
* [Prometeus](http://exchanger.dev.com:8086)


#### Grafana configuration

Go to http://exchanger.dev.com:8082

1. Add "Data sources" (Prometheus + MySQL) in `Configuration / Data sources`

  - Prometheus
      `http://172.22.0.4:9090`
      `Server`
       Import additional plugins in header tab `Dashboards` (Prometheus Stats / Prometheus 2.0 Stats / Grafana metrics )
  - MySQL 172.22.0.8:3306 (root/root - database mysql)

2. Choose any Dashboard from `Dasboards / Manage`

Go to http://exchanger.dev.com:8086 to get list all posible metrics to use in grafana

3. Profit!
