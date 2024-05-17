// Const de optimización 
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarExito = () => abrirModal(myExito);
const manejarValidaciones = () => abrirModal(validationsModal);
// Const de modals
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const myExito = new bootstrap.Modal(obtenerElemento('agregado'));
const validationsModal = new bootstrap.Modal(obtenerElemento('validationsModal'));

// Const para limpiar formulario 
const limpiarFormulario = () => {
    document.querySelectorAll('.form-control').forEach(input => input.value = '');
}


// Función para agregar 
const agregar = async () => {
    try {
        // Const de variables de modals 
        const nombre = obtenerElemento("nombre").value;
        const apellido = obtenerElemento("apellido").value;
        const telefono = obtenerElemento("telefono").value;
        const correo = obtenerElemento("correo").value;
        const clave = obtenerElemento("contrasena").value;
        const confirmar = obtenerElemento("confirmar").value;
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
        }else if (!validaciones.validarContra(clave)) {
            mostrarModal("La contraseña debe cumplir con ciertos criterios de seguridad.");
        } else if (!validaciones.validarConfirmacionContrasena(clave, confirmar)) {
            mostrarModal("La confirmación de la contraseña no coincide con la contraseña ingresada.");
        }  else {
            // Encriptación de la contraseña 
            const contra = await sha256(clave);
            // Form data para json de body 
            var adminData = {
                nombre_cliente: nombre,
                apellido_cliente: apellido,
                correo_cliente: correo,
                clave_cliente: contra,
                telefono_cliente: telefono,
                estado_cliente: true
            };
            const response = await DataNoToken("/cliente/save", adminData, 'POST');
            // Status de la api 
            if (response.status == 200) {
               manejarExito();
               limpiarFormulario();

            } else {
                manejarError();
            }
        }
    } catch (error) {
        manejarError();
    }
};

// Dom del html 
document.addEventListener("DOMContentLoaded", function () {
    // Variable de Agregar
    const agregarCategoriaBtn = obtenerElemento("btnAgregar");
    agregarCategoriaBtn.addEventListener("click", agregar);
});

function mostrarModal(mensaje) {
    $('#validationsModal .modal-body p').text(mensaje);
    $('#validationsModal').modal('show');
}
