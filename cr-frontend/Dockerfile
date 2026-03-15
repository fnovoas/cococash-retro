FROM node:22-alpine

WORKDIR /app

# Copiamos solo los archivos de dependencias primero
COPY package.json package-lock.json* ./

RUN npm ci

# Desactivar telemetría
RUN npx next telemetry disable || true

# Frontend expone 3000
EXPOSE 3000
EXPOSE 9229
EXPOSE 9230

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copiar el resto del proyecto
COPY . .

# Hot reload en desarrollo
CMD ["npm", "run", "dev"]
