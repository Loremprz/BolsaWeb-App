// auth.js
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./connection.js";  // La instancia de auth debe venir de connection.js

export async function loginUser(email, password) {
    try {
        // Configura la persistencia para mantener al usuario conectado
        await setPersistence(auth, browserLocalPersistence);
        
        // Inicia sesión con el correo y la contraseña
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log("Usuario autenticado:", user);
        
        // Redirige a la página de manager después del login
        window.location.replace("/view/manager.html");
        
        return user;
    } catch (error) {
        console.error("Error al iniciar sesión:", error.code, error.message);
        throw error;
    }
}

