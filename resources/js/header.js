function loadHeader() {
    var headerContent = `
    <div class="container-fluid">
      <div class="row">
        <nav class="col-2 bg-light">
          </button>
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <!-- Aquí va tu contenido de menú -->
              <li>
                <a class="nav-link" href="#" id="text-tittle">
                  <img src="../../resources/img/icono.png" width="50" height="50" class="d-inline-block align-top" alt="">
                  Essenzial
                </a>
              </li>
              <li>
                <img src="../../resources/img/pp.jpeg" class="img-fluid mx-auto d-block" alt="..." width="100px" height="150px">
              </li>
              <li>
                <div class="text-center">
                  <h5>Alessandro Morales</h5>
                </div>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="../../Views/public/homepage.html">
                  <img src="../../resources/img/home.png" width="25" height="25" class="d-inline-block align-top" alt="">
                  Inicio
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <img src="../../resources/img/gamas.png" width="30" height="30" class="d-inline-block align-top" alt="">
                  Gamas
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <img src="../../resources/img/inventario.png" width="30" height="30" class="d-inline-block align-top" alt="">
                  Inventario
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <img src="../../resources/img/pedidos.png" width="30" height="30" class="d-inline-block align-top" alt="">
                  Pedidos
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <img src="../../resources/img/usuarios.png" width="30" height="30" class="d-inline-block align-top" alt="">
                  Usuarios
                </a>
              </li>
              <li class="nav-item" id="out-item">
                <a class="nav-link" href="#">
                  <img src="../../resources/img/salir.png" width="30" height="30" class="d-inline-block align-top" alt="">
                  Salir
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    `;

    // Insertar el contenido del encabezado antes del contenido principal dentro de <main>
    var main = document.querySelector("main");
    main.innerHTML = headerContent + main.innerHTML;
}

document.addEventListener("DOMContentLoaded", loadHeader);
