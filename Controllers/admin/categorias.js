// Const de optimización 
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);
// Const de modals 
const myActualizar = new bootstrap.Modal(obtenerElemento('actualizar'));
const myAgregar = new bootstrap.Modal(obtenerElemento('agregar'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminar'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const validationsModal = new bootstrap.Modal(obtenerElemento('validationsModal'));
let idCategoria = null;

// Función de Obtener 
const obtenerCategorias = async () => {
    try {
        // Llamada de la funcion de metodos de get 
        const { success, data } = await fetchData("/categorias");
        const tbody = obtenerElemento("tablaBody");
        tbody.innerHTML = "";
        // Comprobación de status de la respuesta  
        if (success) {
            data.forEach(({ id_categoria, nombre_categoria, imagen_categoria }) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${nombre_categoria}</td> 
                    <td><img src="${imagen}${imagen_categoria}" alt="Imagen de la categoría" width="50"></td>
                    <td>
                        <button class="btn btn-dark actualizar" onclick="abrirModalEditar(${id_categoria}, '${nombre_categoria}', 'http://localhost:4000/${imagen_categoria}')"><i class="fas fa-edit"></i></button>  
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

// Función para obtener el reporte
const obtenerReporte = async () => {
    try {
        const blobResponse = await fetchPdfAndBlob("/categorias/reporte/view/", token);
        if (!blobResponse.ok) {
            throw new Error('Error al descargar el reporte PDF');
        }
        const blob = await blobResponse.blob();
        descargarArchivo(blob, 'reportes_categorias.pdf');
    } catch (error) {
        console.error('Error al obtener el reporte:', error);
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
const abrirModalEditar = (idCategorias, nombreCategoria, imagen) => {
    if (idCategorias) {
        mostrarCategoria(nombreCategoria, imagen);
        idCategoria = idCategorias;
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
const abrirModalEliminar = (idCategorias) => {
    if (idCategorias) {
        idCategoria = idCategorias;
        abrirModal(myEliminar);
    } else {
        manejarError();
    }
};
// Función para agregar 
const agregarCategoria = async () => {
    try {
        // Const de variables de modals 
        const nombreCategoria = obtenerElemento("nombreCategoria").value;
        const imagenMarca = obtenerElemento("imagen_agregar").files[0];
        // If para validaciones 
        if (!validaciones.contieneSoloLetrasYNumeros(nombreCategoria) || !validaciones.longitudMaxima(nombreCategoria, 100) || !validaciones.validarImagen(imagenMarca)) {
            manejarValidaciones();
        }
        // Else si paso todas las validaciones 
        else {
            // Form data para json de body 
            const formData = new FormData();
            formData.append('nombre_categoria', nombreCategoria);
            formData.append('imagen', imagenMarca);
            const { success } = await createData("/categorias/save", formData);
            // Status de la api 
            if (success) {
                obtenerCategorias();
                limpiarFormulario();
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
const eliminarCategoria = async (idCategoria) => {
    try {
        // Llamada de metodo para eliminar 
        const { success } = await deleteData(`/categorias/delete/${idCategoria}`);
        // If para status de la api
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
// Función para actualizar
const actualizar = async (idCategoria) => {
    try {
        // Const de variables de modals 
        const nombreCategoria = obtenerElemento("nombreCategoriaActuaizar").value;
        // If de validaciones 
        if (!validaciones.contieneSoloLetrasYNumeros(nombreCategoria) || !validaciones.longitudMaxima(nombreCategoria, 100)) {
            manejarValidaciones();
        }
        else {
            // FormData para json del body 
            const imagenCategoria = obtenerElemento("imagen_actualizar").files[0];
            const formData = new FormData();
            formData.append('id_categoria', idCategoria);
            formData.append('nombre_categoria', nombreCategoria);
            formData.append('imagen', imagenCategoria);
            const { success } = await updateData("/categorias/update", formData);
            // Status de la repuesta de la api 
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
// Dom del html 
document.addEventListener("DOMContentLoaded", function () {
    // Obtener cuando recarga pagina 
    obtenerCategorias();
    // Variable de Eliminar
    const confirmarEliminarBtn = obtenerElemento('confirmarEliminar');
    confirmarEliminarBtn.addEventListener('click', async () => {
        // Validacion del id 
        if (idCategoria) {
            await eliminarCategoria(idCategoria);
            idCategoria = null;
        }
    });
    // Variable de Actualizar
    const confirmarActualizarBtn = obtenerElemento('confirmarActualizar');
    confirmarActualizarBtn.addEventListener('click', async () => {
        // Validacion del id
        if (idCategoria) {
            await actualizar(idCategoria);
            idCategoria = null;
        }
    });
    // Variable de Agregar
    const agregarCategoriaBtn = obtenerElemento("agregarCategoriaBtn");
    agregarCategoriaBtn.addEventListener('click', async () => {
        await agregarCategoria();
    });
});

// Const de llenar el modal de actualizar con los valores 
const mostrarCategoria = (nombreCategoria, imagenCategoria) => {
    try {
        limpiarFormularioActualizar();
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
