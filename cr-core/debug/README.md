# Estación de debug (cr-core/debug)
Esta carpeta es una **estación de depuración aislada** para programas COBOL del proyecto.

Su propósito es permitir analizar el comportamiento de un programa `.cobol` **fuera del flujo completo del sistema** (sin Node.js, sin HTTP, sin Docker), enfocándose únicamente en su ejecución dentro del runtime de GnuCOBOL.

Utilícese esta carpeta cuando un programa COBOL:

* Produce resultados inesperados (ej. salida duplicada)
* Se comporta distinto a lo esperado al ejecutarse desde el backend
* Genera errores difíciles de rastrear dentro del sistema completo

Aquí se podrá aislar el problema y determinar si el origen está en:

* El código COBOL
* El runtime de GnuCOBOL
* O la integración con otros servicios


## Cómo usar
1. Copiar el programa a depurar:

```bash
cp ../src/cobol/mi_programa.cobol debug.cobol
```

2. Compilar el programa:

```bash
cobc -x -free debug.cobol
```

3. Ejecutar manualmente:

```bash
./debug <argumentos>
```

Esto permite observar el comportamiento real del programa sin interferencias externas.


## Uso con Makefile
También se puede utilizar el Makefile incluido para simplificar el proceso:

```bash
# Generar código C intermedio
make

# Compilar ejecutable
make build

# Ejecutar programa
make run

# Generar todo (C + binario)
make full

# Limpiar archivos generados
make clean
```

Esto permite:

* Repetir pruebas rápidamente
* Mantener consistencia en la compilación
* Evitar errores al invocar directamente `gcc` (no recomendado en GnuCOBOL)

## Análisis del código intermedio en C
GnuCOBOL no compila directamente a binario: primero traduce el código COBOL a C.

Puedes generar este código intermedio con:

```bash
cobc -C -free debug.cobol
```

Esto crea un archivo `debug.c`.

Revisar este archivo es útil porque permite:

* Ver cómo se traduce cada instrucción COBOL
* Confirmar si una operación (ej. `DISPLAY`) se genera una o múltiples veces
* Detectar si el problema proviene del compilador o del runtime

Si el código C muestra una sola llamada pero la salida se duplica, el problema está en el flujo de ejecución o en el runtime, no en la compilación.  

> El ejecutable final generado por GnuCOBOL incluye un runtime propio (`libcob`), por lo que no es equivalente compilar el C manualmente con `gcc`.

### Nota
* Se usa `STOP RUN` para finalizar programas principales.
* `EXIT PROGRAM` está pensado para subprogramas y puede generar comportamientos inesperados en ejecutables independientes.
* Esta estación permite entender mejor cómo COBOL se ejecuta internamente

## Cómo no compilar en cr-core/ (qué comandos no ejecutar)
Para evitar tener binarios huérfanos (fuera de su carpeta correspondiente).
```bash
cobc -x src/cobol/programa.cobol
```

ni

```bash
cobc -x programa.cobol
```

Si no se usa `-o` se ensucia el directorio actual:

```bash
cobc -x programa.cobol
```

Se genera automáticamente:

```text
./archivo   (en el directorio actual)
```

Nunca hacer esto desde `cr-core`:

```bash
cobc -x src/cobol/programa.cobol
```

ni

```bash
cobc -x programa.cobol
```

## Formas correctas

Usar Makefile

```bash
make
```

O compilar manual pero controlado

```bash
cobc -x src/cobol/programa.cobol -o bin/programa
```
