
function loadNav(){
    var navContent = `<div class="col-lg-2 col-md-12 col-cm-12">
    <div class="div1">
        <h4 class="titulo">
            Hola Adriana
        </h4>
        <p class="det">Bienvenido a tu cuenta</p>
    </div>
    <ul class="nav flex-column nav-lateral">
        <li class="nav-item">
            <a class="nav-link" aria-current="page" href="#"><i class="fa-solid fa-bag-shopping"></i>Mis
                pedidos</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#"><i class="fa-solid fa-user"></i>Mi cuenta</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#"><i class="fa-solid fa-star"></i>Reseñas</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" aria-disabled="true"> <i
                    class="fa-solid fa-right-from-bracket"></i>Cerrar sesión</a>
        </li>
    </ul>
</div>`
var nav = document.querySelector(".row");
nav.innerHTML = navContent + nav.innerHTML

};
document.addEventListener("DOMContentLoaded", loadNav);