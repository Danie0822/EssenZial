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

// Ahora puedes usar idInventario como desees en esta página
//console.log("ID del inventario:", idInventario);

//Funcion para obtener imagenes
const obtenerImagenes = async ()=>{
    try {
        const { success, data } = await fetchData('/imagenes');
        const tbody = obtenerElemento('tableBody');
        tbody.innerHTML = '';

        if (success) {
            data.forEach(({ id_imagen, ruta_imagen }) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    
                    <td><img src="${imagen}${imagen_categoria}" alt="Imagen de la categoría" width="50"></td>
                    <td>${ruta_imagen}</td>
                    <td>

                    <button class="btn btn-dark actualizar" onclick="abrirModalEditar(${id_imagen})"><i class="fas fa-edit"></i></button>  
                    <button type="button" class="btn btn-dark" onclick="abrirModalVer(${id_imagen})"><i class="fas fa-info-circle"></i></button>
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
        manejarError();
    }
}

function abrirAgregar(){
    abrirModal(myAgregar);
}

// Const para limpiar formulario 
const limpiarFormulario = () => {
    document.querySelectorAll('.preview-image-agregar').forEach(image => image.style.display = 'none');
}

const agregarImagenes = async () => {
    try {
        const imagenes = obtenerElemento("imagenes_agregar").files; // Obtener todas las imágenes seleccionadas
    
        if (imagenes.length !== 4) {
            // Verificar que se hayan seleccionado exactamente 4 imágenes
            alert("Por favor selecciona exactamente 4 imágenes.");
            return;
        }
    
        const formData = new FormData();
    
        // Agregar cada imagen al formData
        for (let i = 0; i < imagenes.length; i++) {
            formData.append('imagenes', imagenes[i]); // Ajusta 'imagenes' al nombre correcto del campo en el servidor
        }
    
        formData.append('id_inventario', idInventario); // Agregar el ID del inventario
    
        // Realizar la solicitud de inserción de imágenes
        const response = await fetch("/api/imagenes/save", {
            method: 'POST',
            body: formData
        });
    
        if (response.ok) {
            obtenerImagenes();
            limpiarFormulario();
            cerrarModal(myAgregar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('agregado'))), 500);
        } else {
            // Manejar errores de la solicitud
            const errorMessage = await response.text();
            console.error("Error en la solicitud:", errorMessage);
            manejarError();
        }
    } catch (error) {
        // Manejar errores generales
        console.error("Error durante el proceso:", error);
        manejarError();
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







