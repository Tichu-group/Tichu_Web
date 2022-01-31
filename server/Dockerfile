FROM node as base

WORKDIR /home/node/app

COPY package*.json ./

COPY . .

RUN yarn

RUN ["chmod", "+x", "./entrypoint.sh"]

