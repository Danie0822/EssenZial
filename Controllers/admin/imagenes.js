//Declaración de constantes para uso general
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);

//Modales a usar
const myAgregar = new bootstrap.Modal(obtenerElemento('imagenes'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));

// Obtener el parámetro 'id' de la URL
const urlParams = new URLSearchParams(window.location.search);
const idInventario = urlParams.get('id');

//Funcion para obtener imagenes
const obtenerImagenes = async (idInventario) => {
    try {
        // Verificar si el ID del inventario es válido
        if (!idInventario) {
            console.error("El ID del inventario es inválido.");
            return;
        }

        const { success, data } = await fetchData(`/imagenes/view/${idInventario}`);

        if (success) {
            const tbody = obtenerElemento('tableBody');
            tbody.innerHTML = ''; // Limpiar el contenido actual de la tabla
            // Verificar si hay datos para mostrar
            if (data && data.length > 0) {
                data.forEach(({ id_imagen, ruta_imagen }) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td><img src="${imagen}${ruta_imagen}" alt="Imagen de la categoría" width="50"></td>
                        <td>
                            <button class="btn btn-dark actualizar" onclick="abrirModalEditar(${id_imagen})"><i class="fas fa-edit"></i></button>  
                            <button type="button" class="btn btn-dark" onclick="abrirModalEliminar(${id_imagen})"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                console.error("No se encontraron imágenes para mostrar.");
            }
        } else {
            manejarError();
        }
    } catch (error) {
        console.error("Error al obtener imágenes:", error);
        manejarError();
    }
};

window.onload = () => {
    // Obtener el ID del inventario de la URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams)
    const idInventario = urlParams.get('id');
    // Verificar si idInventario es válido antes de llamar a obtenerImagenes
    if (idInventario) {
        obtenerImagenes(idInventario);
    } else {
        console.error("El ID del inventario es inválido.");
    }
};


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

//Funcion para abrir modal de agregar
function abrirAgregar() {
    abrirModal(myAgregar);
}

// Const para limpiar formulario 
const limpiarFormulario = () => {
    document.querySelectorAll('.preview-image-agregar').forEach(image => image.style.display = 'none');
}

const agregarImagenes = async () => {
    try {
        const idInven = idInventario;
        const imagenes = obtenerElemento("imagenes_agregar").files; // Obtener todas las imágenes seleccionadas

        if (imagenes.length !== 4) {
            // Verificar que se hayan seleccionado exactamente 4 imágenes
            console.error("Por favor selecciona exactamente 4 imágenes.");
            return;
        }

        // Array para almacenar los datos de todas las imágenes
        const imagenesDataArray = [];

        // Agregar cada imagen al array de datos
        for (let i = 0; i < imagenes.length; i++) {
            const imagenData = new FormData();
            imagenData.append('imagen', imagenes[i]);
            imagenData.append('id_inventario', idInven);
            imagenesDataArray.push(imagenData);

            const success = await createData("/imagenes/save", imagenData);
        }


    } catch (error) {
        // Manejar errores generales
        console.error("Error durante el proceso:", error);
        manejarError();
    }
};

const actualizarImagenes = async() =>{
    try{


    }catch(error){

    }

};

document.addEventListener("DOMContentLoaded", function () {
    // Obtener cuando recarga pagina 
    obtenerImagenes();
    // Variable de Eliminar
    /*
    const confirmarEliminarBtn = obtenerElemento('confirmarEliminarBtn');
    confirmarEliminarBtn.addEventListener('click', async () => {
        // Validacion del id 
        if (idCategoria) {
            await eliminarCategoria(idCategoria);
            idCategoria = null;
        }
    });
    // Variable de Actualizar
    const confirmarActualizarBtn = obtenerElemento('actualizarImagenesBtn');
    confirmarActualizarBtn.addEventListener('click', async () => {
        // Validacion del id
        if (idCategoria) {
            await actualizar(idCategoria);
            idCategoria = null;
        }
    });*/
    // Variable de Agregar
    const agregarCategoriaBtn = obtenerElemento("agregarImagenBtn");
    agregarCategoriaBtn.addEventListener('click', async () => {
        await agregarImagenes();
    });
});

const mostrarImagen = (ruta_imagen) =>{
    try{
        limpiarFormularioActualizar();
        const imagenPreview = document.querySelector('imagede');
        if(imagenPreview){
            const url = ruta_imagen;
            imagenPreview.src = url;
            imagenPreview.style.display = 'block';
        }else{
            manejarError();
        }
    }catch(error){
        manejarError();
    }

}

