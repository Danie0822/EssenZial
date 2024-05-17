
let id = null;
let idCliente = null;
// Función de Obtener 
const obtener = async () => {
    try {
        // Llamada de la función para obtener datos
        const idCliente = sessionStorage.getItem("id_cliente");
        const { success, data } = await fetchData(`/dirreciones/${idCliente}`);
        const listaDirecciones = document.getElementById("listaDirreciones");
        listaDirecciones.innerHTML = "";
        // Comprobación de éxito en la obtención de datos
        if (success) {
            data.forEach(({ id_direccion, nombre_direccion, direccion_cliente, telefono_cliente, codigo_postal, instrucciones_entrega, id_cliente }) => {
                const cardDiv = document.createElement("div");
                cardDiv.classList.add("col-md-6", "mb-4");
                cardDiv.innerHTML = `
                    <div class="card bg-light border-0 shadow-sm">
                        <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-primary">Nombre: ${nombre_direccion}</h5>
                        <p class="card-text">Dirección: ${direccion_cliente}</p>
                        <p class="card-text">Teléfono: ${telefono_cliente}</p>
                        <p class="card-text">codigo_postal: ${codigo_postal}</p>
                            <div class="col-md-6 text-right row">
                                <button class="btn botons btn-outline-primary" onclick="abrirModalEditar(${id_direccion}, '${nombre_direccion}', '${direccion_cliente}', '${telefono_cliente}','${codigo_postal}','${instrucciones_entrega}', ${id_cliente})"><i class="fas fa-edit"></i></button>
                                <button class="btn botons btn-outline-danger ml-2" onclick="abrirModalEliminar(${id_direccion})"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </div>
                `;
                listaDirecciones.appendChild(cardDiv);
            });
        } else {
            manejarError();
        }
    } catch (error) {
        console.log(error);
        manejarError();
    }
};
const limpiarFormulario = () => {
    // Selecciona todos los elementos con la clase .form-control dentro del modal
    document.querySelectorAll('.modal.fade .form-control').forEach(input => {
        // Establece el valor de cada elemento en una cadena vacía
        input.value = "";
    });
}


// Const para pasar cosas que se necesita para actualizar en el modal 
const abrirModalEditar = (id_direccion, nombre_direccion, direccion_cliente, telefono_cliente, codigo_postal, instrucciones_entrega, id_cliente) => {
    if (id_direccion) {
        mostrar(nombre_direccion, direccion_cliente, telefono_cliente, codigo_postal, instrucciones_entrega);
        id = id_direccion;
        idCliente = id_cliente;
        abrirModal(myActualizar);
    } else {
        manejarError();
    }
};
// Función para abrir agregar 
function AbrirAgregar() {
    abrirModal(myAgregar);
}
function cerrarModalActualizar() {
    cerrarModal(myActualizar);
}
// Const para pasar cosas que se necesita para eleminar en el modal
const abrirModalEliminar = (id_unico) => {
    if (id_unico) {
        id = id_unico;
        abrirModal(myEliminar);
    } else {
        manejarError();
    }
};


// Función para agregar 
const agregar = async () => {
    try {
        // Const de variables de modals 
        const nombre = obtenerElemento("nombreDireccionModalAgregar").value;
        const direccion = obtenerElemento("direccionModalAgregar").value;
        const telefono = obtenerElemento("telefonoModalAgregar").value;
        const instrucciones = obtenerElemento("instruccionesModalAgregar").value;
        const codigoPostal = obtenerElemento("codigoPostalModalAgregar").value;
        const idCliente = sessionStorage.getItem("id_cliente");
        // If para validaciones
        if (!validaciones.contieneSoloLetrasYNumeros(nombre)) {
            mostrarModal("El nombre solo puede contener letras y números.");
        } else if (!validaciones.longitudMaxima(nombre, 100)) {
            mostrarModal("El nombre debe tener como máximo 100 caracteres.");
        } else if (!validaciones.contieneSoloLetrasYNumeros(direccion)) {
            mostrarModal("El direccion solo puede contener letras y números.");
        } else if (!validaciones.longitudMaxima(direccion, 100)) {
            mostrarModal("El direccion debe tener como máximo 100 caracteres.");
        } else if (!validaciones.validarTelefono(telefono)) {
            mostrarModal("El teléfono ingresado no es válido.");
        } else if (!validaciones.contieneSoloLetrasYNumeros(instrucciones)) {
            mostrarModal("El instrucciones solo puede contener letras y números.");
        } else if (!validaciones.longitudMaxima(instrucciones, 100)) {
            mostrarModal("El instrucciones debe tener como máximo 100 caracteres.");
        } else if (!validaciones.contieneSoloLetrasYNumeros(codigoPostal)) {
            mostrarModal("El codigo Postal solo puede contener letras y números.");
        } else if (!validaciones.longitudMaxima(codigoPostal, 5)) {
            mostrarModal("El codigo Postal debe tener como máximo 100 caracteres.");
        }
        else {
            // Form data para json de body 
            var dirreciones = {
                nombre_direccion: nombre,
                direccion_cliente: direccion,
                telefono_cliente: telefono,
                instrucciones_entrega: instrucciones,
                codigo_postal: codigoPostal,
                id_cliente: idCliente,
            };
            const response = await DataAdmin("/dirreciones/save", dirreciones, 'POST');
            // Status de la api 
            if (response.status == 200) {
                obtener();
                limpiarFormulario();
                cerrarModal(myAgregar);
                setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('agregado'))), 500);

            } else {
                manejarError();
            }
        }
    } catch (error) {
        manejarError();
    }
};

