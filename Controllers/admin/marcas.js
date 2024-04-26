
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);

const myActualizar = new bootstrap.Modal(obtenerElemento('actualizar'));
const myAgregar = new bootstrap.Modal(obtenerElemento('marcaModal'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminar'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const validationsModal = new bootstrap.Modal(obtenerElemento('validationsModal'));
let id = null;

const obtenerCategorias = async () => {
    try {
        const { success, data } = await fetchData("/marcas");
        const tbody = obtenerElemento("tablaBody");
        tbody.innerHTML = "";

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

const limpiarFormulario = () => {
    document.querySelectorAll('.form-control').forEach(input => input.value = "");
    document.querySelectorAll('.preview-image').forEach(image => image.style.display = 'none');
}

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

const abrirModalEditar = (id_unico, nombre, imagen) => {
    if (id_unico) {
        mostrarMarcas(nombre, imagen);
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
        const nombre = obtenerElemento("nombre_marca").value;
        const imagen = obtenerElemento("imagen_agregar").files[0];
        if (!validaciones.contieneSoloLetrasYNumeros(nombre) || !validaciones.longitudMaxima(nombre, 100) || !validaciones.validarImagen(imagen)) {
            manejarValidaciones();
        }
        else {
            const formData = new FormData();
            formData.append('nombre_marca', nombre);
            formData.append('imagen', imagen);
            const { success } = await createData("/marcas/save", formData);
            if (success) {
                obtenerCategorias();
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

const eliminarCategoria = async (id) => {
    try {
        const { success } = await deleteData(`/marcas/delete/${id}`);
        if (success) {
            obtenerCategorias();
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
        const nombre = obtenerElemento("nombreMarcasActuaizar").value;
        if (!validaciones.contieneSoloLetrasYNumeros(nombre) || !validaciones.longitudMaxima(nombre, 100)) {
            manejarValidaciones();
        }
        else {
            const imagen = obtenerElemento("imagen_actualizar").files[0];
            const formData = new FormData();
            formData.append('id_marca', id);
            formData.append('nombre_marca', nombre);
            formData.append('imagen', imagen);

            const { success } = await updateData("/marcas/update", formData);

            if (success) {
                obtenerCategorias();
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

    obtenerCategorias();

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
    const agregarCategoriaBtn = obtenerElemento("agregarMarcasBtn");
    agregarCategoriaBtn.addEventListener("click", agregarCategoria);
});

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
