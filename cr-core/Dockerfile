FROM ubuntu:22.04

# Evitar prompts interactivos
ENV DEBIAN_FRONTEND=noninteractive

# Instalar GnuCOBOL + dependencias
RUN apt-get update && \
    apt-get install -y gnucobol make build-essential && \
    apt-get clean

# Carpeta de trabajo
WORKDIR /app

# Copiar todo el core al contenedor
COPY . /app

# Crear carpeta para binarios si no existe
RUN mkdir -p /app/bin

# Compilar todos los .cob/.cobol si existe Makefile
RUN make

# Exponer binarios al resto de contenedores por volumen
VOLUME ["/app"]

CMD ["bash"]
