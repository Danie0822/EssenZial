

const obtenerCategorias = async () => {
    try {
        const data = await fetchData("/categorias"); 
        
        if (data.success) {
            const tbody = document.getElementById("categoriaTableBody");
            tbody.innerHTML = "";

            data.data.forEach(categoria => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${categoria.nombre_categoria}</td>
                    <td><img src="http://localhost:4000${categoria.imagen_categoria.replace('/uploads', '')}" alt="Imagen de la categoría" width="50"></td>
                    <td>
                        <button class="btn btn-dark eliminar" data-id="${categoria.id_categoria}" data-toggle="modal" data-target="#eliminar"><i
                        class="fas fa-trash-alt"></i></button>
                        <button class="btn btn-dark actualizar" data-id="${categoria.id_categoria}" data-toggle="modal" data-target="#actualizar"><i
                        class="fas fa-edit "></i> </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            console.error("Error al obtener categorías:", data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const limpiarFormulario = () => {
    document.getElementById("nombreCategoria").value = "";
    document.getElementById("imagenMarca").value = "";
    document.querySelector('.preview-image').style.display = 'none';
}

const limpiarFormularioActualizar = () => {
    document.getElementById("nombreCategoriaActuaizar").value = "";
    document.getElementById("imagenMarcaActualizar").value = "";
    document.querySelector('.imagede').style.display = 'none';
}


const agregarCategoria = async () => {
    try {
        const nombreCategoria = document.getElementById("nombreCategoria").value;
        const imagenCategoria = document.getElementById("imagenMarca").files[0];

        const formData = new FormData();
        formData.append('nombre_categoria', nombreCategoria);
        formData.append('imagen', imagenCategoria);

        const data = await createData("/categorias/save", formData); 
       
        if (data.success) {
            console.log("Categoría agregada exitosamente");
            obtenerCategorias();
            limpiarFormulario();
            $('#marcaModal').modal('hide'); // Cierra el modal de agregar
            setTimeout(function() {
                $('#agregado').modal('show'); // Abre el modal de confirmación después de un segundo
            }, 500);
        } else {
            console.error("Error al agregar categoría:", data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const eliminarCategoria = async (idCategoria) => {
    try {
        const data = await deleteData(`/categorias/delete/${idCategoria}`); 
        
        if (data.success) {
            console.log("Categoría eliminada exitosamente");
            obtenerCategorias();
            $('#eliminar').modal('hide'); // Cierra el modal de eliminar
            setTimeout(function() {
                $('#eliminadoExitosoModal').modal('show'); // Abre el modal de eliminación exitosa después de un segundo
            }, 500);
        } else {
            console.error("Error al eliminar categoría:", data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const actualizar = async (idCategoria) => {
    try {
        const nombreCategoria = document.getElementById("nombreCategoriaActuaizar").value;
        const imagenCategoria = document.getElementById("imagenMarcaActualizar").files[0];
        const formData = new FormData();
        formData.append('id_categoria', idCategoria);
        formData.append('nombre_categoria', nombreCategoria);
        formData.append('imagen', imagenCategoria);

        const data = await updateData("/categorias/update", formData); 
        
        if (data.success) {
            console.log("Categoría actualizada exitosamente");
            obtenerCategorias();
            limpiarFormularioActualizar();
            $('#actualizar').modal('hide'); // Cierra el modal de actualizar
            setTimeout(function() {
                $('#acto').modal('show'); // Abre el modal de confirmación después de un segundo
            }, 500);
        } else {
            console.error("Error al actualizar categoría:", data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};
document.addEventListener("DOMContentLoaded", function () {
    obtenerCategorias();

    let idCategoriaEliminar = null;
    let idCategoriaActualizar = null;

    const categoriaTableBody = document.getElementById("categoriaTableBody");
    categoriaTableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("eliminar")) {
            idCategoriaEliminar = event.target.dataset.id;
            $('#eliminar').modal('show');
        }
        else if (event.target.classList.contains("actualizar")) {
            idCategoriaActualizar = event.target.dataset.id;
            const nombreCategoria = event.target.closest('tr').querySelector('td:first-child').textContent;
            const imagenCategoria = event.target.closest('tr').querySelector('td:nth-child(2) img').src;
            mostrarCategoria(nombreCategoria, imagenCategoria);
            $('#actualizar').modal('show');
        }
    });

    const confirmarEliminarBtn = document.getElementById('confirmarEliminar');
    confirmarEliminarBtn.addEventListener('click', async function () {
        if (idCategoriaEliminar) {
            await eliminarCategoria(idCategoriaEliminar);
            idCategoriaEliminar = null;
        }
    });

    const confirmarActualizarBtn = document.getElementById('confirmarActualizar');
    confirmarActualizarBtn.addEventListener('click', async function () {
        if (idCategoriaActualizar) {
            await actualizar(idCategoriaActualizar);
            idCategoriaActualizar = null;
        }
    });

    const agregarCategoriaBtn = document.getElementById("agregarCategoriaBtn");
    agregarCategoriaBtn.addEventListener("click", agregarCategoria);
});

async function mostrarCategoria(nombreCategoria, imagenCategoria) {
    try {
        document.getElementById("nombreCategoriaActuaizar").value = nombreCategoria;
        const imagenPreview = document.querySelector('.imagede');
        if (imagenPreview) {
            const urlImagen = imagenCategoria;
            imagenPreview.src = urlImagen;
            imagenPreview.style.display = 'block';
        } else {
            console.error("Elemento .imagenPreview1 no encontrado.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}