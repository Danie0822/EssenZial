function loadFooter(){
    var footerContent = `        
    <div class="container-fluid foot">
    <div class="row">
        <div class="col-lg-4 col-sm-12 columnas">
            <h3>Ayuda</h3>
            <a href="#" class=""><p>Contáctanos</p></a>
            <a href="#"><p>Devoluciones y reembolsos</p></a> 
            <a href="#"><p>Términos y condiciones</p></a>

        </div>
        <div class="col-lg-4 col-sm-12 columnas">
            <h3>Acerca de nosotros</h3>
            <a href="#"> <p>Acerca de EssenZial</p></a>
            <a href="#"> <p>Blog</p></a>
            <a href="#"> <p>Quiénes somos</p></a>

        </div>
        <div class="col-lg-4 col-sm-12 columnas text-center">
            <button type="button" class="btn btn-outline-secondary boton"><i class="fa-brands fa-facebook"></i></button>
            <button type="button" class="btn btn-outline-secondary boton"><i class="fa-brands fa-instagram"></i></button>
            <button type="button" class="btn btn-outline-secondary boton"><i class="fa-solid fa-envelope"></i></button>
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
    var headerContent = `        <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">
            <img src="../../resources/img/icono.png" width="30" height="30" class="d-inline-block align-top"
                alt="">
            EssenZial
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="d-flex">
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Hombres</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Mujer</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Niños</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Unisex</a>
                    </li>
                </ul>
                <button class="btn btn-sm bg-light peque" type="button">
                    <a class="navbar-brand" href="../public/index.html">
                        <img src="../../resources/img/icons8-usuario-32.png" alt=""
                            class="d-inline-block align-text-top" id="image">
                    </a>
                </button>
                <button class="btn btn-sm bg-light peque" type="button" id="boton">
                    <a class="navbar-brand" href="../public/index.html">
                        <img src="../../resources/img/carrito.png" alt="" class="d-inline-block align-text-top"
                            id="image">
                    </a>
                </button>
            </div>
        </div>
    </div>
</nav>`

var header = document.querySelector("header");
header.innerHTML = headerContent + header.innerHTML;
};

document.addEventListener("DOMContentLoaded" ,loadHeader);



