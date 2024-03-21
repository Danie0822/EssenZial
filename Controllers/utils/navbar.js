
    // Obtenemos la URL de la página actual
    var currentPageUrl = window.location.href;

    // Obtenemos todos los enlaces del menú en el navbar
    var menuLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Iteramos sobre cada enlace del menú
    menuLinks.forEach(function(link) {
        // Comparamos la URL del enlace con la URL de la página actual
        if (link.href === currentPageUrl) {
            // Agregamos la clase 'active' al enlace correspondiente
            link.classList.add('active');
        }
    });
