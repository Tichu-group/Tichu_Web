# Tichu_Web
Create website for playing Tichu

# How to run project

## Dependencies



|name|version| description |
|---|---| --- |
| node | 14.17.3| For running react & server |
| npm | 8.1.3 | optional I guess |
| yarn | 1.22.17 | package manager we use |
| docker | 20.10.7 | Docker |
| docker-compose | 1.29.2 | Docker Compose |


## Client (Web)

```sh
## Go to client directory
cd client
## install packages
yarn
## start react app at localhost:3000
yarn start
```

## Server

```sh
## Go to server directory
cd server
## Run Server on localhost:8000
docker-compose up
```

WIP: will dockerize the server


