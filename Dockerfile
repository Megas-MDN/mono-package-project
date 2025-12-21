FROM node:24-alpine

WORKDIR /usr/src/app

# Copia arquivos de dependências
COPY package*.json ./

# Instala todas as dependências (necessárias para o build)
RUN npm ci

# Copia o restante do código
COPY . .

# Gera o Prisma Client e executa o build (Frontend para /public e Backend para /dist)
RUN npx prisma generate && npm run build

# Expõe a porta da aplicação
EXPOSE 3001

# Comando para rodar as migrações e iniciar com tsx (como definido no seu package.json)
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]