# AgriWeb App - Plataforma Inteligente de Agricultura Local

El proyecto consiste en un pequeño programa Web que le ofrece al usuario opciones de autenticación, utilización de su geolocalización para ofrecer datos meteorológicos sobre su posición, consultar históricos meteorológicos de ciudades y comprobar si una foto captura o inserta es un perro o no.

## Flujo de programa

- El usuario se inicio/registra en el formulario que se le proporciona pudiendo recuperar la contraseña de su correo si asi lo desea.

- Una vez autenticado se le redirige a la panel principal en el cual se le mostra una serie de ventajas:

    - Un mapa interactivo en el que se muestra un marcador indicando la posición del usuario.
    - Datos meteorológicos sobre su ubicación actual.
    - Un grafico meteorológicos donde se muestra el pronostico del transcurso del dia.
    - Consultar históricos meteorológicos de ciudades indicando la fecha de inicio y la fecha de fin.
    - Comprobar si una imagen insertada o captura corresponde a un perro o no.

## API's utilizadas

En este proyecto se utilizaron multiples API's para la construcion del mismo estas API's son las siguientes:

- Firebase: Autenticación de los usuarios.
- Leaflet: Generación de un mapa interactivo a travez de una latitud y longitud.
- Open-Meteo: Obtención de objetos JSON que almacenan datos meteorológicos de un lugar concreto.
- DataTablas: Impresion de tabla a travez de datos masivos.
- Chart: Dibujar graficos.
- TensorFlow: Utilización de modelos de inteligencia artificial ya implementados para la comprobación de imagenes.
- Tailwind: Diseño y estilo al HTML.
