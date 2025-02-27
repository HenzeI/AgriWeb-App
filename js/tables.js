import "https://code.jquery.com/jquery-3.7.1.min.js"
import "https://cdn.datatables.net/2.2.2/js/dataTables.js"

import "https://cdn.datatables.net/buttons/3.2.2/js/dataTables.buttons.js"
import "https://cdn.datatables.net/buttons/3.2.2/js/buttons.dataTables.js"
import "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
import "https://cdn.datatables.net/buttons/3.2.2/js/buttons.html5.min.js"

// generarTabla metodo que pide por parametro el elemento de tipo tabla, una ciudad, una fecha inicio y una fecha fin para
// generar un tabla con una con un serie de filas y columnas relacionadas con datos meteorologicos
async function generarTabla(tabla, ciudad, fecha_inicio, fecha_fin) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}&count=1&language=es`);
        const ciudadLatLong = await response.json();

        if (!ciudadLatLong.results || ciudadLatLong.results.length === 0) {
            throw new Error("No se encontraron coordenadas para la ciudad.");
        }

        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${ciudadLatLong.results[0].latitude}&longitude=${ciudadLatLong.results[0].longitude}&start_date=${fecha_inicio}&end_date=${fecha_fin}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;

        const respuesta = await fetch(url);
        const contenido = await respuesta.json();

        if (!contenido.hourly || !contenido.hourly.time) {
            throw new Error("No se encontraron datos meteorológicos.");
        }

        const datosTabla = contenido.hourly.time.map((hora, index) => ({
            time: hora,
            temperature_2m: contenido.hourly.temperature_2m[index],
            relative_humidity_2m: contenido.hourly.relative_humidity_2m[index],
            precipitation: contenido.hourly.precipitation[index],
            wind_speed_10m: contenido.hourly.wind_speed_10m[index]
        }));

        if ($.fn.DataTable.isDataTable(tabla)) {
            $(tabla).DataTable().destroy();
        }

        $(tabla).DataTable({
            data: datosTabla,
            columns: [
                { title: "Hora", data: "time" },
                { title: "Temperatura (°C)", data: "temperature_2m" },
                { title: "Humedad (%)", data: "relative_humidity_2m" },
                { title: "Precipitación (mm)", data: "precipitation" },
                { title: "Viento (km/h)", data: "wind_speed_10m" }
            ],    
            language: {
                url: "https://cdn.datatables.net/plug-ins/2.2.1/i18n/es-ES.json",
            },
            destroy: true,
            responsive: true,
            pageLength: 10,
            layout: {
                bottomStart: {
                    buttons: ['csv', 'excel']
                }
            }
        });

    } catch (error) {
        console.error("Error:", error.message);
    }
}

export { generarTabla }