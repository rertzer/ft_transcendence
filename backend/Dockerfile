
FROM node:20 AS base

RUN mkdir /var/avatar
WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

FROM base AS dev
RUN yarn install --frozen-lockfile
COPY . .
CMD ["sh", "script.sh"]


FROM base AS prod
RUN yarn install --frozen-lockfile --production
COPY . .
RUN yarn add global @nestjs/cli
RUN yarn build

CMD ["yarn", "start:prod"]
