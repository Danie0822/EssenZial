
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);

const myActualizar = new bootstrap.Modal(obtenerElemento('actualizar'));
const myAgregar = new bootstrap.Modal(obtenerElemento('adminModal'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminar'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const validationsModal = new bootstrap.Modal(obtenerElemento('validationsModal'));
let id = null;

const obtener = async () => {
    try {
        const { success, data } = await fetchData("/admin");
        const tbody = obtenerElemento("tablaBody");
        tbody.innerHTML = "";

        if (success) {
            data.forEach(({ id_admin, nombre_admin, apellido_admin, correo_admin }) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${correo_admin}</td>
                    <td>
                        <button class="btn btn-dark actualizar" onclick="abrirModalEditar(${id_admin}, '${nombre_admin}', '${correo_admin}', '${apellido_admin}')"><i class="fas fa-edit"></i></button>  
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

const limpiarFormulario = () => {
    document.querySelectorAll('.form-control').forEach(input => input.value = "");
    document.querySelectorAll('.preview-image').forEach(image => image.style.display = 'none');
}

const limpiarFormularioActualizar = () => {
    document.querySelectorAll('#actualizar .form-control').forEach(input => input.value = "");
}

const abrirModalEditar = (id_unico, nombre, apellido, correo) => {
    if (id_unico) {
        mostrar(nombre, apellido, correo);
        id = id_unico;
        abrirModal(myActualizar);
    } else {
        manejarError();
    }
};

function AbrirAgregar() {
    abrirModal(myAgregar);
}

const abrirModalEliminar = (id_unico) => {
    if (id_unico) {
        id = id_unico;
        abrirModal(myEliminar);
    } else {
        manejarError();
    }
};

const agregarCategoria = async () => {

    try {
        const nombre = obtenerElemento("txtNombre").value;
        const apellido = obtenerElemento("txtApellido").value;
        const correo = obtenerElemento("txtCorreo").value;
        const clave = obtenerElemento("txtClave").value;

        const formData1 = new FormData();
        formData1.append('nombre_admin', nombre);
        formData1.append('apellido_admin', apellido);
        formData1.append('correo_admin', correo);
        formData1.append('clave_admin', clave);
        const { success } = await createData("/admin/save", formData1);
        if (success) {
            obtenerCategorias();
        
        } else {
            manejarError();
        }

    } catch (error) {
        manejarError();
        console.log(error);
    }
};

const eliminarCategoria = async (id) => {
    try {
        const { success } = await deleteData(`/olores/delete/${id}`);
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

const actualizar = async (id) => {
    try {
        const nombre = obtenerElemento("nombreOlorActuaizar").value;
        if (!validaciones.contieneSoloLetrasYNumeros(nombre) || !validaciones.longitudMaxima(nombre, 100)) {
            manejarValidaciones();
        }
        else {
            const imagen = obtenerElemento("imagen_actualizar").files[0];
            const formData = new FormData();
            formData.append('id_olor', id);
            formData.append('nombre_olor', nombre);
            formData.append('imagen', imagen);

            const { success } = await updateData("/olores/update", formData);

            if (success) {
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

document.addEventListener("DOMContentLoaded", function () {

    obtener();

    const confirmarActualizarBtn = obtenerElemento('confirmarActualizar');
    confirmarActualizarBtn.addEventListener('click', async () => {
        if (id) {
            await actualizar(id);
            id = null;
        }
    });

    const confirmarEliminarBtn = obtenerElemento('confirmarEliminar');
    confirmarEliminarBtn.addEventListener('click', async () => {
        if (id) {
            await eliminarCategoria(id);
            id = null;
        }
    });
    const agregarCategoriaBtn = obtenerElemento("btnAgregarAdmi");
    agregarCategoriaBtn.addEventListener("click", agregarCategoria);
});

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
