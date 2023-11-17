
FROM node:20 AS base

RUN mkdir /var/avatar
WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --frozen-lockfile
COPY . .
CMD ["sh", "script.sh"]