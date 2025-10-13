FROM node:22-alpine

# Instala dependências necessárias
RUN apk add --no-cache git bash docker-cli

WORKDIR /app

COPY ./package*.json ./

RUN npm ci --omit=dev

COPY ./auto-deploy .

EXPOSE 4001

CMD ["node", "./auto-deploy/server.js"]
