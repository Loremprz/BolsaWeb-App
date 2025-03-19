// mostrarDivs.js
import { db } from './connection.js'; // Asegúrate de tener la conexión configurada
import { getDocs, collection, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Función para mostrar los divs solo con los datos, permitiendo desplegar información al hacer clic
function mostrarDivs(id, color, nombre_puesto = "", informacion = "", tipo_contratacion = "", educacion = "", ubicacion = "", salario = "") {
    const mostrarDiv = document.createElement("div");
    mostrarDiv.className = "mostrar-div";
    mostrarDiv.style.backgroundColor = color;
    mostrarDiv.dataset.id = id; // Guardamos el ID del Firestore

    mostrarDiv.innerHTML = `
        <div class="mostrar-inputs-div"> 
            <div class="puesto-container">
                <p class="puesto-div">${nombre_puesto}</p>
            </div>
            <div class="detalle-info">
                <div>
                    <p class="inputs-divs-per">Descripción</p>
                    <p class="info-div">${informacion}</p>
                </div>
                <div>
                    <p class="inputs-divs-per">Tipo de contratación</p>
                    <p class="tipo-contratacion-div">${tipo_contratacion}</p>
                </div>
                <div>
                    <p class="inputs-divs-per">Educación</p>
                    <p class="educacion-div">${educacion}</p>
                </div>
                <div>
                    <p class="inputs-divs-per">Ubicación</p>
                    <p class="ubicacion-div">${ubicacion}</p>
                </div>
                <div>
                    <p class="inputs-divs-per">Salario</p>
                    <p class="salario-div">${salario}</p>
                </div>
            </div>
        </div>
    `;

    const puestoDiv = mostrarDiv.querySelector(".puesto-div");
    const detalleInfo = mostrarDiv.querySelector(".detalle-info");

    // Evento para desplegar con animación
    puestoDiv.addEventListener("click", () => {
        detalleInfo.classList.toggle("activo");
    });

    document.getElementById("cards-information").appendChild(mostrarDiv);
}

// Función para cargar los divs desde Firestore y mostrar solo los datos
async function cargarDivs() {
    try {
        const querySnapshot = await getDocs(query(collection(db, "divs"), orderBy("timestamp")));
        document.getElementById("cards-information").innerHTML = ""; // limpiar el contenedor antes de cargar los nuevos datos

        let index = 0;
        for (const docSnap of querySnapshot.docs) {
            const data = docSnap.data();
            const nuevoColor = index % 2 === 0 ? "#B2F977" : "#60C435";

            // Llamamos a la función para mostrar los datos
            mostrarDivs(docSnap.id, nuevoColor, data.nombre_puesto, data.informacion, data.tipo_contratacion, data.educacion, data.ubicacion, data.salario);
            index++;
        }
    } catch (error) {
        console.error("Error al cargar los divs desde Firestore:", error.message);
    }
}

// Llamar a la función para cargar los divs al cargar la página
cargarDivs();
