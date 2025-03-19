// app.js
import { loginUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    
    // Verifica si el formulario de login existe
    loginForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("inputEmail").value;
        const password = document.getElementById("inputPassword").value;
        
        try {
            await loginUser(email, password);  // Llamada a la función de login en auth.js
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Error al iniciar sesión. Verifica tus credenciales.");
        }
    });
});
