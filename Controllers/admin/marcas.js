// Const de optimización 
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);
// Const de modals 
const myActualizar = new bootstrap.Modal(obtenerElemento('actualizar'));
const myAgregar = new bootstrap.Modal(obtenerElemento('marcaModal'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminar'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const validationsModal = new bootstrap.Modal(obtenerElemento('validationsModal'));
let id = null;
// Función de Obtener 
const obtener = async () => {
    try {
        // Llamada de la funcion de metodos de get 
        const { success, data } = await fetchData("/marcas");
        const tbody = obtenerElemento("tablaBody");
        tbody.innerHTML = "";
        // Comprobación de status de la respuesta
        if (success) {
            data.forEach(({ id_marca, nombre_marca, imagen_marca }) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${nombre_marca}</td> 
                    <td><img src="${imagen}${imagen_marca}" alt="Imagen de la categoría" width="50"></td>
                    <td>
                        <button class="btn btn-dark actualizar" onclick="abrirModalEditar(${id_marca}, '${nombre_marca}', 'http://localhost:4000/${imagen_marca}')"><i class="fas fa-edit"></i></button>  
                        <button class="btn btn-dark eliminar" onclick="abrirModalEliminar(${id_marca})"><i class="fas fa-trash-alt"></i></button>                      
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
    document.querySelectorAll('.preview-image').forEach(image => image.style.display = 'none');
}
// Const para limpiar formulario de actualizar 
const limpiarFormularioActualizar = () => {
    document.querySelectorAll('.form-control-actualizar').forEach(input => input.value = "");
    var fileInputs = document.querySelectorAll('.custom-file-input');
    fileInputs.forEach(fileInput => {
        fileInput.value = '';
        var label = fileInput.nextElementSibling;
        label.innerHTML = 'Seleccionar imagen';
    });
    document.querySelectorAll('.imagede').forEach(image => image.style.display = 'none');
}
// Const para pasar cosas que se necesita para actualizar en el modal
const abrirModalEditar = (id_unico, nombre, imagen) => {
    if (id_unico) {
        mostrarMarcas(nombre, imagen);
        id = id_unico;
        abrirModal(myActualizar);
    } else {
        manejarError();
    }
};
// Función para abrir agregar 
function AbrirAgregar() {
    abrirModal(myAgregar);
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
        const nombre = obtenerElemento("nombre_marca").value;
        const imagen = obtenerElemento("imagen_agregar").files[0];
        // If para validaciones
        if (!validaciones.contieneSoloLetrasYNumeros(nombre) || !validaciones.longitudMaxima(nombre, 100) || !validaciones.validarImagen(imagen)) {
            manejarValidaciones();
        }
        // Else si paso todas las validaciones
        else {
            // Form data para json de body 
            const formData = new FormData();
            formData.append('nombre_marca', nombre);
            formData.append('imagen', imagen);
            const { success } = await createData("/marcas/save", formData);
            // Status de la api
            if (success) {
                obtener();
                cerrarModal(myAgregar);
                setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('agregado'))), 500);
            } else {
                manejarError();
            }
        }
    } catch (error) {
        manejarError();
        console.log(error);
    }
};
// Función para eliminar 
const eliminarCategoria = async (id) => {
    try {
        // Llamada de metodo para eliminar 
        const { success } = await deleteData(`/marcas/delete/${id}`);
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
        const nombre = obtenerElemento("nombreMarcasActuaizar").value;
        // If de validaciones
        if (!validaciones.contieneSoloLetrasYNumeros(nombre) || !validaciones.longitudMaxima(nombre, 100)) {
            manejarValidaciones();
        }
        else {
            const imagen = obtenerElemento("imagen_actualizar").files[0];
            // FormData para json del body
            const formData = new FormData();
            formData.append('id_marca', id);
            formData.append('nombre_marca', nombre);
            formData.append('imagen', imagen);
            const { success } = await updateData("/marcas/update", formData);
            // Status de la repuesta de la api
            if (success) {
                obtener();
                limpiarFormulario();
                cerrarModal(myActualizar);
                setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('agregado'))), 500);
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
    // Variable de Actualizar
    const confirmarActualizarBtn = obtenerElemento('confirmarActualizar');
    confirmarActualizarBtn.addEventListener('click', async () => {
        // Validacion del id
        if (id) {
            await actualizar(id);
            id = null;
        }
    });
    // Variable de Eliminar
    const confirmarEliminarBtn = obtenerElemento('confirmarEliminar');
    confirmarEliminarBtn.addEventListener('click', async () => {
        // Validacion del id
        if (id) {
            await eliminarCategoria(id);
            id = null;
        }
    });
    // Variable de Agregar
    const agregarCategoriaBtn = obtenerElemento("agregarMarcasBtn");
    agregarCategoriaBtn.addEventListener('click', async () => {
        await agregar();
    });
});
// Const de llenar el modal de actualizar con los valores 
const mostrarMarcas = (nombreCategoria, imagenCategoria) => {
    try {
        limpiarFormularioActualizar();
        obtenerElemento("nombreMarcasActuaizar").value = nombreCategoria;
        const imagenPreview = document.querySelector('.imagede');
        if (imagenPreview) {
            const urlImagen = imagenCategoria;
            imagenPreview.src = urlImagen;
            imagenPreview.style.display = 'block';
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
}
