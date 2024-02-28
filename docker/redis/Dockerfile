FROM redis:alpine

WORKDIR /redis

COPY init.sh ./
RUN chmod 777 init.sh

RUN chmod +x init.sh
CMD ["sh", "init.sh", "--privileged"]
