// Seleccionar la clase "navbarGamas" en el HTML
var navbarGamas = document.querySelector('.navbarGamas');

// Crear el elemento nav con las clases proporcionadas
var nav = document.createElement('nav');
nav.className = 'navbar navbar-expand-lg navbar-light bg-light subnav';

// Crear el elemento div con la clase "container"
var container = document.createElement('div');
container.className = 'container';

// Crear el botón de la barra de navegación
var button = document.createElement('button');
button.className = 'navbar-toggler';
button.setAttribute('type', 'button');
button.setAttribute('data-toggle', 'collapse');
button.setAttribute('data-target', '#navbarSupportedContent');
button.setAttribute('aria-controls', 'navbarSupportedContent');
button.setAttribute('aria-expanded', 'false');
button.setAttribute('aria-label', 'Toggle navigation');

// Crear el icono del botón de la barra de navegación
var span = document.createElement('span');
span.className = 'navbar-toggler-icon';
button.appendChild(span);

// Añadir el botón al contenedor
container.appendChild(button);

// Crear el div con la clase "collapse navbar-collapse" y el id "navbarSupportedContent"
var divCollapse = document.createElement('div');
divCollapse.className = 'collapse navbar-collapse';
divCollapse.setAttribute('id', 'navbarSupportedContent');

// Crear la lista ul con la clase "navbar-nav mr-auto"
var ul = document.createElement('ul');
ul.className = 'navbar-nav mr-auto';

// Array de elementos de la lista
var listItems = [
    '<li class="nav-item"><a class="nav-link" href="./administrador.html" >Administrador</a></li>',
    '<li class="nav-item"><a class="nav-link" href="./clientes.html" >Clientes</a></li>'
];

// Recorrer el array de elementos de la lista y crear los elementos correspondientes
listItems.forEach(function(item) {
    var li = document.createElement('li');
    li.innerHTML = item;
    ul.appendChild(li);
});

// Añadir la lista ul al div con la clase "collapse navbar-collapse"
divCollapse.appendChild(ul);

// Añadir el div con la clase "collapse navbar-collapse" al contenedor
container.appendChild(divCollapse);

// Añadir el contenedor al elemento nav
nav.appendChild(container);

// Insertar el nav después de la div con la clase "navbarGamas" en el HTML
navbarGamas.insertAdjacentElement('afterend', nav);
