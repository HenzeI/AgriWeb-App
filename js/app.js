// Librerias
// FireBase
import { inicioSesion, registrarse, cambiarContrasena } from "./auth.js"
// Leaflet
import { generarMapGeo, obtenerDatosMeteo, informacionGrafica } from "./maps.js"
// DataTables
import { generarTabla } from "./tables.js"
// Chart
import { generarGraficoMeteorologico } from "./chart.js"


document.addEventListener("DOMContentLoaded", inicio)

function inicio() {

    // DOM'S, contenedores DIV que almacenan el contenido dinamico de la pagina web
    // dependiendo de si se llama a uno u a otro estos actuan sobre su propio html
    // indexDOM - index.html / dashboardDOM - dashboard.html
    // En la gran mayoria del codigo se utilizan condiciones de comprobacion para saber
    // si los elementos existen ya que los dos documentos HTML utilizan un unico script (app.js)
    let indexDOM = document.getElementById("index")
    let dashboardDOM = document.getElementById("dashboard")

    // FireBase
    // Obtenemos los elementos correspondientes al formulario para tratarlos
    let campoEmail = document.getElementById("campoEmail")
    let campoContrasena = document.getElementById("campoPassword")

    let formulario = document.getElementById("formulario")
    let registro = document.getElementById("registrarse")
    let cambiarContrasen = document.getElementById("cambiarContrasena")

    let textoAutenticacion = document.createElement("p")

    // Comprobamos si estamos en el DOM correcto y agregamos un elemento de texto
    // que se mostrara si se ha cumplido correctamente con la autenticacion
    if (indexDOM) indexDOM.appendChild(textoAutenticacion)

    if (formulario) {
        // El formulario tiene varios submit que diferenciaremos en este evento
        formulario.addEventListener("submit", async (e) => {

            e.preventDefault();

            let submitBtn = e.submitter // Captamos el boton de tipo submit que han pulsado

            // En funcion del boton submit que se haya pulsado realizamos una accion correspondiente al
            // nombre del boton
            if (submitBtn.name === "iniciarSesion") {
                
                // Comprobamos si esta variable almacena en el localStorage existe, de se asi
                // la eliminamos
                if (localStorage.getItem("usuario")) localStorage.removeItem("usuario")

                try { 
                    textoAutenticacion.textContent = ""
                    // Utilizamos el metodo de inicio de sesion el cual le pasaremos los datos captados en el formulario
                    let usuario = await inicioSesion(campoEmail.value, campoContrasena.value)
                    // Y guardaremos ese usuario iniciado en una variable de localStorage
                    localStorage.setItem("usuario", usuario)
                    // Enviaremos el formulario
                    formulario.submit()
                } catch (error) {
                    console.log(error);
                    textoAutenticacion.setAttribute("class","text-lg text-red-500 text-center mb-4 mt-4")
                    textoAutenticacion.textContent = "El correo electronico indicado no existe"
                }

            } else if (submitBtn.name === "registrarse") {

                try {
                    textoAutenticacion.textContent = ""
                    // Utilizamos el metodo de registro el cual le pasaremos los datos captados en el formulario
                    let usuario = await registrarse(campoEmail.value, campoContrasena.value)
                    // Almacenamos un texto de existo en el elemento de tipo texto autenticacion
                    textoAutenticacion.setAttribute("class","text-lg text-green-500 text-center mb-4 mt-4")
                    textoAutenticacion.textContent = "Te has registrado correctamente"
                    
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    if (cambiarContrasen) {
        // Comprobamos de si se ha realizado la accion de click sobre el cambio de contraseña
        cambiarContrasen.addEventListener("click", async (e) => {

            // Para realizar el cambio comprobaremos de si el campo que almacena el correo es valido y no esta vacio
            if (!campoEmail.checkValidity()) {
                campoEmail.reportValidity()
            } else {
                try {
                    textoAutenticacion.textContent = ""
                    // Obtenemos el correo validado del campo que almacena el correo y utilizamos el metodo
                    // de cambiar contraseña
                    let usuario = await cambiarContrasena(campoEmail.value)
                    // Y mostramos un texto para que el usuario compruebe su bandeja de correos
                    textoAutenticacion.setAttribute("class","text-lg text-gray-700 text-center mb-4 mt-4")
                    textoAutenticacion.textContent = "Te hemos enviado un correo para el cambio de su contraseña"
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    if (dashboardDOM) {
        // Creamos un elemento de texto que almacenara una bienvenida con el nombre del usuario
        let bienvenida = document.createElement("h3")
        let info = document.createElement("p")
        bienvenida.textContent = `Bienvenid@ ${localStorage.getItem("usuario").split("@")[0]}`
        info.textContent = "Con este pequeño proyecto le ofrecemos un mapa con un marcador en el que se muestra su ubicación actual, los datos meteorológicos de su ubicación actual y un gráfico sobre el clima del día, un formulario para realizar una consulta sobre un histórico meteorológico de una ciudad y comprobar de sí una imagen que a captura o ha insertado se corresponde a un perro o no."
        bienvenida.classList.add("text-xl", "font-semibold", "text-gray-700", "mb-4")
        info.classList.add("text-gray-600", "mb-4")
        dashboardDOM.appendChild(bienvenida)
        dashboardDOM.appendChild(info)

        // Leaflet, OpenMeteo y Chart
        // Creamos un DIV con id map que sera el que contendra el mapa de la API Leaflet
        let mapa = document.createElement("div")
        mapa.id = "map"
        mapa.classList.add("h-64", "w-full", "rounded-lg", "shadow")
        dashboardDOM.appendChild(mapa)
    
        // Creamos nuevos elementos de texto que mostraran informacion meteorologica sobre
        // la ubicacion del usuario
        let infoDatosMeteorologicos = document.createElement("h3")
        let textoDatosMeteorologicos = document.createElement("p")
        let textoDatosMeteorologicosInfo = document.createElement("p")
        let meteoBr = document.createElement("hr")
        infoDatosMeteorologicos.textContent = "Datos Meteorologicos de su ubicacion actual y grafico sobre el clima del dia"
        textoDatosMeteorologicosInfo.textContent = "A través de su geolocalización le damos una serie de datos meteorológicos correspondientes a su ubicación además una gráfica en la que podrá visualizar tanto la temperatura como otros pronósticos que tendrá en el transcurso del día."
        infoDatosMeteorologicos.classList.add("text-lg", "font-semibold", "text-gray-800", "mb-3", "mt-5")
        textoDatosMeteorologicos.classList.add("text-gray-600", "mt-2", "mb-5")
        textoDatosMeteorologicosInfo.classList.add("text-gray-600", "mb-4")
        dashboardDOM.appendChild(infoDatosMeteorologicos)
        dashboardDOM.appendChild(textoDatosMeteorologicosInfo)
        dashboardDOM.appendChild(textoDatosMeteorologicos)
        
        // Creamos otro nuevo elemento que mostrara un grafico de lineas sobre el clima del usuario
        let grafico = document.createElement("canvas")
        grafico.setAttribute("height", "100px")
        grafico.classList.add("mt-5", "mb-5")
        dashboardDOM.appendChild(grafico)
        dashboardDOM.appendChild(meteoBr)

        // Comprobamos de si el navegador del usuario soporta la geolocalizacion
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                    
                    // Con la utilizacion del metodo de generacion de mapa a travez de la geolocalizacion
                    // generamos un capa un mapa que mostrara la ubicacion del usuario, a este metodo, le
                    // pasaremos el elemento DIV de id mapa creacion anteriormente, la latiud y la longitud
                    // del usuario  
                    generarMapGeo(mapa, position.coords.latitude, position.coords.longitude)
                    
                    // Obtedremos un objeto de tipo JSON que almacenaremos en una variable gracias a la utilizacion del metodo
                    // de obtencion datos meteorologicos a travez de la latitud y la longitud del usuario
                    let datosMeteorologicos = await obtenerDatosMeteo(position.coords.latitude, position.coords.longitude)
                    
                    let hora = new Date(Date.now()).getHours()

                    // Agremos en el elemento texto creado anteriormente todos los datos relacionados con la temperatura,
                    // humedad, precipitacion y velocidad del viento del lugar
                    textoDatosMeteorologicos.innerHTML = `
                        <b>Temperatura: </b>${datosMeteorologicos.hourly.temperature_2m[hora]}ºC /
                        <b>Humedad: </b>${datosMeteorologicos.hourly.relative_humidity_2m[hora]}% /
                        <b>Precipitación: </b>${datosMeteorologicos.hourly.precipitation[hora]}mm /
                        <b>Viento: </b>${datosMeteorologicos.hourly.wind_speed_10m[hora]}km/h 
                    `
                    // Utilizando el metodo de generacion de graficamos, el pacaremos al mismo el elemento grafico creado
                    // anteriormente junto con el objeto JSON
                    generarGraficoMeteorologico(grafico, datosMeteorologicos.hourly)
                }
            )
        } else {
            alert("Tu navegador no soporta geolocalizacion.")
        }

        // DataTables
        let textoObtenerDatos = document.createElement("h3")
        let textoObtenerDatosInfo = document.createElement("p")
        textoObtenerDatos.textContent = "Consultar histórico de datos sobre una ciudad"
        textoObtenerDatosInfo.textContent = "Rellenado el formulario que se le ofrece recibirá una histórico en forma de tabla en el que podrá visualizar la hora de ese pronóstico, la temperatura, la humedad, el nivel de precipitación y la velocidad del viento."
        textoObtenerDatos.classList.add("text-lg", "font-semibold", "text-gray-800", "mb-3", "mt-5")
        textoObtenerDatosInfo.classList.add("text-gray-600", "mb-4")
        dashboardDOM.appendChild(textoObtenerDatos)
        dashboardDOM.appendChild(textoObtenerDatosInfo)

        // Creamos un elemento de tipo label que dentro contendra un texto y un elemento de tipo
        // input que almacenara la ciudad que el usuario haya escrito
        let labelCampoCiudad = document.createElement("label")
        let campoCiudad = document.createElement("input")
        labelCampoCiudad.classList.add("block", "text-gray-700", "font-medium")
        campoCiudad.classList.add("w-full", "mt-1", "mb-3", "p-2", "border", "rounded-lg", "focus:ring", "focus:ring-blue-400")
        campoCiudad.setAttribute("type", "text")
        campoCiudad.setAttribute("required", "") // Indicamos de que este campo es obligatorio
        labelCampoCiudad.textContent = "Ciudad"
        labelCampoCiudad.appendChild(campoCiudad)

        let hoy = new Date(Date.now()) // Guardamos la fecha de hoy

        let fechaMin = "1940-01-01" // Guardamos la fecha minima que permite OpenMeteo
        // Y la fecha maxima que es el dia actual
        let fechaMax = `${hoy.getFullYear()}-${hoy.getMonth() < 10 ? "0" + hoy.getMonth() : hoy.getMonth()}-${hoy.getDate() < 10 ? "0" + hoy.getDate() : hoy.getDate()}`

        // Creamos un elemento de tipo label que dentro contendra un texto y un elemento de tipo
        // input que almacenara la fecha de inicio
        let labelFechaInicio = document.createElement("label")
        let fechaInicio = document.createElement("input")
        labelFechaInicio.classList.add("block", "text-gray-700", "font-medium")
        fechaInicio.classList.add("w-full", "mt-1", "mb-3", "p-2", "border", "rounded-lg", "focus:ring", "focus:ring-blue-400")
        fechaInicio.setAttribute("type", "date")
        fechaInicio.setAttribute("min", fechaMin) // Indicamos la fecha minima
        fechaInicio.setAttribute("max", fechaMax) // Indicamos la fecha maxima
        labelFechaInicio.textContent = "Fecha Inicio"
        labelFechaInicio.appendChild(fechaInicio)

        // Creamos un elemento de tipo label que dentro contendra un texto y un elemento de tipo
        // input que almacenara la fecha de fin
        let labelFechaFin = document.createElement("label")
        let fechaFin = document.createElement("input")
        labelFechaFin.classList.add("block", "text-gray-700", "font-medium")
        fechaFin.classList.add("w-full", "mt-1", "p-2", "border", "rounded-lg", "focus:ring", "focus:ring-blue-400")
        fechaFin.setAttribute("type", "date")
        fechaFin.setAttribute("min", fechaMin) // Indicamos la fecha minima
        fechaFin.setAttribute("max", fechaMax) // Indicamos la fecha maxima
        labelFechaFin.textContent = "Fecha Fin"
        labelFechaFin.appendChild(fechaFin)

        // Creamos un boton que realizara una serie de acciones mas adelante
        let btnConsultar = document.createElement("button")
        btnConsultar.classList.add("mt-4", "mb-4", "w-full", "md:w-auto", "bg-blue-500", "text-white", "px-4", "py-2", "rounded-lg", "hover:bg-blue-600", "transition")
        btnConsultar.textContent = "Consultar Datos"

        // Agregamos todos los elementos al DOM
        dashboardDOM.appendChild(labelCampoCiudad)
        dashboardDOM.appendChild(labelFechaInicio)
        dashboardDOM.appendChild(labelFechaFin)
        dashboardDOM.appendChild(btnConsultar)

        // Creamos una tabla que la API DataTables manipulara para plasmar una serie de datos
        let tabla = document.createElement("table")
        let tablaBr = document.createElement("hr")
        tabla.innerHTML = `<thead></thead><tbody></tbody>`

        // Comprobamos si se ha realizado el evento click sobre el boton de consultar
        btnConsultar.addEventListener("click", (e) => {
            // Comprobamos si el campo que almacena la ciudad no esta vacio
            if (!campoCiudad.checkValidity()) {
                campoCiudad.reportValidity()
            } else {
                // Comprobamos si la fecha inicio y la fecha fin tiene valores
                if (fechaInicio.value && fechaFin.value) {
                    // Comprobamos si el valor de la fecha inicio es menos que la fecha fin
                    if (new Date(fechaInicio.value) < new Date(fechaFin.value)) {
                        // Y generamos y agregamos filas la tabla utilizando el metodo de generacion de tabla, el cual
                        // le pasamos el elemento tabla creado anteriormente, la ciudad, la fecha inicio y fin selecionada
                        // por el usuario
                        generarTabla(tabla, campoCiudad.value, fechaInicio.value, fechaFin.value)
                    } else {
                        fechaFin.setCustomValidity("Fecha fin no puede ser menor que la fecha inicio")
                        fechaFin.reportValidity()
                    }
                } else {
                    // En el caso de que el usuario no haya rellenado selecionado ninguna fecha ya sea fecha inicio,
                    // fecha fin o ambas se asignaran unas fechas por defecto
                    if (!fechaInicio.value && !fechaFin.value) {
                        generarTabla(tabla, campoCiudad.value, "2025-01-01", fechaMax)
                    } else if (!fechaInicio.value) {
                        generarTabla(tabla, campoCiudad.value, "2025-01-01", fechaFin.value)
                    } else if (!fechaFin.value) {
                        generarTabla(tabla, campoCiudad.value, fechaInicio.value, fechaMax)
                    }
                }
            }
        })
        dashboardDOM.appendChild(tabla)
        dashboardDOM.appendChild(tablaBr)

        // TensorFlow
        let tensorContainer = document.createElement("div")
        tensorContainer.innerHTML = `    
        <h1 class="text-lg font-semibold mb-2 mt-5">¿Es un perro?</h1>
        <p class="text-gray-600 mb-4">Toma o inserta una foto y averigua si es un perro o no.</p>
    
        <div class="flex gap-1">
            <video id="camera" autoplay playsinline class="w-1/2 h-40 border rounded-lg shadow-md"></video>
            <canvas id="snapshot" class="w-1/2 h-40 border rounded-lg shadow-md"></canvas>
        </div>

        <div id="buttonContainer" class="mt-4 flex flex-col space-y-2">
            <button id="capture" class="p-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
                Capturar Foto
            </button>
            
            <button id="insertButton" class="p-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition">
                Insertar Foto
            </button>
            <input type="file" accept="image/*" id="fileInput" class="hidden">
        </div>

        <p id="result" class="mt-4 text-lg font-semibold text-gray-700"></p>`

        dashboardDOM.appendChild(tensorContainer)

        let brCerrarSesion = document.createElement("hr")
        dashboardDOM.appendChild(brCerrarSesion)

        let enlaceCerrarSesion = document.createElement("a")
        enlaceCerrarSesion.textContent = "Cerrar Sesion"
        enlaceCerrarSesion.href = "index.html"

        let btnCerrarSesion = document.createElement("button")
        btnCerrarSesion.classList.add("p-2", "bg-red-400", "text-white", "font-semibold", "rounded-lg", "hover:bg-red-600", "transition")
        btnCerrarSesion.appendChild(enlaceCerrarSesion)

        let divCerrarSesion = document.createElement("div")
        divCerrarSesion.classList.add("mt-4", "flex", "flex-col", "space-y-2")
        divCerrarSesion.appendChild(btnCerrarSesion)

        dashboardDOM.appendChild(divCerrarSesion)

    }
}


