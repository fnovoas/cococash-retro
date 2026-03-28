COBOL = cobc
FLAGS = -x -free -Icopybooks

SRC = $(wildcard *.cob *.cobol)
BIN_DIR = bin

BIN = $(patsubst %.cob,$(BIN_DIR)/%,$(filter %.cob,$(SRC))) \
      $(patsubst %.cobol,$(BIN_DIR)/%,$(filter %.cobol,$(SRC)))

all: $(BIN)

$(BIN_DIR):
	mkdir -p $(BIN_DIR)

# Reglas unificadas
$(BIN_DIR)/%: %.cob | $(BIN_DIR)
	@echo "Compilando $<..."
	$(COBOL) $(FLAGS) $< -o $@

$(BIN_DIR)/%: %.cobol | $(BIN_DIR)
	@echo "Compilando $<..."
	$(COBOL) $(FLAGS) $< -o $@

clean:
	rm -rf $(BIN_DIR)

rebuild: clean all