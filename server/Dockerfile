FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
