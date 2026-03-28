# CocoCash Retro

CocoCash Retro es un sistema de software que simula una billetera digital inspirada en el estilo ochentero de software para mainframes. La arquitectura es de microservicios en contenedores y orquestados con Docker Compose:
- **cr-frontend**: frontend moderno (Next.js).
- **cr-ag**: API Gateway (NestJS).
- **cr-core**: core en COBOL, organizado en módulos y rutinas.

## Tecnologías usadas
* **Ubuntu**: Entorno principal de desarrollo y ejecución del sistema.
* **Docker**: Contenerización de los servicios del sistema.
* **Docker Compose**: Orquestación de los microservicios (frontend, API Gateway y core).
* **GnuCOBOL**: Implementación del core transaccional; programas organizados en `src/cobol/`, compilados con `make` y ejecutados como binarios dentro del microservicio core.
* **libcob5**: Runtime necesario para la ejecución de binarios COBOL generados con GnuCOBOL.
* **Node.js 22**: Runtime utilizado en todos los servicios Node.js (frontend, API Gateway y servidor HTTP del core).
* **Next.js 16**: Frontend web del sistema, ejecutado en `localhost:3000`, consume REST del API Gateway.
* **NestJS**: API Gateway en `localhost:3001`; expone endpoints REST y orquesta la comunicación con el core mediante HTTP.
* **HTTP (REST interno)**: Mecanismo de comunicación entre API Gateway y core (`http://core:3002`).
* **TypeScript**: Lenguaje base del frontend y del API Gateway.
* **npm**: Gestor de dependencias para los servicios Node.js.
* **child_process.spawn (Node.js)**: Utilizado exclusivamente dentro del microservicio core para ejecutar los binarios COBOL.

## Cómo ejecutar
1. Levantar todo el entorno (build + ejecución de contenedores):

```
make
```

2. Ver logs en tiempo real (opcional pero recomendado la primera vez):

```
make logs
```

3. Abrir el navegador y acceder al frontend:

```
http://localhost:3000
```


## Cómo se logró
Para lograr que el **frontend mostrara el mensaje generado por el core en COBOL**, usamos una arquitectura de microservicios desacoplada, dockerizada y orquestada con **Docker Compose**.

En el contenedor `cr-core`, organizamos los programas COBOL dentro de `src/cobol/` y configuramos su compilación automática mediante **GnuCOBOL** y `make`, generando binarios en `/app/bin`. Además, incorporamos un servidor HTTP ligero en Node.js que expone endpoints como `/run/:program` y `/programs`. Este servidor es responsable de ejecutar los programas COBOL mediante `spawn`, capturar su salida (stdout/stderr) y devolverla como respuesta HTTP. También se resolvieron dependencias de runtime instalando `libcob5`, necesario para ejecutar los binarios. Entonces dentro del core: HTTP request → spawn → binario COBOL → stdout → HTTP response.

En el **API Gateway (NestJS)** se hacen llamadas HTTP hacia el core. El servicio `CobolService` actúa como cliente del microservicio core, delegando completamente la ejecución de programas. No se usan volúmenes compartidos para ejecutar binarios.

En el **frontend (Next.js)** se mantiene la llamada al API Gateway utilizando la variable de entorno `NEXT_PUBLIC_API_BASEURL`, apuntando a `http://api-gateway:3001` dentro de la red interna de Docker. El flujo completo queda así: el frontend solicita al API Gateway, este orquesta la petición hacia el core, y el core ejecuta el programa COBOL devolviendo el resultado.

## Vista C&C
![Diagrama del sistema](./assets/cr-CC.png)

## Proyectos relacionados
* **CocoCash**: Plataforma de gestión financiera nativa de la nube.
Repositorio disponible en: https://github.com/cococash-swarchqua/cococash/


