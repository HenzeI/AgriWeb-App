import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail  } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDt6TK7jlYU84cbugZZTbHlAz34_oUIx80",
    authDomain: "authagricola.firebaseapp.com",
    projectId: "authagricola",
    storageBucket: "authagricola.firebasestorage.app",
    messagingSenderId: "930441865799",
    appId: "1:930441865799:web:c75cbc2365ce9fdff81f62",
    measurementId: "G-XBNR4HX29Z"
};

// Metodo simple que inicializa el proyecto de Firebase
function inicializarApp() {
    // Inicializamos Firebase
    const app = initializeApp(firebaseConfig)
    window.auth = getAuth(app)
}

// Metodos de Autenticacion
// inicioSesion metodo que permite al usuario iniciar sesion a travez de su correo y contrasena
async function inicioSesion(email, password) {

    inicializarApp()

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        return userCredential.user.email
    } catch (error) {
        throw new Error("Error al iniciar sesion: " + error.message)
    }
}

// registrarse metodo que permite al usuario registrare a travez de su correo y contrasena
async function registrarse(email, password) {
    
    inicializarApp()

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        return userCredential.user.email
    } catch (error) {
        throw new Error("Error al registrarse: " + error.message)
    }
}

// cambiarContrasena metodo que permite al usuario cambiar su contrasena mediante un correo electronico
 async function cambiarContrasena(email) {
    
    inicializarApp()

    try {
        await sendPasswordResetEmail(auth, email)
        return true
    } catch (error) {
        throw new Error("Error al cambiar la contrasena: " + error.message)
    }
}

export { inicioSesion, registrarse, cambiarContrasena }