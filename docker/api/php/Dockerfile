ARG PHP_VERSION=7.4

FROM php:${PHP_VERSION}-fpm-alpine

#Composer for Local (dev)
#RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

#Composer for Production
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN mkdir -p /var/log/supervisor
RUN mkdir -p /cronfiles

RUN apk update \
    && apk add --no-cache --update rabbitmq-c-dev libssh-dev postgresql-dev curl libxslt-dev imap-dev openssl-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql pdo sockets bcmath xsl  \
    && apk add --no-cache --update rabbitmq-c-dev libssh-dev postgresql-dev curl libzip-dev zip libxslt-dev libpng libpng-dev libjpeg-turbo-dev libwebp-dev zlib-dev libxpm-dev gd \
    && apk add --no-cache imagemagick-dev imagemagick \
    && docker-php-ext-install pdo_mysql pdo_pgsql pdo sockets bcmath xsl zip gd \
    && apk add --no-cache $PHPIZE_DEPS \
    && pecl install -o -f redis amqp \
    && pecl install imagick \
    && docker-php-ext-enable imagick redis amqp \
    && apk add supervisor \
    && docker-php-ext-configure imap --with-imap --with-imap-ssl \
    && docker-php-ext-install imap


RUN docker-php-source extract \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && rm -rf /var/cache/apk/*

RUN docker-php-ext-configure opcache --enable-opcache \
    && docker-php-ext-install opcache \
    && rm -rf /var/cache/apk/*

# Install mailparse extention for parsing emails
RUN apk update \
    && apk add g++ autoconf make re2c \
    && pecl install mailparse \
    && docker-php-ext-enable mailparse \
    && apk del g++ autoconf make re2c

RUN cd /usr/local/etc/php/conf.d/ \
    && printf 'memory_limit = 1536M \nmax_execution_time = 87 \nupload_max_filesize = 200M \npost_max_size = 20M \n' >> /usr/local/etc/php/conf.d/docker-php-additional.ini \
    && printf 'session.save_handler = redis \nsession.save_path = tcp://redis:6379 \n' >> /usr/local/etc/php/conf.d/docker-php-ext-redis.ini

WORKDIR /var/www/exchanger/api

COPY --chown=www-data:www-data . /var/www/exchanger/api

RUN chmod -R 775 /var/www/exchanger/api/var
