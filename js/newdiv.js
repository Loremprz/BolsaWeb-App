import { db, auth } from './connection.js'; // Importamos la conexión a Firebase y auth
import { addDoc, collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js"; // Importamos onAuthStateChanged para verificar el estado de autenticación

const colores = ["#B2F977", "#60C435"]; // Orden fijo de colores

// Función para verificar si el usuario está autenticado
function verificarAutenticacion() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Si no está autenticado, redirige al login
            window.location.href = "/view/login.html";
        } else {
            // Si está autenticado, carga los divs
            cargarDivs();
            document.getElementById("agregar").style.display = "inline-block";  // Mostrar botón "Agregar"
        }
    });
}

// Función para crear y mostrar un div con inputs editables
function crearDiv(id, color, nombre_puesto = "", informacion = "", tipo_contratacion = "", educacion = "", ubicacion = "", salario = "") {
    const nuevoDiv = document.createElement("div");
    nuevoDiv.className = "nuevo-div";
    nuevoDiv.style.backgroundColor = color;
    nuevoDiv.dataset.id = id;

    nuevoDiv.innerHTML = `
        <div class="inputs-div"> 
            <input class="puesto-div" type="text" placeholder="Nombre del Puesto" value="${nombre_puesto}" disabled>
            <textarea class="info-div" placeholder="Descripción" disabled>${informacion}</textarea>
            <input class="tipo-contratacion-div" type="text" placeholder="Tipo de Contratación" value="${tipo_contratacion}" disabled>
            <input class="educacion-div" type="text" placeholder="Educación" value="${educacion}" disabled>
            <input class="ubicacion-div" type="text" placeholder="Ubicación" value="${ubicacion}" disabled>
            <input class="salario-div" type="text" placeholder="Salario" value="${salario}" disabled>
        </div>
        <div class="buttons-div"> 
            <button class="editar-div">Editar</button>
            <button class="guardar-div" style="display:none;">Guardar</button>
            <button class="eliminar-div" style="display:none;">Eliminar</button>
        </div>
    `;

    const inputs = nuevoDiv.querySelectorAll("input, textarea");
    const botonEditar = nuevoDiv.querySelector(".editar-div");
    const botonGuardar = nuevoDiv.querySelector(".guardar-div");
    const botonEliminar = nuevoDiv.querySelector(".eliminar-div");

    botonEditar.addEventListener("click", () => {
        const editando = botonEditar.textContent === "Editar";
        inputs.forEach(input => input.disabled = !editando);
        botonEditar.textContent = editando ? "Cancelar" : "Editar";
        botonGuardar.style.display = editando ? "inline-block" : "none";
        botonEliminar.style.display = editando ? "inline-block" : "none"; // Mostrar solo al editar
    });

    botonGuardar.addEventListener("click", async () => {
        try {
            await updateDoc(doc(db, "divs", id), {
                nombre_puesto: inputs[0].value,
                informacion: inputs[1].value,
                tipo_contratacion: inputs[2].value,
                educacion: inputs[3].value,
                ubicacion: inputs[4].value,
                salario: inputs[5].value
            });
            inputs.forEach(input => input.disabled = true);
            botonEditar.textContent = "Editar";
            botonGuardar.style.display = "none";
            botonEliminar.style.display = "none"; // Ocultar al guardar
            console.log("Información guardada correctamente en Firestore");
        } catch (error) {
            console.error("Error al actualizar:", error);
        }
    });

    botonEliminar.addEventListener("click", async () => {
        if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
            try {
                await deleteDoc(doc(db, "divs", id));
                nuevoDiv.remove();
                console.log("Div eliminado correctamente");
            } catch (error) {
                console.error("Error al eliminar el div:", error);
            }
        }
    });

    document.getElementById("contenedor").appendChild(nuevoDiv);
}

// Función para recargar divs y corregir el patrón de colores
async function cargarDivs() {
    try {
        const querySnapshot = await getDocs(query(collection(db, "divs"), orderBy("timestamp")));
        document.getElementById("contenedor").innerHTML = "";

        let index = 0;
        for (const docSnap of querySnapshot.docs) {
            const data = docSnap.data();
            const nuevoColor = colores[index % colores.length];
            crearDiv(docSnap.id, nuevoColor, data.nombre_puesto, data.informacion, data.tipo_contratacion, data.educacion, data.ubicacion, data.salario);
            if (data.color !== nuevoColor) {
                await updateDoc(doc(db, "divs", docSnap.id), { color: nuevoColor });
            }
            index++;
        }
    } catch (error) {
        console.error("Error al cargar los divs desde Firestore:", error.message);
    }
}

// Agregar un nuevo div a Firestore, solo si está autenticado
document.getElementById("agregar").addEventListener("click", function () {
    onAuthStateChanged(auth, async (user) => {  // Haz esta función async
        if (!user) {
            alert("Debes iniciar sesión para agregar nuevos divs.");
            window.location.href = "/view/login.html";
        } else {
            try {
                const querySnapshot = await getDocs(collection(db, "divs"));
                const cantidadDivs = querySnapshot.size;
                const color = colores[cantidadDivs % colores.length];

                await addDoc(collection(db, "divs"), {
                    color,
                    nombre_puesto: "",
                    informacion: "",
                    tipo_contratacion: "",
                    educacion: "",
                    ubicacion: "",
                    salario: "",
                    timestamp: Date.now()
                });

                cargarDivs();
            } catch (error) {
                console.error("Error al guardar el div en Firestore:", error.message);
            }
        }
    });
});


// Verificar autenticación cuando se cargue la página
verificarAutenticacion();
