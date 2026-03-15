COBOL = cobc
FLAGS = -x -free -Icopybooks

SRC = $(wildcard *.cob *.cobol)
BIN = $(basename $(SRC))

all: $(BIN)

%: %.cob
	$(COBOL) $(FLAGS) $< -o $@

%: %.cobol
	$(COBOL) $(FLAGS) $< -o $@

clean:
	rm -f $(BIN)