// Función para actualizar 
const actualizar = async () => {
    try {
        // Const de variables de modals 
        const nombre = obtenerElemento("nombreDireccionModalActualizar").value;
        const direccion = obtenerElemento("direccionModalActualizar").value;
        const telefono = obtenerElemento("telefonoModalActualizar").value;
        const instrucciones = obtenerElemento("instruccionesModalActualizar").value;
        const codigoPostal = obtenerElemento("codigoPostalModalActualizar").value;
        const idCliente = sessionStorage.getItem("id_cliente");
        // If para validaciones
        if (!validaciones.contieneSoloLetrasYNumeros(nombre)) {
            mostrarModal("El nombre solo puede contener letras y números.");
        } else if (!validaciones.longitudMaxima(nombre, 100)) {
            mostrarModal("El nombre debe tener como máximo 100 caracteres.");
        } else if (!validaciones.contieneSoloLetrasYNumeros(direccion)) {
            mostrarModal("El direccion solo puede contener letras y números.");
        } else if (!validaciones.longitudMaxima(direccion, 100)) {
            mostrarModal("El direccion debe tener como máximo 100 caracteres.");
        } else if (!validaciones.validarTelefono(telefono)) {
            mostrarModal("El teléfono ingresado no es válido.");
        } else if (!validaciones.contieneSoloLetrasYNumeros(instrucciones)) {
            mostrarModal("El instrucciones solo puede contener letras y números.");
        } else if (!validaciones.longitudMaxima(instrucciones, 100)) {
            mostrarModal("El instrucciones debe tener como máximo 100 caracteres.");
        } else if (!validaciones.contieneSoloLetrasYNumeros(codigoPostal)) {
            mostrarModal("El codigo Postal solo puede contener letras y números.");
        } else if (!validaciones.longitudMaxima(codigoPostal, 5)) {
            mostrarModal("El codigo Postal debe tener como máximo 100 caracteres.");
        }
        else {
            // Form data para json de body 
            var dirreciones = {
                nombre_direccion: nombre,
                direccion_cliente: direccion,
                telefono_cliente: telefono,
                instrucciones_entrega: instrucciones,
                codigo_postal: codigoPostal,
                id_cliente: idCliente,
                id_direccion: id
            };
            const response = await DataAdmin("/dirreciones/update", dirreciones, 'PUT');
            // Status de la api 
            if (response.status == 200) {
                obtener();
                limpiarFormularioActualizar();
                cerrarModal(myActualizar);
                setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('agregado'))), 500);
                id = null;
            } else {
                manejarError();
                id = null;
            }
        }
    } catch (error) {
        manejarError();
        id = null;
    }
};
const eliminar = async () => {
    try {
        // Llamada de metodo para eliminar 
        const { success } = await deleteData(`/dirreciones/delete/${id}`);
        // If para status de la api
        if (success) {
            obtener();
            cerrarModal(myEliminar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('agregado'))), 500);
            id = null;
        } else {
            manejarError();
            id = null;
        }
    } catch (error) {
        manejarError();
        id = null;
    }
};


const esperar = async () => {
    try {
        await obtenerClientes(clientes).then(mostrarCuenta);
        await obtener();

    } catch (error) {
        manejarError();
        id = null;
    }
};
// Dom del html 
document.addEventListener("DOMContentLoaded", function () {
    // Obtener cuando recarga pagina
    esperar();
    const agregarCategoriaBtn = obtenerElemento("btnAgregar");
    agregarCategoriaBtn.addEventListener("click", agregar);
    const confirmarActualizarBtn = obtenerElemento('confirmarActualizar');
    confirmarActualizarBtn.addEventListener('click', async () => {
        await actualizar();
    });
    const confirmarEliminarBtn = obtenerElemento('btnAceptado');
    confirmarEliminarBtn.addEventListener('click', async () => {
        // Validacion del id
        await eliminar();
    });
    const btnactualizarClientes = obtenerElemento("btActualizarCliente");
    btnactualizarClientes.addEventListener("click", actualizarCliente);
});
const limpiarFormularioActualizar = () => {
    // Selecciona todos los elementos con la clase .form-control dentro del modal de actualización
    document.querySelectorAll('.modal.fade .form-control').forEach(input => {
        // Establece el valor de cada elemento en una cadena vacía
        input.value = "";
    });
}

// Const de llenar el modal de actualizar con los valores 
const mostrar = (nombre_direccion, direccion_cliente, telefono_cliente, codigo_postal, instrucciones_entrega) => {
    try {
        limpiarFormularioActualizar();
        obtenerElemento("nombreDireccionModalActualizar").value = nombre_direccion;
        obtenerElemento("direccionModalActualizar").value = direccion_cliente;
        obtenerElemento("telefonoModalActualizar").value = telefono_cliente;
        obtenerElemento("codigoPostalModalActualizar").value = codigo_postal;
        obtenerElemento("instruccionesModalActualizar").value = instrucciones_entrega;
    } catch (error) {
        manejarError();
    }
}



