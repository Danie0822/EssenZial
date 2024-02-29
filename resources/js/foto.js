  // Vista previa de la imagen seleccionada
  $("#imagenMarca").change(function() {
    readURL(this);
  });

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        $('#imagenPreview').attr('src', e.target.result).show();
      }
      
      reader.readAsDataURL(input.files[0]); // Convertir a base64 string
    }
  }