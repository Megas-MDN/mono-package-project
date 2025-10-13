FROM node:22-alpine

# Instala dependências necessárias incluindo Docker Compose V2
RUN apk add --no-cache git bash docker-cli docker-compose

WORKDIR /app

COPY ./package*.json ./

RUN npm ci --omit=dev

COPY ./auto-deploy .

EXPOSE 4001

CMD ["node", "./auto-deploy/server.js"]