      *>****************************************************************
      *> Respuesta.cobol                                               *
      *> programa que recibe una cadena del frontend                   *
      *> y la imprime de vuelta                                        *
      *>****************************************************************
       identification division.
       program-id. respuesta.
       date-written. 28-03-2026.

       environment division.
       configuration section.
       source-computer. Ubuntu.
       object-computer. Ubuntu.

       data division.
      
      *>----------------------------------------*
       working-storage section.
      *> Variables
       01 msg-input  pic x(32). *> Mensaje de entrada
       01 msg-output pic x(32). *> Mensaje de salida
       01 error-code pic 9 comp-4.

       procedure division.

       *>***************************************************************
       *> 100 - Procedimiento principal                                *
       *>***************************************************************
       100-principal.
      *> Inicializar variables con valores por defecto (ceros/espacios)
           initialize   msg-output
                        error-code

      *> Los procedimientos llamados por el main en orden
           perform  200-get-msg thru
                    200-end-get-msg

           perform  300-build-response thru
                    300-end-build-response

           perform  400-print-msg thru
                    400-end-print-msg

           perform  999-finalize thru
                    999-end-finalize.
       100-end-principal.

       *>***************************************************************
       *> 200 - Obtener mensaje                                        *
       *>***************************************************************
       200-get-msg.
           accept msg-input from command-line.
       200-end-get-msg.

       *>***************************************************************
       *> 300 - Armar respuesta                                        *
       *>***************************************************************
       300-build-response.                                 
           string "" delimited by size
                  msg-input delimited by space
                  into msg-output.
       300-end-build-response. 

       *>***************************************************************
       *> 400 - Imprimir respuesta                                     *
       *>***************************************************************
       400-print-msg.
           display function trim(msg-output).
       400-end-print-msg.

       *>***************************************************************
       *> 999 - Finalizar                                              *
       *>***************************************************************
       999-finalize.
           stop run.
       999-end-finalize.
