var imagenesAgregar = document.getElementById('imagenes_agregar');
if (imagenesAgregar) {
    imagenesAgregar.addEventListener('change', function () {
        readURLs(this, 'preview-image-agregar');
    });
}

//Funcion que nos ayuda a adjuntar 4 imagenes de un solo y mostrar su vista previa
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
        alert("Por favor selecciona exactamente 4 imágenes.");
        input.value = ''; // Limpiar el input de archivo
    }
}

