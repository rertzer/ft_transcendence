
FROM node:20 AS base

ARG SSL_CREDENTIALS

RUN mkdir /var/avatar
RUN mkdir -p /etc/ssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:4096 -out /etc/ssl/pong-selfsigned.crt -keyout /etc/ssl/pong-selfsigned.key -subj  "/C=${SSL_CREDENTIALS}"

WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile
COPY . .

CMD ["sh", "script.sh"]