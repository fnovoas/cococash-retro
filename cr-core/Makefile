COBOL = cobc
FLAGS = -x -free -Icopybooks

SRC = $(wildcard src/cobol/*.cob src/cobol/*.cobol)
BIN_DIR = bin

# Generar nombres de binarios sin la ruta src/cobol/
BIN = $(patsubst src/cobol/%.cob,$(BIN_DIR)/%,$(filter %.cob,$(notdir $(SRC)))) \
      $(patsubst src/cobol/%.cobol,$(BIN_DIR)/%,$(filter %.cobol,$(notdir $(SRC))))

# Alternativa más robusta
BIN = $(patsubst src/cobol/%.cob,$(BIN_DIR)/%,$(filter src/cobol/%.cob,$(SRC))) \
      $(patsubst src/cobol/%.cobol,$(BIN_DIR)/%,$(filter src/cobol/%.cobol,$(SRC)))

all: $(BIN)

$(BIN_DIR):
	mkdir -p $(BIN_DIR)

# Regla para .cob
$(BIN_DIR)/%: src/cobol/%.cob | $(BIN_DIR)
	@echo "Compilando $<..."
	$(COBOL) $(FLAGS) $< -o $@

# Regla para .cobol
$(BIN_DIR)/%: src/cobol/%.cobol | $(BIN_DIR)
	@echo "Compilando $<..."
	$(COBOL) $(FLAGS) $< -o $@

clean:
	rm -rf $(BIN_DIR)

rebuild: clean all