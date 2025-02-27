import "https://cdn.jsdelivr.net/npm/chart.js"

// generarGraficoMeteorologico metodo que pide por paremetro un elemento canvas y un
// objeto de tipo JSON para pintar un grafico de lineas en el elemento canvas
function generarGraficoMeteorologico(grafico, json) {

    let horas = json.time
    let subHoras = horas.map((hora) => {
        return hora.substring(11)
    })
    
    let temperatura = {
        label: "Temperatura",
        data: json.temperature_2m, 
        borderWidth: 1
    }

    let humedad = {
        label: "Humedad",
        data: json.relative_humidity_2m, 
        borderWidth: 1
    }

    let precipitacion = {
        label: "Precipitacion",
        data: json.precipitation, 
        borderWidth: 1
    }

    let viento = {
        label: "Viento",
        data: json.wind_speed_10m, 
        borderWidth: 1
    }
    
    new Chart(grafico, {
        type: 'line',
        data: {
            labels: subHoras,
            datasets: [
                temperatura,
                humedad,
                precipitacion,
                viento,
            ]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                      min: 0,
                      max: 10,
                      stepSize: 20
                    }
                }
            }
        }
    });
}

export { generarGraficoMeteorologico }