// Seleccionar la clase "menu" en el HTML
var menu = document.querySelector('.menu');

// Crear el elemento nav y añadirle las clases necesarias
var nav = document.createElement('nav');
nav.className = 'col-lg-2 col-md-3 bg-light';

// Crear el elemento div con la clase "sidebar-sticky"
var sidebarSticky = document.createElement('div');
sidebarSticky.className = 'sidebar-sticky';

// Crear la lista ul con la clase "nav flex-column"
var ul = document.createElement('ul');
ul.className = 'nav flex-column';
const nombre_admins = sessionStorage.getItem("nombre_admin");
// Array de elementos de la lista
var listItems = [
    '<li><a class="nav-link" href="#" id="text-tittle">Essenzial</a></li>',
    '<li><img src="../../resources/img/icono.png" class="img-fluid mx-auto d-block mt-3 mb-3" alt="..." style="max-width: 100px; height: auto;"></li>',
    '<li><div class="text-center"><h5></h5></div></li>',
    '<li class="nav-item"><a class="nav-link" href="./dashboard.html"><img src="../../resources/img/home.png" width="25" height="25" class="d-inline-block align-top" alt="">Inicio</a></li>',
    '<li class="nav-item"><a class="nav-link" href="./marcas.html" ><img src="../../resources/img/gamas.png" width="30" height="30" class="d-inline-block align-top" alt="">Gamas</a></li>',
    '<li class="nav-item"><a class="nav-link" href="./inventario.html" ><img src="../../resources/img/inventario.png" width="30" height="30" class="d-inline-block align-top" alt="">Inventario</a></li>',
    '<li class="nav-item"><a class="nav-link" href="./pedido.html"><img src="../../resources/img/pedidos.png" width="30" height="30" class="d-inline-block align-top" alt="">Pedidos</a></li>',
    '<li class="nav-item"><a class="nav-link" href="./administrador.html"><img src="../../resources/img/usuarios.png" width="30" height="30" class="d-inline-block align-top" alt="">Usuarios</a></li>',
    '<li class="nav-item" id="out-item"><a class="nav-link" href="./index.html"><img src="../../resources/img/salir.png" width="30" height="30" class="d-inline-block align-top" alt="">Salir</a></li>'
];

// Recorrer el array de elementos de la lista y crear los elementos correspondientes
listItems.forEach(function(item) {
    var li = document.createElement('li');
    li.innerHTML = item;
    ul.appendChild(li);

    // Si el elemento actual contiene un h5, insertar el valor de nombre_admins
    if (li.querySelector('h5')) {
        li.querySelector('h5').textContent = nombre_admins;
    }
});

// Añadir la lista ul al div con la clase "sidebar-sticky"
sidebarSticky.appendChild(ul);

// Añadir el div con la clase "sidebar-sticky" al nav
nav.appendChild(sidebarSticky);

// Insertar el nav después de la div con la clase "menu" en el HTML
menu.insertAdjacentElement('afterend', nav);
