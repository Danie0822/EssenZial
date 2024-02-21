$(document).ready(function(){
    $('.nav-link').click(function(e){
      e.preventDefault(); // Evita la acción predeterminada del enlace
      
      var targetUrl = $(this).attr('href'); // Obtiene la URL de destino desde el atributo href
      
      // Realiza la solicitud AJAX para cargar la página HTML
      $.ajax({
        url: targetUrl,
        success: function(response) {
          $('#contenido-dinamico').html(response); // Inserta el contenido de la página cargada en el contenedor principal
        },
        error: function() {
          alert('Error al cargar la página.');
        }
      });
    });
  });

