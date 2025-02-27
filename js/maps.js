import "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"

// generarMapGeo metodo que pide por parametro un elemento DIV con id map, una latitud y una longitud
// para dibujar un mapa con la ubicacion pasa por los paramos lat y lon
function generarMapGeo(mapa, lat, lon) {

    const map = L.map(mapa).setView([51.505, -0.09], 13)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map)
    
    map.setView([lat, lon], 15)

    L.marker([lat, lon])
        .addTo(map)
        .bindPopup("📍 Estás aquí")
        .openPopup()
}

// obtenerDatosMeteo metodo que pide por parametro una latitud y una longitud para luego retornar un
// objeto de tipo JSON con datos meteorologicos sobre el lugar
async function obtenerDatosMeteo(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&forecast_days=1`

    try {
        const respuesta = await fetch(url);
        return await respuesta.json();
    } catch (error) {
        throw new Error("Error al obtener los datos meteorologicos" + error.message);
    }
}

// informacionGrafica metodo que pinta sobre el mapa ya generada un rada de precipitaciones
/* Comentario: El metodo no es funcional y no se implenta en ninguna parte de la app.js*/
async function informacionGrafica(mapa, lat, lon) {

    const map = L.map(mapa).setView([51.505, -0.09], 13)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map)
    
    map.setView([lat, lon], 15)

    const url = `https://api.rainviewer.com/public/weather-maps.json`

    try {
        await fetch(url).then(function(response) {
            return response.json();
        })
        .then(function(data) {

            var optionTileSize = 256;
            var colorScheme = 2;
            var smooth = 1;
            var snow = 1;
            var optionExtension = 'webp'

            let pasado = data.host + data.radar.past[12].path + '/' + optionTileSize + '/{z}/{x}/{y}/' + colorScheme + '/' + smooth + '_' + snow + '.' + optionExtension;
            let presente = data.host + data.radar.nowcast[0].path + '/' + optionTileSize + '/{z}/{x}/{y}/' + colorScheme + '/' + smooth + '_' + snow + '.' + optionExtension;

            L.TileLayer(pasado, {
                tileSize: 256,
                opacity: 0.10,
                zIndex: data.radar.past[12].time
            }).addTo(map)

            L.TileLayer(presente, {
                tileSize: 256,
                opacity: 0.10,
                zIndex: data.radar.nowcast[0].time
            }).addTo(map)

        });
    } catch (error) {
        throw new Error("Error al obtener los datos meteorologicos" + error.message);
    }
}

export { generarMapGeo, obtenerDatosMeteo, informacionGrafica }