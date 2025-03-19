// connection.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCSKI3NveG4UwKNIb-TBvtfOn1VabUoNsM",
    authDomain: "bolsa-de-empleo-243eb.firebaseapp.com",
    projectId: "bolsa-de-empleo-243eb",
    storageBucket: "bolsa-de-empleo-243eb.firebasestorage.app",
    messagingSenderId: "939240631445",
    appId: "1:939240631445:web:8b56894bac09c13d94bf9c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Exportar las instancias de db y auth
export { db, auth };
