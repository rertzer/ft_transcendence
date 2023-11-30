FROM node:20

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install
RUN yarn add socket.io-client
RUN yarn add react-router-dom
RUN yarn add sass
RUN yarn add clipboard
RUN yarn add @types/react-router-dom --dev
RUN yarn add @mui/icons-material @mui/material @emotion/styled @emotion/react @types/react
COPY . .

RUN mkdir ssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:4096 -out ssl/pong-selfsigned.crt -keyout ssl/pong-selfsigned.key -subj  "/C=${SSL_CREDENTIALS}"


CMD ["yarn", "start"]
