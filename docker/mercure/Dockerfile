ARG PHP_VERSION=7.4

FROM php:${PHP_VERSION}-fpm-alpine

#Composer for Local (dev)
#RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

#Composer for Production
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN mkdir -p /var/log/supervisor
RUN mkdir -p /cronfiles

RUN apk update \
    && apk add --no-cache --update rabbitmq-c-dev libssh-dev postgresql-dev curl libxslt-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql pdo sockets bcmath xsl  \
    && apk add --no-cache $PHPIZE_DEPS \
    && pecl install -o -f redis amqp \
    && docker-php-ext-enable redis amqp \
    && apk add supervisor

RUN docker-php-source extract \
    && pecl install mongodb apcu \
    && docker-php-ext-enable mongodb apcu

RUN docker-php-ext-configure opcache --enable-opcache \
    && docker-php-ext-install opcache \
    && rm -rf /var/cache/apk/*

RUN cd /usr/local/etc/php/conf.d/ \
  && printf 'memory_limit = 256M \nmax_execution_time = 300 \nupload_max_filesize = 20M \npost_max_size = 1M \nopcache.memory_consumption=128 \nopcache.interned_strings_buffer=8 \nopcache.max_accelerated_files=4000 \nopcache.revalidate_freq=60 \nopcache.fast_shutdown=1 \nopcache.enable_cli=1 \nopcache.enable=1' >> /usr/local/etc/php/conf.d/docker-php-additional.ini

WORKDIR /var/www/exchanger/mercure

COPY --chown=www-data:www-data . /var/www/exchanger/mercure
