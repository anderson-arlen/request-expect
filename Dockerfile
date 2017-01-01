FROM node:7.0.0-slim

ENV NODE_PATH /app
ENV HOME /app
WORKDIR $HOME

RUN apt-get update && apt-get install build-essential python git -y
RUN npm install --global eslint babel-eslint mocha

COPY ./package.json ./
RUN npm install

COPY . ./

CMD [ "npm", "test" ]
