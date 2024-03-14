let idCategoria = 0;
const myModal1 = new bootstrap.Modal(document.getElementById('actualizar'));
const myModal2 = new bootstrap.Modal(document.getElementById('marcaModal'));
const myModal3 = new bootstrap.Modal(document.getElementById('eliminar'));
const obtenerCategorias = async () => {
    try {
        const data = await fetchData("/categorias");

        if (data.success) {
            const tbody = document.getElementById("tablaBody");
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
            AbrirError();
        }
    } catch (error) {
        AbrirError();
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
            myModal1.show();

            idCategoria = idCategorias;
        }
        else {
            AbrirError();

        }

    } catch (error) {
        AbrirError();
        console.log(error);
    }
};

function AbrirError() {
    const myModal = new bootstrap.Modal(document.getElementById('errorModal'));
    myModal.show();
}

function AbrirAgregar() {
    myModal2.show();
}

const abrirModalEliminar = (idCategorias) => {
    try {
        if (idCategorias !== null) {
            myModal3.show();
            idCategoria = idCategorias;
        }
        else {
            AbrirError();
        }

    } catch (error) {
        AbrirError();
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
            myModal2.hide();
            setTimeout(function () {
                const myModal = new bootstrap.Modal(document.getElementById('agregado'));
                myModal.show();
            }, 500);
        } else {
            AbrirError();
        }
    } catch (error) {
        AbrirError();
    }
};

const eliminarCategoria = async (idCategoria) => {
    try {
        const data = await deleteData(`/categorias/delete/${idCategoria}`);

        if (data.success) {

            obtenerCategorias();

            myModal3.hide();
            setTimeout(function () {
                const myModal = new bootstrap.Modal(document.getElementById('eliminadoExitosoModal'));
                myModal.show();

            }, 500);
        } else {
            AbrirError();
        }
    } catch (error) {
        AbrirError();
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

            myModal1.hide();
            setTimeout(function () {
                const myModal = new bootstrap.Modal(document.getElementById('acto'));
                myModal.show();
            }, 500);
        } else {
            AbrirError();
        }
    } catch (error) {
        AbrirError();
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
            AbrirError();
        }
    } catch (error) {
        AbrirError();
    }
}