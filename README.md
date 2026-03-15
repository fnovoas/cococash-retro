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
* **Node.js 20 (nvm)**: Runtime para el frontend (Next.js) y el API Gateway (NestJS).
* **Next.js 16**: Frontend web del sistema, ejecutado en `localhost:3000`, consume REST del API Gateway.
* **NestJS**: API Gateway en `localhost:3001`; expone endpoints REST y ejecuta el core COBOL mediante `execFile()`.
* **TypeScript**: Lenguaje base del frontend y del API Gateway.
* **npm**: Gestor de dependencias para los servicios Node.js.
* **execFile (Node.js)**: Mecanismo actual de comunicación entre API Gateway y el core COBOL (invocación de binarios).

## Cómo ejecutar
1. Construir las imágenes del proyecto:

```
docker compose build
```

2. Levantar los servicios:

```
docker compose up
```

3. Abrir el navegador y acceder al frontend en:

```
http://localhost:3000
```

## Cómo se logró
Para lograr que el **frontend mostrara el mensaje generado por el core en COBOL**, configuramos una arquitectura de tres capas coordinadas con **Docker Compose**. Primero compilamos el programa `hola.cobol` con **GnuCOBOL** dentro del contenedor `cr-core`, generando un binario ejecutable. Luego implementamos en el **API Gateway (NestJS)** un endpoint `GET /` que ejecuta ese binario mediante `execFile()` y devuelve su salida estándar como respuesta HTTP; para que esto funcionara correctamente instalamos también el **runtime de GnuCOBOL** en el contenedor del gateway, ya que el ejecutable depende de la librería `libcob`. Finalmente, en el **frontend (Next.js)** realizamos una petición al API Gateway usando la variable de entorno `NEXT_PUBLIC_API_BASEURL` apuntando a `http://api-gateway:3001`, lo que permite la comunicación entre contenedores dentro de la red de Docker. El flujo es **Next.js → NestJS → binario COBOL**; el mensaje producido por el programa COBOL se recupera vía API y se muestra en la interfaz web.

## Vista C&C
![Diagrama del sistema](./assets/cr-CC.png)

## Proyectos relacionados
* **CocoCash**: Plataforma de gestión financiera nativa de la nube.
Repositorio disponible en: https://github.com/cococash-swarchqua/cococash/

