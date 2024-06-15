

FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./
# COPY package-lock.json ./


RUN yarn install

COPY . .

# RUN npx prisma generate
# RUN npx mikro-orm migration:up

EXPOSE 3001

