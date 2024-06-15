
FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["sh", "-c", "npm run mikro-orm:schema:update && yarn dev"]
