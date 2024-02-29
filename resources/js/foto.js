// Vista previa de la imagen seleccionada en el modal de crear
$("#imagenMarca").change(function() {
  readURL(this);
});

// Vista previa de la imagen seleccionada en el modal de actualizar
$("#imagenMarcaActualizar").change(function() {
  readURL(this);
});

function readURL(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
          // Ajustamos para mostrar la vista previa relativa al input
          $(input).closest('.modal-content').find('.preview-image').attr('src', e.target.result).show();
      }
      
      reader.readAsDataURL(input.files[0]); // Convertir a base64 string
  }
}
