let idCategoria = 0;

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
                        <button class="btn btn-dark eliminar" onclick="abrirModalEliminar(${categoria.id_categoria})"><i
                        class="fas fa-trash-alt"></i></button>
                        <button class="btn btn-dark actualizar" onclick="abrirModalEditar(${categoria.id_categoria}, '${categoria.nombre_categoria}', 'http://localhost:4000${categoria.imagen_categoria.replace('/uploads', '')}')"><i
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

const abrirModalEditar = (idCategorias, nombreCategoria, imagen) => {
    try {
        if (idCategorias !== null) {
            mostrarCategoria(nombreCategoria, imagen);
            $('#actualizar').modal('show');

            idCategoria = idCategorias;
        }
        else {
            abirError();

        }

    } catch (error) {
        abirError();
    }
};

function abirError() {
    $('#errorModal').modal('show');
}

const abrirModalEliminar = (idCategorias) => {
    try {
        if (idCategorias !== null) {
            $('#eliminar').modal('show');
            idCategoria = idCategorias;
        }
        else {
            abirError();
        }

    } catch (error) {
        abirError();
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

            obtenerCategorias();
            limpiarFormulario();
            $('#marcaModal').modal('hide'); // Cierra el modal de agregar
            setTimeout(function () {
                $('#agregado').modal('show'); // Abre el modal de confirmación después de un segundo
            }, 500);
        } else {
            abirError();
        }
    } catch (error) {
        abirError();
    }
};

const eliminarCategoria = async (idCategoria) => {
    try {
        const data = await deleteData(`/categorias/delete/${idCategoria}`);

        if (data.success) {
            
            obtenerCategorias();
            $('#eliminar').modal('hide'); // Cierra el modal de eliminar
            setTimeout(function () {
                $('#eliminadoExitosoModal').modal('show'); // Abre el modal de eliminación exitosa después de un segundo
            }, 500);
        } else {
            abirError();
        }
    } catch (error) {
        abirError();
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
           
            obtenerCategorias();
            limpiarFormularioActualizar();
            $('#actualizar').modal('hide'); // Cierra el modal de actualizar
            setTimeout(function () {
                $('#acto').modal('show'); // Abre el modal de confirmación después de un segundo
            }, 500);
        } else {
            abirError();
        }
    } catch (error) {
        abirError();
    }
};
document.addEventListener("DOMContentLoaded", function () {
    obtenerCategorias();

    const confirmarEliminarBtn = document.getElementById('confirmarEliminar');
    confirmarEliminarBtn.addEventListener('click', async function () {
        if (!idCategoria == 0) {
            await eliminarCategoria(idCategoria);
            idCategoria = null;
        }
    });

    const confirmarActualizarBtn = document.getElementById('confirmarActualizar');
    confirmarActualizarBtn.addEventListener('click', async function () {
        if (!idCategoria == 0) {
            await actualizar(idCategoria);
            idCategoria = null;
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