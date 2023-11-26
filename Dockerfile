FROM node:20.9.0-alpine3.18

WORKDIR /var/www

RUN mkdir -p server
RUN chown node:node server
USER node

COPY --chown=node:node ./*.json ./server/

WORKDIR /var/www/server

RUN npm i
RUN npm run build