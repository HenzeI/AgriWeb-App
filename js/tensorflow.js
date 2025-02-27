document.addEventListener("DOMContentLoaded", tensorFlow)

function tensorFlow() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('snapshot');
    const result = document.getElementById('result');
    const captureButton = document.getElementById('capture');

    const fileInput = document.getElementById('fileInput');
    const insertButton = document.getElementById('insertButton');

    const ctx = canvas.getContext('2d');
    
    let streamCamara
    let posiCamara = 'environment' 

    async function setupCamera() {
        // Solicitar acceso a la cámara
        streamCamara = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = streamCamara;
    }
    
    async function loadModelAndPredict(image) {
        result.textContent = 'Cargando modelo...';
        // Cargar MobileNet
        const model = await mobilenet.load();
    
        // Realizar predicción
        const predictions = await model.classify(image);
    
        // Buscar si "perro" está en la clasificación
        const isDog = predictions.some(pred => pred.className.toLowerCase().includes('dog'));
    
        if (isDog) {
            result.textContent = '¡Es un perro! 🐶';
        } else {
            result.textContent = 'No es un perro. 🚫';
        }
    }
    
    captureButton.addEventListener('click', () => {
        // Ajustar el tamaño del canvas al tamaño del video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        // Dibujar la imagen capturada en el canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        // Usar el canvas como entrada para el modelo
        loadModelAndPredict(canvas);
    });
    
    // Compruba si se accede desde un movil
    let movil = {
        Android: function() {
            return navigator.userAgent.match(/Android/i) ? true : false;
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
        },
        any: function() {
            return (movil.Android() || movil.iOS());
        }
    };
    
    if (movil.any()) {
        
        let cambiarCamara = document.createElement("button")
        cambiarCamara.classList.add("p-2", "bg-gray-500", "text-white", "font-semibold", "rounded-lg", "hover:bg-gray-600", "transition")
        
        // Cambiamos el texto del boton que cambia el posicion de la camara
        if (posiCamara == 'environment')
            cambiarCamara.textContent = "Camara Frontal"
        else 
            cambiarCamara.textContent = "Camara Trasera"
        
        document.getElementById("buttonContainer").appendChild(cambiarCamara)

        // environment - camara trasera / user - camara frontal
        cambiarCamara.addEventListener("click", (e) => {
            // Comprobamos si ya existe un hilo de ejecucion de la camara, de ser asi, lo paramos
            if(streamCamara) {
                streamCamara.getTracks().forEach(track => track.stop())              
            }

            // Obtenemos la camara y le asignamos la vista, por defecto va a ser la vista trasera
            // pero cambia cuando se pulsa el boton de cambiar la vista de la camara
            navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { exact: `${posiCamara}`}
                }
            }).then(function(stream) {
                streamCamara = stream;
                video.srcObject = streamCamara;
            }).catch(function(error) {
                alert("Error con la camara: " + error);
            })

            // Cuando la vista de la camara esta siendo ejecutada por la vista trasera, la variable
            // que guarda la vista delante y viseversa
            if (posiCamara == 'environment')
                posiCamara = 'user'
            else
                posiCamara = 'environment'
        })
    }
    

    insertButton.addEventListener("click", () => {
        fileInput.click();
    })

    // Obtenemos el archivo insertado por el usuario y lo convertimos en un objeto Image
    fileInput.addEventListener("change", (e) => {
        if (fileInput.files[0].type.includes("image/")) {
            
            let file = fileInput.files[0]
            let reader = new FileReader()
            reader.onload = function(event) {
                let img = new Image()
                img.src = event.target.result
                img.onload = function() {
                    canvas.width = img.width
                    canvas.height = img.height
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
            }
            reader.readAsDataURL(file)
            loadModelAndPredict(canvas)

        } else {
            console.log("Imagen invalida");
        }
    })

    // Comprobamos si el dispositivo tiene camara
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const hasCamera = devices.some(device => device.kind === "videoinput");
                if (hasCamera)
                    setupCamera(); // Inicializar la camara al cargar la página 
  })
}

export { tensorFlow }