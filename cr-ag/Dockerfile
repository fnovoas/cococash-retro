FROM node:22

# Instalar runtime de GnuCOBOL (incluye libcob.so.5)
RUN apt-get update && \
    apt-get install -y gnucobol4 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

RUN npm install --ignore-scripts

# Copiar código fuente
COPY . .

# Build de NestJS
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main.js"]
