# Este es el Makefile de la estación de debug aislada, que se encarga de generar el código C intermedio y compilar el ejecutable para pruebas
# No hace parte del proceso de compilación principal, es nuestro depurador manual para cuando el .cobol falla
COBOL = cobc

# Flags
FLAGS = -free

# Fuente
SRC = debug.cobol

# Salidas
C_FILE = debug.c
BIN = debug

# Default: generar C (para inspección)
all: $(C_FILE)

# Generar C intermedio
$(C_FILE): $(SRC)
	@echo "Generando C intermedio desde $(SRC)..."
	$(COBOL) -C $(FLAGS) $(SRC)

# Compilar ejecutable CORRECTAMENTE
build: $(SRC)
	@echo "Compilando ejecutable desde $(SRC)..."
	$(COBOL) -x $(FLAGS) $(SRC) -o $(BIN)

# ▶Ejecutar
run: build
	@echo "Ejecutando $(BIN)..."
	./$(BIN)

# Debug completo: C + binario
full: clean $(C_FILE) build

# Limpiar
clean:
	@echo "Limpiando archivos generados..."
	rm -f $(C_FILE) $(BIN) *.h

# Reconstrucción total
rebuild: clean full