// Const de optimización 
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);
// Const de modals
const myActualizar = new bootstrap.Modal(obtenerElemento('actualizar'));
const myInfo = new bootstrap.Modal(obtenerElemento('detallesModal'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
let id = null;
let estadoClienteCambio = null;

// Función de Obtener 
const obtener = async () => {
    try {
        // Llamada de la funcion de metodos de get 
        const { success, data } = await fetchData("/cliente");
        const tbody = obtenerElemento("tablaBody");
        tbody.innerHTML = "";
        // Comprobación de status de la respuesta
        if (success) {
            data.forEach(({ id_cliente, nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, estado_cliente }) => {
                const tr = document.createElement("tr");
                const estadoTexto = estado_cliente === 1 ? 'Activo' : 'Inactivo';
                tr.innerHTML = `
                    <td>${nombre_cliente}</td>
                    <td>${estadoTexto}</td>
                    <td>
                        <button class="btn btn-dark actualizar" onclick="abrirModalEditar(${id_cliente}, '${estado_cliente}')"><i class="fas fa-edit"></i></button>  
                        <button class="btn btn-dark eliminar" onclick="abrirModalDetalles('${nombre_cliente}', '${apellido_cliente}', '${correo_cliente}', '${telefono_cliente}', '${estadoTexto}')"><i class="fas fa-info-circle"></i></button>
                     
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            manejarError();
        }
    } catch (error) {
        console.log(error);
        manejarError();
    }
};

const obtenerReporte = async () => {
    try {
        const blobResponse = await fetchPdfAndBlob("/cliente/reporte/view/", token);
        if (!blobResponse.ok) {
            throw new Error('Error al descargar el reporte PDF');
        }
        const blob = await blobResponse.blob();
        descargarArchivo(blob, 'reporte_clientes.pdf');
    } catch (error) {
        console.error('Error al obtener el reporte:', error);
        manejarError();
    }
};


// Const para limpiar formulario 
const limpiarFormulario = () => {
    obtenerElemento("nombreCliente").textContent = "";
    obtenerElemento("apellidoCliente").textContent = "";
    obtenerElemento("telefonoCliente").textContent = "";
    obtenerElemento("correoCliente").textContent = "";
    obtenerElemento("estadoCliente").textContent = "";
}

// Const para pasar cosas que se necesita para actualizar en el modal 
const abrirModalEditar = (idUnico, estados) => {
    if (idUnico) {
        abrirModal(myActualizar);
        id = idUnico;
        if (estados == 1) {
            estadoClienteCambio = false;
        }
        else {
            estadoClienteCambio = true;
        }

    } else {
        manejarError();
    }
};
// Función para abrir agregar 
function AbrirAgregar() {
    limpiarFormulario();
    abrirModal(myAgregar);
}
// Const para pasar cosas que se necesita para eleminar en el modal 
const abrirModalDetalles = (nombre, apellido, correo, telefono, estado) => {
    mostrar(nombre, apellido, correo, telefono, estado);
    abrirModal(myInfo);
};

// Función para actualizar
const actualizar = async (id, estado) => {
    try {
        // formato json 
        var clientedata = {
            id_cliente: id,
            estado_cliente: estado
        };
        const success = await DataAdmin("/cliente/update", clientedata, 'PUT');
        // Status de la repuesta de la api
        if (success.status == 200) {
            obtener();
            cerrarModal(myActualizar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('acto'))), 500);
        } else {
            manejarError();
        }

    } catch (error) {
        console.log(error);
        manejarError();
    }
};
// Dom del html 
document.addEventListener("DOMContentLoaded", function () {
    // Obtener cuando recarga pagina
    obtener();
    // Variable de actualizar
    const confirmarActualizarBtn = obtenerElemento('confirmarActualizar');
    confirmarActualizarBtn.addEventListener('click', async () => {
        // Validacion del id
        if (id !== null && estadoClienteCambio !== null) {
            await actualizar(id, estadoClienteCambio);
            id = null;
            estadoClienteCambio = null;
        }
    });
});
// Const de llenar el modal de actualizar con los valores 
const mostrar = (nombre, apellido, correo, telefono, estado) => {
    try {
        limpiarFormulario(); // Limpia los campos antes de llenarlos
        obtenerElemento("nombreCliente").textContent = nombre;
        obtenerElemento("apellidoCliente").textContent = apellido;
        obtenerElemento("telefonoCliente").textContent = telefono;
        obtenerElemento("correoCliente").textContent = correo;
        obtenerElemento("estadoCliente").textContent = estado;
    } catch (error) {
        manejarError();
    }
}

