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

