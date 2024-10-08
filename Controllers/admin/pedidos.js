const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);
// Const de modals
const myActualizar = new bootstrap.Modal(obtenerElemento('Actualizar'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminar'));
const myInfo = new bootstrap.Modal(obtenerElemento('detallesModal'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
let id = null;
let estadoPedidosCambio = null;

const obtenerPedidos = async () => {
    try {
        const { success, data } = await fetchData("/pedidos");
        const tbody = obtenerElemento("tablaBody");
        tbody.innerHTML = "";

        if (success) {
            data.forEach(({ id_pedido, fecha_pedido, estado_pedido, tipo_pago }) => {
                // Formatear la fecha
                const fechaFormateada = new Date(fecha_pedido).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
                const formaPago = tipo_pago === 1 ? 'Efectivo' : 'Tarjeta';
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${estado_pedido}</td> 
                    <td>${fechaFormateada}</td> 
                    <td>${formaPago}</td> 
                    <td class="text-center">
                        <button type="button" class="btn btn-dark" onclick="abrirModalEditar(${id_pedido},'${estado_pedido}')"><i class="fas fa-edit"></i></button>
                        <button type="button" class="btn btn-dark" onclick="abrirModalEliminar(${id_pedido})"><i class="fas fa-trash-alt"></i></button>
                        <button type="button" class="btn btn-dark" onclick="obtenerPedidosString(${id_pedido},'${fechaFormateada}','${formaPago}')"><i class="fas fa-info-circle"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
};

const obtenerReporte = async () => {
    try {
        const blobResponse = await fetchPdfAndBlob("/pedidos/reporte/view/", token);
        if (!blobResponse.ok) {
            throw new Error('Error al descargar el reporte PDF');
        }
        const blob = await blobResponse.blob();
        descargarArchivo(blob, 'reporte_pedidos.pdf');
    } catch (error) {
        console.error('Error al obtener el reporte:', error);
        manejarError();
    }
};


// Obtener pedidos  String 
const obtenerPedidosString = async (id, fecha_pedido, tipo_pago) => {
    try {
        const { success, data } = await fetchData(`/pedidos/detalle/${id}`);
        console.log(data)
        if (success) {
            data.forEach(({ id_correlativo, nombre_cliente, perfume, total_precio, imagen }) => {
                abrirModalDetalles(nombre_cliente, fecha_pedido, tipo_pago, perfume, total_precio,imagen)
            });

        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
};



// Const para pasar cosas que se necesita para actualizar en el modal 
const abrirModalEditar = (id_pedido, estado_pedido) => {
    if (id_pedido) {
        abrirModal(myActualizar);
        id = id_pedido;
        if (estado_pedido == 'Finalizado') {
            estadoPedidosCambio = 'En proceso';
        }
        else {
            estadoPedidosCambio = 'Finalizado';
        }

    } else {
        manejarError();
    }
};
// Const para pasar cosas que se necesita para eleminar en el modal 
const abrirModalEliminar = (idUnico) => {
    if (idUnico) {
        const idAdminG = sessionStorage.getItem("id_pedido");
        if (idUnico == idAdminG) {
            manejarValidaciones();
        } else {
            id = idUnico;
            abrirModal(myEliminar);
        }
    } else {
        manejarError();
    }
};

// Función para actualizar
const actualizar = async (id, estado) => {
    try {
        // formato json 
        var pedidosUpdate = {
            id_pedido: id,
            estado_pedido: estado
        };
        const success = await DataAdmin("/pedidos/update", pedidosUpdate, 'PUT');
        // Status de la repuesta de la api
        if (success.status == 200) {
            obtenerPedidos();
            cerrarModal(myActualizar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('acto'))), 500);
        } else {
            manejarError();
        }

    } catch (error) {
        manejarError();
    }
};
// Const para limpiar formulario 
const limpiarFormulario = () => {
    obtenerElemento("nombreCliente").textContent = "";
    obtenerElemento("fechaPedido").textContent = "";
    obtenerElemento("tipoPago").textContent = "";
    obtenerElemento("perfume").textContent = "";
    obtenerElemento("totalPago").textContent = "";
}

const abrirModalDetalles = (nombre_cliente, fecha_pedido, tipo_pago, perfume, total_precio,imagenPedido) => {
    const imagens = `http://localhost:4000/${imagenPedido}`; 
    console.log(imagens); 
    mostrar(nombre_cliente, fecha_pedido, tipo_pago, perfume, total_precio,imagens);
    abrirModal(myInfo);
};

// Función para eliminar 
const eliminarPedido = async (id) => {
    try {
        // Llamada de metodo para eliminar 
        const { success } = await deleteData(`/pedidos/delete/${id}`);
        // If para status de la api
        if (success) {
            obtenerPedidos();
            cerrarModal(myEliminar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('acto'))), 500);
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
};


document.addEventListener("DOMContentLoaded", function () {

    obtenerPedidos();

    // Variable de actualizar
    const confirmarActualizarBtn = obtenerElemento('confirmarActualizar');
    confirmarActualizarBtn.addEventListener('click', async () => {
        // Validacion del id
        if (id !== null && estadoPedidosCambio !== null) {
            await actualizar(id, estadoPedidosCambio);
            id = null;
            estadoPedidosCambio = null;
        }
    });
    // Variable de Eliminar
    const confirmarEliminarBtn = obtenerElemento('confirmarEliminar');
    confirmarEliminarBtn.addEventListener('click', async () => {
        // Validacion del id
        if (id) {
            await eliminarPedido(id);
            id = null;
        }
    });
});
// Const de llenar el modal de actualizar con los valores 
const mostrar = (nombre_cliente, fecha_pedido, tipo_pago, perfume, total_precio,imagenCategoria) => {
    try {
        limpiarFormulario(); // Limpia los campos antes de llenarlos
        obtenerElemento("nombreCliente").textContent = nombre_cliente;
        obtenerElemento("fechaPedido").textContent = fecha_pedido;
        obtenerElemento("tipoPago").textContent = tipo_pago;
        obtenerElemento("perfume").textContent = perfume;
        obtenerElemento("totalPago").textContent = total_precio;
        const imagenPreview = document.querySelector('.imagede');
        if (imagenPreview) {
            const urlImagen = imagenCategoria;
            imagenPreview.src = urlImagen;
            imagenPreview.style.display = 'block';
        }
        
    } catch (error) {
        manejarError();
    }
}