// Obtener el input de la imagen para crear
var imagenMarca = document.getElementById('imagenMarca');
if (imagenMarca) {
    imagenMarca.addEventListener('change', function() {
        readURL(this);
    });
}

// Obtener el input de la imagen para actualizar
var imagenMarcaActualizar = document.getElementById('imagenMarcaActualizar');
if (imagenMarcaActualizar) {
    imagenMarcaActualizar.addEventListener('change', function() {
        readURL(this);
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // Ajustamos para mostrar la vista previa relativa al input
            input.closest('.modal-content').querySelector('.preview-image').setAttribute('src', e.target.result);
            input.closest('.modal-content').querySelector('.preview-image').style.display = 'block';
        }

        reader.readAsDataURL(input.files[0]); // Convertir a base64 string
    }
}
