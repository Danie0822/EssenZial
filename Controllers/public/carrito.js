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
            data.forEach(({ imagen_produc, producto, precio, cantidad, marca,id_detalle_pedido }) => {
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

// Funcion para obtener el producto
const obtenerTotal = async () => {
    try {
        const id_cliente = sessionStorage.getItem("id_cliente");
        const { success, data } = await fetchData(`/public/carrito/campo/${id_cliente}`);
        const recienAgregados = document.getElementById("pago");


        if (success) {
            recienAgregados.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas

            data.forEach(({ total_pago }) => {
                const recienAgregadosCard = `
                <div class="col-6">
                <h6>Total</h6>
                
                <div>
                <label for="categoriaProducto"
                    class="form-label">Direcciones</label>
                <select class="form-select combobox" id="direcciones"
                    name="categoriaProducto" required>
                </select>
            </div>
            </div>
            <div class="col-6">
                <label for="" class="precio"> $${total_pago}</label>
            </div>
            
            <a href="../../Views/public/confirmacion_pedido.html" type="button" class="btn button" >
                <h6>Confirmar pedido</h6>
            </a>
                `;
                recienAgregados.innerHTML += recienAgregadosCard;
            });

        } else {
            manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};

//Función para obtener los datos para cargar Combobox
const obtenerDirecciones = async (direcciones) => {
    try {
        const id_cliente = sessionStorage.getItem("id_cliente");
        const { success, data } = await fetchData(`/public/carrito/direcciones/${id_cliente}`); // Suponiendo que '/olores' es la ruta para obtener los olores
        const selectDirecciones = document.getElementById(direcciones); // Obtener el elemento select usando el ID proporcionado

        if (success) {
            selectDirecciones.innerHTML = ''; // Limpiar opciones anteriores

            data.forEach(({id_direccion, nombre_direccion }) => {
                const option = document.createElement('option');
                option.value = id_direccion; // Asignar el id como valor de la opción
                option.text = nombre_direccion; // Asignar el nombre como texto de la opción
                selectOlores.appendChild(option);
            });
        } else {
            throw new Error('No se pudieron obtener los olores.');
        }
    } catch (error) {
        console.error('Error al obtener los olores:', error);
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
            obtenerCarrito();
            cerrarModal(myEliminar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('eliminadoExitosoModal'))), 500);
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
};

//Cargando comboBoxes para modal de agregar
async function obtenerCmb() {
    try {
        await obtenerDirecciones("olorProducto");
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

const llamarProcesos = async () => {
    await obtenerCarrito();
    await obtenerTotal();
    
}
document.addEventListener("DOMContentLoaded", function () {
    const confirmarEliminarBtn = obtenerElemento('confirmarEliminar');
    confirmarEliminarBtn.addEventListener('click', async () => {
        await eliminarProduc(idDetalle) ;
    });
    // Inicializar el modal cuando el DOM esté completamente cargado
    llamarProcesos();
});
