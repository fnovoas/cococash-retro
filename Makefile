PROJECT_NAME=cr #CocoCash Retro

# Comando base (compatible con docker compose v2)
DC=docker compose

# Archivos
COMPOSE_FILE=docker-compose.yaml

# =========================
# Comandos principales
# =========================

up:
	@echo "🔼 Levantando servicios..."
	$(DC) -f $(COMPOSE_FILE) up -d --build

down:
	@echo "🔽 Deteniendo servicios..."
	$(DC) -f $(COMPOSE_FILE) down

restart:
	@echo "🔁 Reiniciando servicios..."
	$(DC) -f $(COMPOSE_FILE) down
	$(DC) -f $(COMPOSE_FILE) up -d --build

logs:
	@echo "📜 Mostrando logs..."
	$(DC) -f $(COMPOSE_FILE) logs -f

ps:
	@echo "📊 Estado de contenedores..."
	$(DC) -f $(COMPOSE_FILE) ps

# =========================
# Debug y desarrollo
# =========================

logs-core:
	$(DC) -f $(COMPOSE_FILE) logs -f core

logs-api:
	$(DC) -f $(COMPOSE_FILE) logs -f api-gateway

logs-frontend:
	$(DC) -f $(COMPOSE_FILE) logs -f frontend

exec-core:
	$(DC) -f $(COMPOSE_FILE) exec core sh

exec-api:
	$(DC) -f $(COMPOSE_FILE) exec api-gateway sh

exec-frontend:
	$(DC) -f $(COMPOSE_FILE) exec frontend sh

# =========================
# Limpieza
# =========================

clean:
	@echo "🧹 Eliminando contenedores, redes y volúmenes..."
	$(DC) -f $(COMPOSE_FILE) down -v --remove-orphans

prune:
	@echo "Limpieza profunda (docker system prune)..."
	docker system prune -af

# =========================
# Healthcheck manual
# =========================

health:
	@echo "🩺 Verificando estado de contenedores..."
	$(DC) -f $(COMPOSE_FILE) ps

# =========================
# ⚡ Atajos útiles
# =========================

build:
	@echo "🏗️ Construyendo imágenes..."
	$(DC) -f $(COMPOSE_FILE) build

rebuild: down build up

# Default
.DEFAULT_GOAL := up
