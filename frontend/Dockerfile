FROM node:20

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install
RUN yarn add react-router-dom
RUN yarn add sass
RUN yarn add @mui/icons-material @mui/material @emotion/styled @emotion/react @types/react
COPY . .
CMD ["yarn", "start"]
