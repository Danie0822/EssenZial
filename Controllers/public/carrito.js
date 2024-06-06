const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);

const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminar'));
let idDetalle
// Función para obtener el carrito
const obtenerCarrito = async () => {
    try {
        const id_cliente = sessionStorage.getItem("id_cliente");
        const { success, data } = await fetchData(`/public/carrito/${id_cliente}`);

        const tbody = obtenerElemento("tbCarrito");
        tbody.innerHTML = "";
        // Comprobación de status de la respuesta  
        if (success) {
            data.forEach(({ imagen_produc, producto, precio, cantidad, marca, id_detalle_pedido }) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td>
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-1 col-md-12 col-sm-12">
                                <img src="${imagen}${imagen_produc}"
                                    alt="Imagen 1" width="50">
                            </div>
                            <div class="col-lg-3 col-md-12 col-sm-12">
                                <h6>${producto}</h6>
                            </div>
                        </div>
                    </div>
                </td>
                <td><label>$${precio}</label></td>
                <td><label>${cantidad}</label></td>
                <td><label>${marca}</label></td>
                <td>
                    <button type="button" class="btn btn-light" onclick="abrirModalEliminar(${id_detalle_pedido})"><i class="fas fa-trash-alt"></i></button>
                </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            manejarError();
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};

// Función para obtener el producto
const obtenerTotal = async () => {
    try {
        const id_cliente = sessionStorage.getItem("id_cliente");
        const { success, data } = await fetchData(`/public/carrito/campo/${id_cliente}`);
        const recienAgregados = document.getElementById("pago");

        if (success) {
            recienAgregados.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas

            if (data.length > 0) { // Verificar que data no esté vacío
                const { total_pago } = data[0]; // Obtener el primer elemento
                const recienAgregadosCard = `
                    <div class="col-6">
                        <h6>Total</h6>
                        <div></div>
                    </div>
                    <div class="col-6">
                        <label for="" class="precio"> $${total_pago}</label>
                    </div>
                    <a onclick="finalizarPedido()" type="button" class="btn button">
                        <h6>Confirmar pedido</h6>
                    </a>
                `;
                recienAgregados.innerHTML += recienAgregadosCard; // Agregar el contenido HTML
            } else {
                // Proporcionar mensaje de error si data está vacío
            }

        } else {
            manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};

//Funcion para obtener direcciones y poder seleccionarlas posteriormente
const obtenerDirecciones = async (direcciones) => {
    try {
        const id_cliente = sessionStorage.getItem("id_cliente");
        const { success, data } = await fetchData(`/public/carrito/direcciones/${id_cliente}`);
        const selectDirecciones = document.getElementById(direcciones);

        if (success) {
            selectDirecciones.innerHTML = ''; // Limpiar opciones anteriores

            data.forEach(({ id_direccion, nombre_direccion }) => {
                const option = document.createElement('option');
                option.value = id_direccion; // Asignar el id como valor de la opción
                option.text = nombre_direccion; // Asignar el nombre como texto de la opción
                selectDirecciones.appendChild(option);
            });
        } else {
            throw new Error('No se pudieron obtener las direcciones.');
        }
    } catch (error) {
        console.error('Error al obtener las direcciones:', error);
    }
};

const abrirModalEliminar = (id_detalle_pedido) => {
    if (id_detalle_pedido) {
        idDetalle = id_detalle_pedido;
        abrirModal(myEliminar);
    } else {
        manejarError();
    }
};

// Función para eliminar
const eliminarProduc = async (id_detalle_pedido) => {
    try {
        // Llamada de metodo para eliminar 
        const { success } = await deleteData(`/public/carrito/delete/${id_detalle_pedido}`);
        // If para status de la api
        if (success) {
            llamarProcesos();
            cerrarModal(myEliminar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('eliminadoExitosoModal'))), 500);
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
};

// Funcion para obtener las valoraciones
const finalizarPedido = async () => {
    try {
        const id_cliente = sessionStorage.getItem("id_cliente");
        const id_direccion = obtenerElemento("direcciones").value;

        if (!validaciones.noEstaVacio(id_direccion)) {
            mostrarModal("Seleccione una cantidad.");
        }
        else {
            // Form data para json de body 
            var carrito = {
                p_id_cliente: id_cliente,
                p_id_direccion: id_direccion
            };
            const response = await DataAdmin("/public/carrito/update", carrito, 'PUT');
            if (response.status == 200) {
                window.location.href = "pedidos.html";
            } else {
                manejarError();
            }
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};

const llamarProcesos = async () => {
    await obtenerCarrito();
    await obtenerTotal();
    await obtenerDirecciones('direcciones');
}

document.addEventListener("DOMContentLoaded", function () {
    const confirmarEliminarBtn = obtenerElemento('confirmarEliminar');
    confirmarEliminarBtn.addEventListener('click', async () => {
        await eliminarProduc(idDetalle);
    });
    // Inicializar el modal cuando el DOM esté completamente cargado
    llamarProcesos();
});
