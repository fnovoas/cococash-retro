# CocoCash Retro

CocoCash Retro es un sistema de software que simula una billetera digital inspirada en el estilo ochentero de software para mainframes. La arquitectura es de microservicios en contenedores y orquestados con Docker Compose:
- **cr-frontend**: frontend moderno (Next.js).
- **cr-ag**: API Gateway (NestJS).
- **cr-core**: core en COBOL, organizado en módulos y rutinas.

## Tecnologías usadas
* **Ubuntu**: Entorno principal de desarrollo y ejecución del sistema.
* **Docker**: Contenerización de los servicios del sistema.
* **Docker Compose**: Orquestación de los microservicios (frontend, API Gateway y core).
* **COBOL (GnuCOBOL)**: Implementación del core transaccional; programas compilados y ejecutados como binarios.
* **Node.js 22 (nvm)**: Runtime para el frontend (Next.js) y el API Gateway (NestJS).
* **Next.js 16**: Frontend web del sistema, ejecutado en `localhost:3000`, consume REST del API Gateway.
* **NestJS**: API Gateway en `localhost:3001`; expone endpoints REST y ejecuta el core COBOL mediante `execFile()`.
* **TypeScript**: Lenguaje base del frontend y del API Gateway.
* **npm**: Gestor de dependencias para los servicios Node.js.
* **child_process.spawn (Node.js)**: Mecanismo actual de comunicación entre API Gateway y el core COBOL (ejecución de binarios con manejo de stdout/stderr en streaming).

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
Para lograr que el **frontend mostrara el mensaje generado por el core en COBOL**, implementamos una arquitectura de tres capas completamente dockerizada y orquestada con **Docker Compose**. En el contenedor `cr-core`, configuramos la compilación automática de programas COBOL (`hola.cobol`) mediante **GnuCOBOL**, generando binarios ejecutables dentro del directorio `/app/bin` durante el build (usando `make`). Este directorio se comparte con el resto de servicios mediante volúmenes, permitiendo que los binarios estén disponibles en tiempo de ejecución.

En el **API Gateway (NestJS)** desarrollamos un servicio (`CobolService`) encargado de detectar dinámicamente los binarios disponibles, monitorear cambios en el directorio `bin/` y ejecutar los programas COBOL mediante `spawn`. Se añadieron **logs estructurados con `Logger` de NestJS**, lo que permitió diagnosticar errores de forma precisa durante el desarrollo.

En el **frontend (Next.js)** se implementó la llamada al API Gateway utilizando la variable de entorno `NEXT_PUBLIC_API_BASEURL`, apuntando a `http://api-gateway:3001` dentro de la red interna de Docker. De este modo, el frontend puede consumir el endpoint del backend sin depender de configuraciones externas. Cuando la API responde correctamente, el mensaje generado por el programa COBOL se muestra en la interfaz.

## Vista C&C
![Diagrama del sistema](./assets/cr-CC.png)

## Proyectos relacionados
* **CocoCash**: Plataforma de gestión financiera nativa de la nube.
Repositorio disponible en: https://github.com/cococash-swarchqua/cococash/


