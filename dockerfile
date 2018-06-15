FROM node:alpine

RUN mkdir /usr/api

COPY . /usr/api

WORKDIR /usr/api

RUN npm install

ENV DOCKER true

ENTRYPOINT [ "npm", "start" ]