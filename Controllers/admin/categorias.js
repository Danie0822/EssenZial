const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);

const myActualizar = new bootstrap.Modal(obtenerElemento('actualizar'));
const myAgregar = new bootstrap.Modal(obtenerElemento('marcaModal'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminar'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));

let idCategoria = null;

const obtenerCategorias = async () => {
    try {
        const { success, data } = await fetchData("/categorias");
        const tbody = obtenerElemento("tablaBody");
        tbody.innerHTML = "";

        if (success) {
            data.forEach(({ id_categoria, nombre_categoria, imagen_categoria }) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${nombre_categoria}</td>
                    <td><img src="http://localhost:4000${imagen_categoria.replace('/uploads', '')}" alt="Imagen de la categoría" width="50"></td>
                    <td>
                        <button class="btn btn-dark actualizar" onclick="abrirModalEditar(${id_categoria}, '${nombre_categoria}', 'http://localhost:4000${imagen_categoria.replace('/uploads', '')}')"><i class="fas fa-edit"></i></button>  
                        <button class="btn btn-dark eliminar" onclick="abrirModalEliminar(${id_categoria})"><i class="fas fa-trash-alt"></i></button>                      
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

const limpiarFormulario = () => {
    document.querySelectorAll('.form-control').forEach(input => input.value = "");
    document.querySelectorAll('.preview-image').forEach(image => image.style.display = 'none');
}

const limpiarFormularioActualizar = () => {
    document.querySelectorAll('.form-control-actualizar').forEach(input => input.value = "");
    document.querySelectorAll('.imagede').forEach(image => image.style.display = 'none');
}

const abrirModalEditar = (idCategorias, nombreCategoria, imagen) => {
    if (idCategorias) {
        mostrarCategoria(nombreCategoria, imagen);
        idCategoria = idCategorias;
        abrirModal(myActualizar);
    } else {
        manejarError();
    }
};

function AbrirAgregar() {
    abrirModal(myAgregar);
}

const abrirModalEliminar = (idCategorias) => {
    if (idCategorias) {
        idCategoria = idCategorias;
        abrirModal(myEliminar);
    } else {
        manejarError();
    }
};

const agregarCategoria = async () => {
    try {
        const nombreCategoria = obtenerElemento("nombreCategoria").value;
        const imagenCategoria = obtenerElemento("imagenMarca").files[0];

        const formData = new FormData();
        formData.append('nombre_categoria', nombreCategoria);
        formData.append('imagen', imagenCategoria);

        const { success } = await createData("/categorias/save", formData);

        if (success) {
            obtenerCategorias();
            limpiarFormulario();
            cerrarModal(myAgregar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('agregado'))), 500);
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
};

const eliminarCategoria = async (idCategoria) => {
    try {
        const { success } = await deleteData(`/categorias/delete/${idCategoria}`);

        if (success) {
            obtenerCategorias();
            cerrarModal(myEliminar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('eliminadoExitosoModal'))), 500);
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
};

const actualizar = async (idCategoria) => {
    try {
        const nombreCategoria = obtenerElemento("nombreCategoriaActuaizar").value;
        const imagenCategoria = obtenerElemento("imagenMarcaActualizar").files[0];
        const formData = new FormData();
        formData.append('id_categoria', idCategoria);
        formData.append('nombre_categoria', nombreCategoria);
        formData.append('imagen', imagenCategoria);

        const { success } = await updateData("/categorias/update", formData);

        if (success) {
            obtenerCategorias();
            limpiarFormularioActualizar();
            cerrarModal(myActualizar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('acto'))), 500);
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
};

document.addEventListener("DOMContentLoaded", function () {

    obtenerCategorias();

    const confirmarEliminarBtn = obtenerElemento('confirmarEliminar');
    confirmarEliminarBtn.addEventListener('click', async () => {
        if (idCategoria) {
            await eliminarCategoria(idCategoria);
            idCategoria = null;
        }
    });

    const confirmarActualizarBtn = obtenerElemento('confirmarActualizar');
    confirmarActualizarBtn.addEventListener('click', async () => {
        if (idCategoria) {
            await actualizar(idCategoria);
            idCategoria = null;
        }
    });

    const agregarCategoriaBtn = obtenerElemento("agregarCategoriaBtn");
    agregarCategoriaBtn.addEventListener("click", agregarCategoria);
});

const mostrarCategoria = (nombreCategoria, imagenCategoria) => {
    try {
        obtenerElemento("nombreCategoriaActuaizar").value = nombreCategoria;
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
