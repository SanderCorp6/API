FROM --platform=amd64 node:alpine
WORKDIR /api

COPY package.json /api/
COPY package-lock.json /api/

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]