function loadFooter(){
    var footerContent = `        
    <div class="container-fluid foot">
    <div class="row">
        <div class="col-lg-4 col-sm-12 columnas">
            <h3>Ayuda</h3>
            <a href="../../Views/public/contactanos.html#form" class="link-no-underline"><p>Contáctanos</p></a>
            <a href="../../Views/public/terminos_codiciones.html#devoluciones" class="link-no-underline"><p>Devoluciones y reembolsos</p></a> 
            <a href="../../Views/public/terminos_codiciones.html" class="link-no-underline"><p>Términos y condiciones</p></a>

        </div>
        <div class="col-lg-4 col-sm-12 columnas">
            <h3>Acerca de nosotros</h3>
            <a href="../../Views/public/quienes_somos.html#info" class="link-no-underline"> <p>Acerca de EssenZial</p></a>
            <a href="#" class="link-no-underline"> <p>Blog</p></a>
            <a href="../../Views/public/quienes_somos.html#descripcion" class="link-no-underline"> <p>Quiénes somos</p></a>
            

        </div>
        <div class="col-lg-4 col-sm-12 columnas text-center">
            <button type="button" class="btn btn-outline-secondary boton"><a href="https://www.facebook.com"><i class="fa-brands fa-facebook"></i></a></button>
            <button type="button" class="btn btn-outline-secondary boton"><a href="https://www.instagram.com"><i class="fa-brands fa-instagram"></i></a></button>
            <button type="button" class="btn btn-outline-secondary boton"><a href="https://www.google.com/intl/es/gmail/about/"><i class="fa-solid fa-envelope"></i></a></button>
        </div>
    </div>
    <div class="row">
        <div class="col text-center copy">
            <h6>Copyright © 2024 Essenzial. Todos los derechos reservados.</h6>
        </div>
    </div>

</div>`
var footer = document.querySelector("footer");
footer.innerHTML = footerContent + footer.innerHTML;

};

document.addEventListener("DOMContentLoaded", loadFooter);



function loadHeader(){
    var headerContent = `    <nav class="navbar navbar-expand-lg navbar-light">
    <a class="navbar-brand" href="../../Views/public/homepage.html">
        <img src="../../resources/img/icono.png" width="30" height="30" class="d-inline-block align-top" alt="">
        EssenZial
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
        <div class="navbar-nav">
            <a class="nav-link" href="../../Views/public/lista_productos.html">Hombre <span class="sr-only">(current)</span></a>
            <a class="nav-link" href="../../Views/public/lista_mujeres.html">Mujer</a>
            <a class="nav-link" href="../../Views/public/lista_ninos.html">Niños</a>
            <a class="nav-link" href="../../Views/public/lista_unisex.html">Unisex</a>
            <button class="btn btn-sm bg-light peque " type="button">
                <a class="navbar-brand align-items-center justify-content-center" href="../../Views/public/pedidos.html">
                <i class="fa-regular fa-user fa-xs"></i>
                </a>
            </button>
            <button class="btn btn-sm bg-light peque text-center" type="button" id="boton">
                <a class="navbar-brand" href="../public/carrito.html">
                <i class="fa-solid fa-cart-shopping fa-xs"></i>
                </a>
            </button>
        </div>
    </div>
</nav>`

var header = document.querySelector("header");
header.innerHTML = headerContent + header.innerHTML;
};

document.addEventListener("DOMContentLoaded" ,loadHeader);




