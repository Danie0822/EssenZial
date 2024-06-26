// Const de optimización 
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);
// Const de modals
const myActualizar = new bootstrap.Modal(obtenerElemento('actualizar'));
const myAgregar = new bootstrap.Modal(obtenerElemento('adminModal'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminar'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const validationsModal = new bootstrap.Modal(obtenerElemento('validationsModal'));
let id = null;

// Función de Obtener 
const obtener = async () => {
    try {
        // Llamada de la funcion de metodos de get 
        const { success, data } = await fetchData("/admin");
        const tbody = obtenerElemento("tablaBody");
        tbody.innerHTML = "";
        // Comprobación de status de la respuesta
        if (success) {
            data.forEach(({ id_admin, nombre_admin, apellido_admin, correo_admin }) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${correo_admin}</td>
                    <td>
                        <button class="btn btn-dark actualizar" onclick="abrirModalEditar(${id_admin}, '${nombre_admin}', '${apellido_admin}', '${correo_admin}')"><i class="fas fa-edit"></i></button>  
                        <button class="btn btn-dark eliminar" onclick="abrirModalEliminar(${id_admin})"><i class="fas fa-trash-alt"></i></button>                      
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
// Const para limpiar formulario 
const limpiarFormulario = () => {
    document.querySelectorAll('.form-control').forEach(input => input.value = "");
}
// Const para limpiar formulario de actualizar 
const limpiarFormularioActualizar = () => {
    document.querySelectorAll('#actualizar .form-control').forEach(input => input.value = "");
}
// Const para pasar cosas que se necesita para actualizar en el modal 
const abrirModalEditar = (idUnico, nombre, apellido, correo) => {
    if (idUnico) {
        mostrar(nombre, apellido, correo);
        abrirModal(myActualizar);
        id = idUnico;
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
const abrirModalEliminar = (idUnico) => {
    if (idUnico) {
        const idAdminG = sessionStorage.getItem("id_admin");
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
// Función para agregar 
const agregar = async () => {
    try {
        // Const de variables de modals 
        const nombre = obtenerElemento("txtNombre").value;
        const apellido = obtenerElemento("txtApellido").value;
        const correo = obtenerElemento("txtCorreo").value;
        const clave = obtenerElemento("txtClave").value;
        // If para validaciones
        if (!validaciones.contieneSoloLetrasYNumeros(nombre) || !validaciones.longitudMaxima(nombre, 100) ||
            !validaciones.contieneSoloLetrasYNumeros(apellido) || !validaciones.longitudMaxima(apellido, 100) ||
            !validaciones.validarContra(clave) || !validaciones.validarCorreoElectronico(correo)) {
            manejarValidaciones();
        }
        // Else si paso todas las validaciones 
        else {
            // Encriptación de la contraseña 
            const contra = await sha256(clave);
            // Form data para json de body 
            var adminData = {
                nombre_admin: nombre,
                apellido_admin: apellido,
                correo_admin: correo,
                clave_admin: contra
            };
            const response = await DataAdmin("/admin/save", adminData, 'POST');
            // Status de la api 
            if (response.status == 200) {
                obtener();
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
// Función para eliminar 
const eliminarCategoria = async (id) => {
    try {
        // Llamada de metodo para eliminar 
        const { success } = await deleteData(`/admin/delete/${id}`);
        // If para status de la api
        if (success) {
            obtener();
            cerrarModal(myEliminar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('acto'))), 500);
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
};
// Función para actualizar
const actualizar = async (id) => {
    try {
        // Const de variables de modals
        const nombre = obtenerElemento("txtNombreAct").value;
        const apellido = obtenerElemento("txtApellidoAct").value;
        const correo = obtenerElemento("txtCorreoAct").value;
        // If de validaciones 
        if (!validaciones.contieneSoloLetrasYNumeros(nombre) || !validaciones.longitudMaxima(nombre, 100) ||
            !validaciones.contieneSoloLetrasYNumeros(apellido) || !validaciones.longitudMaxima(apellido, 100) ||
            !validaciones.validarCorreoElectronico(correo)) {
            manejarValidaciones();
        }
        else {
            // FormData para json del body 
            var adminData = {
                id_admin: id,
                nombre_admin: nombre,
                apellido_admin: apellido,
                correo_admin: correo
            };
            const success = await DataAdmin("/admin/update", adminData, 'PUT');
            // Status de la repuesta de la api
            if (success.status == 200) {
                obtener();
                limpiarFormularioActualizar();
                cerrarModal(myActualizar);
                setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('acto'))), 500);
            } else {
                manejarError();
            }
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
    // Variable de Eliminar
    const confirmarActualizarBtn = obtenerElemento('confirmarActualizar');
    confirmarActualizarBtn.addEventListener('click', async () => {
        // Validacion del id
        if (id) {
            await actualizar(id);
            id = null;
        }
    });
    // Variable de Actualizar
    const confirmarEliminarBtn = obtenerElemento('confirmarEliminar');
    confirmarEliminarBtn.addEventListener('click', async () => {
        // Validacion del id
        if (id) {
            await eliminarCategoria(id);
            id = null;
        }
    });
    // Variable de Agregar
    const agregarCategoriaBtn = obtenerElemento("btnAgregarAdmi");
    agregarCategoriaBtn.addEventListener("click", agregar);
});
// Const de llenar el modal de actualizar con los valores 
const mostrar = (nombre, apellido, correo) => {
    try {
        limpiarFormularioActualizar();
        obtenerElemento("txtNombreAct").value = nombre;
        obtenerElemento("txtApellidoAct").value = apellido;
        obtenerElemento("txtCorreoAct").value = correo;
    } catch (error) {
        manejarError();
    }
}
