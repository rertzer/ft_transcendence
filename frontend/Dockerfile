FROM node:20

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install
RUN yarn add react-router-dom
COPY . .
CMD ["yarn", "start"]