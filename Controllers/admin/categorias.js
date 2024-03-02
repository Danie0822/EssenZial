

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
                        <button class="btn btn-danger eliminar" data-id="${categoria.id_categoria}" data-toggle="modal" data-target="#eliminar">Eliminar</button>
                        <button class="btn btn-danger actualizar" data-id="${categoria.id_categoria}" data-toggle="modal" data-target="#actualizar">Actualizar</button>
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
        } else {
            console.error("Error al actualizar categoría:", data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};
document.addEventListener("DOMContentLoaded", function () {
    obtenerCategorias();

    const categoriaTableBody = document.getElementById("categoriaTableBody");
    categoriaTableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("eliminar")) {
            const idCategoria = event.target.dataset.id;
            const confirmarEliminarBtn = document.getElementById('confirmarEliminar');
            confirmarEliminarBtn.addEventListener('click', async function () {
                eliminarCategoria(idCategoria);
            });
        }
        else if (event.target.classList.contains("actualizar")) {
            const idCategoria = event.target.dataset.id;
            const nombreCategoria = event.target.closest('tr').querySelector('td:first-child').textContent;
            const imagenCategoria = event.target.closest('tr').querySelector('td:nth-child(2) img').src;
            mostrarCategoria(nombreCategoria, imagenCategoria);
            const confirmarActualizarBtn = document.getElementById('confirmarActualizar');
            confirmarActualizarBtn.addEventListener('click', async function () {
                actualizar(idCategoria);
            });
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