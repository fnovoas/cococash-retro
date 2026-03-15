FROM node:22

# instalar runtime de GnuCOBOL
RUN apt-get update && \
    apt-get install -y gnucobol && \
    apt-get clean

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main.js"]

