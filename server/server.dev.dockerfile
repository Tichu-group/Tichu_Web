FROM node as base

WORKDIR /usr/app

COPY package*.json ./

COPY . .

RUN yarn

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /

RUN ["chmod", "+x", "./entrypoint.sh"]

