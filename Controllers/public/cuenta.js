// Const de optimización 
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);
const manejarExito = () => abrirModal(myExito);
const myUsuario = new bootstrap.Modal(obtenerElemento('modalActualizarCliente'));
// Const de modals
const myActualizar = new bootstrap.Modal(obtenerElemento('modalActualizarDireccion'));
const myAgregar = new bootstrap.Modal(obtenerElemento('modalAgregarDireccion'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminar'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const myExito = new bootstrap.Modal(obtenerElemento('agregado'));
const validationsModal = new bootstrap.Modal(obtenerElemento('validationsModal'));
// Variable global para almacenar el cliente actual
let clienteActual = {};
const clientes = [];
let claveActualizar = null;
function limpiarFormularioUsuario() {
    // Selecciona todos los elementos de formulario dentro del modal
    const inputs = document.querySelectorAll('.info input[type="text"], .info input[type="email"]');

    // Itera sobre los elementos y establece su valor en una cadena vacía
    inputs.forEach(input => {
        input.value = "";
    });
}
function limpiarFormularioActualizarCliente() {
    // Selecciona todos los elementos de formulario dentro del modal
    const inputs = document.querySelectorAll('#modalActualizarCliente input[type="text"], #modalActualizarCliente input[type="email"]');

    // Itera sobre los elementos y establece su valor en una cadena vacía
    inputs.forEach(input => {
        input.value = "";
    });
}


// Función para obtener clientes de la API y actualizar el arreglo de clientes
const obtenerClientes = async (clientesArray) => {
    try {
        // Limpiar el arreglo antes de obtener nuevos clientes
        clientesArray.length = 0;

        // Llamada de la función para obtener datos
        const idCliente = sessionStorage.getItem("id_cliente");
        const { success, data } = await fetchData(`/cliente/${idCliente}`);
        
        // Comprobación de éxito en la obtención de datos
        if (success) {
            data.forEach(({ id_cliente, nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, estado_cliente, clave_cliente }) => {
                // Crear un objeto con los datos del cliente
                const cliente = {
                    id: id_cliente,
                    nombre: nombre_cliente,
                    apellido: apellido_cliente,
                    correo: correo_cliente,
                    telefono: telefono_cliente,
                    estado: estado_cliente,
                    clave: clave_cliente
                };
                
                // Agregar el objeto al arreglo de clientes pasado como parámetro
                clientesArray.push(cliente);
            });

            // Si hay clientes en el arreglo, actualiza el cliente actual
            if (clientesArray.length > 0) {
                clienteActual = clientesArray[0];
            }
        } else {
            manejarError();
        }
    } catch (error) {
        console.log(error);
        manejarError();
    }
};

// Función para mostrar la cuenta del cliente actual
const mostrarCuenta = () => {
    limpiarFormularioUsuario();
    obtenerElemento("nombre").value = clienteActual.nombre;
    obtenerElemento("apellido").value = clienteActual.apellido;
    obtenerElemento("email").value = clienteActual.correo;
    obtenerElemento("telefono").value = clienteActual.telefono;
    claveActualizar = clienteActual.clave;
};

// Const de llenar el modal de actualizar con los valores 
const mostrarCuentaModal = () => {
    try {
        limpiarFormularioActualizarCliente();
        obtenerElemento("nombreClienteActualizar").value = clienteActual.nombre;
        obtenerElemento("apellidoClienteActualizar").value = clienteActual.apellido;
        obtenerElemento("telefonClienteActualizar").value = clienteActual.telefono;
        obtenerElemento("correoClienteActualizar").value = clienteActual.correo;
        claveActualizar = clienteActual.clave;
    } catch (error) { 
        console.log(error)
    }
}

// Función para actualizar cliente 
const actualizarCliente = async () => {
    try {
        // Const de variables de modals 
        const nombre = obtenerElemento("nombreClienteActualizar").value;
        const apellido = obtenerElemento("apellidoClienteActualizar").value;
        const telefono = obtenerElemento("telefonClienteActualizar").value;
        const correo = obtenerElemento("correoClienteActualizar").value;
        const clave = obtenerElemento("contrasena").value.trim();
        const confirmar = obtenerElemento("confirmar").value.trim();
        const contra = clave === '' ? claveActualizar : await sha256(clave);
        const confirmarFinal = confirmar === '' ? claveActualizar : await sha256(confirmar);
        // If para validaciones
        if (!validaciones.contieneSoloLetrasYNumeros(nombre)) {
            mostrarModal("El nombre solo puede contener letras y números.");
        } else if (!validaciones.longitudMaxima(nombre, 100)) {
            mostrarModal("El nombre debe tener como máximo 100 caracteres.");
        } else if (!validaciones.contieneSoloLetrasYNumeros(apellido)) {
            mostrarModal("El apellido solo puede contener letras y números.");
        } else if (!validaciones.longitudMaxima(apellido, 100)) {
            mostrarModal("El apellido debe tener como máximo 100 caracteres.");
        } else if (!validaciones.validarTelefono(telefono)) {
            mostrarModal("El teléfono ingresado no es válido.");
        } else if (!validaciones.validarCorreoElectronico(correo)) {
            mostrarModal("El correo electrónico ingresado no es válido.");
        }
        else if (!validaciones.validarContra(contra)) {
            mostrarModal( "La contraseña debe tener al menos 8 caracteres.");
        }
        else if (!validaciones.validarConfirmacionContrasena(contra, confirmarFinal)) {
            mostrarModal("Las contraseñas no coinciden.");
        }  else {
            const idCliente = sessionStorage.getItem("id_cliente");
            // Form data para json de body 
            var adminData = {
                id_cliente: idCliente,
                nombre_cliente: nombre,
                apellido_cliente: apellido,
                correo_cliente: correo,
                telefono_cliente: telefono,
                clave_cliente: contra,
            };
            const response = await DataAdmin("/cliente/update/Cliente", adminData, 'PUT');
            // Status de la api 
            if (response.status == 200) {
               await obtenerClientes(clientes).then(mostrarCuenta);
               manejarExito();
               limpiarFormularioActualizarCliente();
               cerrarModal(myUsuario);
            } else {
                manejarError();
            }
        }
    } catch (error) {
        console.log(error);
        manejarError();
    }
};

function mostrarModal(mensaje) {
    $('#validationsModal .modal-body p').text(mensaje);
    $('#validationsModal').modal('show');
}
function abrirUsuario() {
    mostrarCuentaModal();
    abrirModal(myUsuario);
}