FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y gnucobol libcob5 make build-essential curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

WORKDIR /app

COPY . /app

RUN mkdir -p /app/bin

RUN make

EXPOSE 3002

CMD ["node", "server.js"]
