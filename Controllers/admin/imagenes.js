//Declaración de constantes para uso general
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);

//Modales a usar
const myAgregar = new bootstrap.Modal(obtenerElemento('imagenes'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const myActualizar = new bootstrap.Modal(obtenerElemento('imagenesAc'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminar'));

// Obtener el parámetro 'id' de la URL
//const urlParams = new URLSearchParams(window.location.search);
//const idInventario = urlParams.get('id');
const idInventario = sessionStorage.getItem("id_inventario");
let idImagen = null;

//Funcion para obtener imagenes
const obtenerImagenes = async () => {
    try {
        const { success, data } = await fetchData(`/imagenes/${idInventario}`);
        const tbody = obtenerElemento('tableBody');
        tbody.innerHTML = '';

        if (success) {
            // Obtener un array de los valores de data
            const imagenes = Object.values(data);

            imagenes.forEach(({ id_imagen, ruta_imagen }) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${imagen}${ruta_imagen}" alt="Imagen de la categoría" width="50"></td>
                    <td>
                        <button class="btn btn-dark actualizar" onclick="abrirModalAc(${id_imagen},'http://localhost:4000/${ruta_imagen}')"><i class="fas fa-edit"></i></button>  
                        <button type="button" class="btn btn-dark" onclick="abrirModalEliminar(${id_imagen})"><i class="fas fa-trash-alt"></i> </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            manejarError();
        }
    }
    catch (error) {
        console.log(error);
        manejarError();
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
    document.querySelectorAll('.imageAc').forEach(image => image.style.display = 'none');
}

// Const para limpiar formulario 
const limpiarFormulario = () => {
    document.querySelectorAll('.preview-image-agregar').forEach(image => image.style.display = 'none');
}

//Funcion para abrir modal de agregar
function abrirAgregar() {
    abrirModal(myAgregar);
}

//Funcion para agregar las imagenes de ese inventario
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
            if(!validaciones.validarImagen(imagenes[i])){
                abrirModal(obtenerElemento('error'));
            } 
            else{
                const imagenData = new FormData();
                imagenData.append('imagen', imagenes[i]);
    
                imagenData.append('id_inventario', idInven);
                imagenesDataArray.push(imagenData);
    
                const success = await createData("/imagenes/save", imagenData);
            }
           
        }


    } catch (error) {
        // Manejar errores generales
        console.error("Error durante el proceso:", error);
        manejarError();
    }
};

const abrirModalAc = (idImagenes, imagen) => {
    if (idImagenes) {
        mostrarImagen(imagen);
        idImagen = idImagenes;
        abrirModal(myActualizar);
    }
    else {
        manejarError();
    }
}

//Funcion para actualizar cada imagen
const actualizarImagenes = async (idImagen) => {
    try {
        const imagen = obtenerElemento("imagen_actualizar").files[0];
        
        if(!validaciones.validarImagen(imagen)){
            abrirModal(obtenerElemento('error'));
        }
        const formData = new FormData();
        formData.append("id_imagen", idImagen);
        formData.append("imagen", imagen);
        formData.append("id_inventario", idInventario);
        const { success } = await updateData("/imagenes/update", formData);

        if (success) {

            obtenerImagenes();
            limpiarFormularioActualizar();
            cerrarModal(myActualizar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento("actualizado"))), 500);
        } else {
            manejarError();
        }

    } catch (error) {
        console.log(error);
        manejarError();
    }
};

const abrirModalEliminar = (idImagenes) => {
    if (idImagenes) {
        idImagen = idImagenes;
        abrirModal(myEliminar);
    } else {
        manejarError();
    }

}

const eliminarImagenes = async (idImagen) => {
    try {
        const { success } = await deleteData(`/imagenes/delete/${idImagen}`);
        if (success) {
            obtenerImagenes();
            cerrarModal(myEliminar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('eliminadoModal'))));
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }

};

document.addEventListener("DOMContentLoaded", function () {
    // Obtener cuando recarga pagina 
    obtenerImagenes();
    // Variable de Eliminar

    const confirmarEliminarBtn = obtenerElemento('eliminarBtn');
    confirmarEliminarBtn.addEventListener('click', async () => {
        // Validacion del id 
        if (idImagen) {
            await eliminarImagenes(idImagen);
            idImagen = null;
        }
    });
    // Variable de Actualizar
    const confirmarActualizarBtn = obtenerElemento('actualizarImagenesBtn');
    confirmarActualizarBtn.addEventListener('click', async () => {
        // Validacion del id
        if (idImagen) {
            await actualizarImagenes(idImagen);
            idImagen = null;
        }
    });
    // Variable de Agregar
    const agregarCategoriaBtn = obtenerElemento("agregarImagenBtn");
    agregarCategoriaBtn.addEventListener('click', async () => {
        await agregarImagenes();
    });
});

const mostrarImagen = (imagen) => {
    try {
        limpiarFormularioActualizar();
        const imagenPreview = document.querySelector('.imageAc');
        if (imagenPreview) {
            const url = imagen;
            imagenPreview.src = url;
            imagenPreview.style.display = 'block';
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
}
