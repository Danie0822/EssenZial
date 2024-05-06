
// Evento de cambio para el input de imágenes para agregar
var imagenesAgregar = document.getElementById('imagenes_agregar');
if (imagenesAgregar) {
    imagenesAgregar.addEventListener('change', function () {
        readURLs(this, 'preview-image-agregar');
    });
}

// Evento de cambio para el input de imagen para actualizar
var imagenActualizar = document.getElementById('imagen_actualizar');
if (imagenActualizar) {
    imagenActualizar.addEventListener('change', function() {
        readURL2(this, 'preview-image-actualizar'); // Usamos la función readURL2 para la actualización
    });
}

// Función para mostrar la vista previa de las imágenes
function readURLs(input, previewClass) {
    if (input.files && input.files.length === 4) {
        for (var i = 0; i < input.files.length; i++) {
            (function(index) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    // Obtener la imagen correspondiente
                    var img = document.querySelector('.' + previewClass + ':nth-of-type(' + (index + 1) + ')');
                    // Asignar la vista previa de la imagen
                    img.setAttribute('src', e.target.result);
                    img.style.display = 'block';
                }
                reader.readAsDataURL(input.files[index]); // Convertir a base64 string
            })(i);
        }
    } else {
        manejarImagenes();
        input.value = ''; // Limpiar el input de archivo
    }
}

// Función para mostrar la vista previa de la imagen para actualizar
function readURL2(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // Ajustamos para mostrar la vista previa relativa al input
            input.closest('.modal-content').querySelector('.preview-image-actualizar').setAttribute('src', e.target.result);
            input.closest('.modal-content').querySelector('.preview-image-actualizar').style.display = 'block';
        }
        
        reader.readAsDataURL(input.files[0]); // Convertir a base64 string
    }
}

