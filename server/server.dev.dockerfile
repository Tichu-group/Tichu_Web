FROM node as base

WORKDIR /usr/app

COPY package*.json ./

COPY . .

RUN yarn

RUN ["chmod", "+x", "./entrypoint.sh"]

