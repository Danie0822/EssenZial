// Const de optimización 
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);
const manejarExito = () => abrirModal(myExito);
// Const de modals
const myAgregar = new bootstrap.Modal(obtenerElemento('modalCrearReseña'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const validationsModal = new bootstrap.Modal(obtenerElemento('validationsModal'));
const myExito = new bootstrap.Modal(obtenerElemento('agregado'));
let id = null;

const obtener = async () => {
    try {
        const idCliente = sessionStorage.getItem("id_cliente");
        // Llamada de la función de métodos de get 
        const { success, data } = await fetchData(`/public/valoraciones/${idCliente}`);
        const cardsContainer = obtenerElemento("cards-rese");
        cardsContainer.innerHTML = ""; // Limpiar el contenedor de tarjetas
        // Comprobación de estado de la respuesta
        if (success) {
            data.forEach(({ id_detalle_pedido, nombre_producto, id_cliente, primera_imagen }) => {
                const card = document.createElement("div");
                card.className = "card";
                card.style.width = "18rem";
                card.innerHTML = `
                    <img src="${imagen}${primera_imagen}" class="card-img-top" alt="${nombre_producto}">
                    <div class="card-body">
                        <h6 class="card-text" style="color: black;">${nombre_producto}</h6>
                        <button type="button" class="btn btn-create" onclick="abrirModalCrearReseña(${id_detalle_pedido})"> Crear reseña</button>
                    </div>
                `;
                cardsContainer.appendChild(card);
            });
        } else {
            manejarError();
        }
    } catch (error) {
        console.log(error);
        manejarError();
    }
};

const abrirModalCrearReseña = (idDetalle) => {
    if (idDetalle) {
        abrirModal(myAgregar);
        id = idDetalle;
    } else {
        manejarError();
    }
};

const limpiarModal = () => {
    // Limpiar el campo de comentario
    obtenerElemento("comment").value = "";

    // Desmarcar todas las estrellas
    const estrellas = document.querySelectorAll('input[name="rating"]');
    estrellas.forEach(estrella => {
        estrella.checked = false;
    });
};

// Función para Agregar cliente 
const Agregar = async () => {
    try {
        // Const de variables de modals 
        const nombre = obtenerElemento("comment").value;
        const puntaje = document.querySelector('input[name="rating"]:checked');
        // If para validaciones
        if (!validaciones.contieneSoloLetrasYNumeros(nombre)) {
            mostrarModal("El nombre solo puede contener letras y números.");
        }
        else if (!puntaje) {
            mostrarModal("Por favor, seleccione una calificación para el producto.");
        }
        else {
            // Form data para json de body 
            var adminData = {
                calificacion_producto: puntaje.value,
                comentario_producto: nombre,
                estado_comentario: true,
                id_detalle_pedido: id
            };
            console.log(adminData);
            const response = await DataAdmin("/public/valoraciones/save", adminData, 'POST');
            // Status de la api 
            if (response.status == 200) {
                limpiarModal();
                await cerrarModal(myAgregar);
                manejarExito();
                id = null;
            } else {
                manejarError();
            }
        }
    } catch (error) {
        manejarError();
    }
};


function mostrarModal(mensaje) {
    $('#validationsModal .modal-body p').text(mensaje);
    $('#validationsModal').modal('show');
};

document.addEventListener("DOMContentLoaded", function () {
    // Obtener cuando recarga pagina 
    obtener();

    const agregarBtn = obtenerElemento('agregarReseñas');
    agregarBtn.addEventListener('click', async () => {
        // Validacion del id
        if (id) {
            await Agregar(id);
        }
    });
});