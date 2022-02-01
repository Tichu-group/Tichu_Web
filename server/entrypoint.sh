#!/bin/bash

chmod +x /wait-for-it.sh

/wait-for-it.sh postgres:5432 -t 10

yarn dev