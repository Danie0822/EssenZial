const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarValidaciones = () => abrirModal(validationsModal);

let validationsModal; // Declarar la variable fuera
let productoPrecio; 
// Funcion para generar las valoraciones
const generarEstrellas = (valoracion) => {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= valoracion) {
            estrellas += '<i class="fas fa-star text-warning"></i>';
        } else {
            estrellas += '<i class="fas fa-star text-muted"></i>';
        }
    }
    return estrellas;
};

// Funcion para obtener el producto
const obtenerProducto = async () => {
    try {
        const id_producto = sessionStorage.getItem("id_producto");
        const { success, data } = await fetchData(`/public/producto/${id_producto}`);
        const recienAgregados = document.getElementById("producto_inicio");

        if (success) {
            recienAgregados.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas

            data.forEach(({ titulo_perfume, valoracion_calculada, precio, unidades_disponibles, primera_imagen }) => {
                productoPrecio = precio;
                const recienAgregadosCard = `
                <div class="col-md-6">
                    <!-- Imagen del producto -->
                    <img src="${imagen}${primera_imagen}" class="imagen" alt="Imagen del producto">
                </div>
                <div class="col-md-6">
                    <!-- Título y descripción del producto -->
                    <h2>${titulo_perfume}</h2>
                    
                    <!-- Valoración -->
                    <div class="mb-3">
                        <span>Valoración:</span>
                        <!-- Estrellas generadas dinámicamente -->
                        ${generarEstrellas(valoracion_calculada)}
                    </div>

                    <!-- Precio y cantidad -->
                    <div class="input-group mb-3">
                        <input type="text" class="form-control"  placeholder="$ ${precio}" aria-label="Disabled input example" disabled>
                        <input type="number" class="form-control" id="cantidad" placeholder="Cantidad">
                    </div>

                    <!-- Disponibilidad -->
                    <p>Disponibilidad: ${unidades_disponibles}</p>

                    <!-- Botón de añadir al carrito -->
                    <a type="button" onclick ="agregarCarrito()" class="btn btn-dark"><i class="fas fa-shopping-cart"></i> Añadir al Carrito</a>
                    
                
                </div>
                `;
                recienAgregados.innerHTML += recienAgregadosCard;
            });

        } else {
            manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};

// Funcion para obtener el detalle del producto
const obtenerDetalle = async () => {
    try {
        const id_producto = sessionStorage.getItem("id_producto");
        const { success, data } = await fetchData(`/public/producto/detalle/${id_producto}`);
        const recienAgregados = document.getElementById("detalle");

        if (success) {
            recienAgregados.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas

            data.forEach(({ descripcion_producto, marca, categoria, aroma }) => {
                const recienAgregadosCard = `
                <!-- Descripción Detallada -->
                <div class="description mt-4">
                    <h3 class="titulo">Descripción</h3>
                    <p>
                    ${descripcion_producto}
                    </p>
                </div>
                <!-- Diseño de Marca, Categoría y Aroma -->
                <div class="marca-categoria-aroma text-center">
                    <div class="row">
                        <div class="col-md-4">
                            <i class="fas fa-gem fa-3x text-warning"></i>
                            <h4>Marca</h4>
                            <p>${marca}</p>
                        </div>
                        <div class="col-md-4">
                            <i class="fas fa-tags fa-3x text-danger"></i>
                            <h4>Categoría</h4>
                            <p>${categoria}</p>
                        </div>
                        <div class="col-md-4">
                            <i class="fas fa-flask fa-3x text-primary"></i>
                            <h4>Aroma</h4>
                            <p>${aroma}</p>
                        </div>
                    </div>
                </div>
                
                `;
                recienAgregados.innerHTML += recienAgregadosCard;
            });

        } else {
            manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};
// Funcion para obtener las demas imagenes
const obtenerImagenes = async () => {
    try {
        const id_producto = sessionStorage.getItem("id_producto");
        const { success, data } = await fetchData(`/public/producto/imagenes/${id_producto}`);
        const recienAgregados = document.getElementById("imagenes");

        if (success) {
            recienAgregados.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas

            data.forEach(({ imagenes }) => {
                const imagenesArray = imagenes.split(', '); // Separar las URLs de las imágenes
                let carouselItems = '';
                
                imagenesArray.forEach((imagenes, index) => {
                    carouselItems += `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${imagen}${imagenes}" class="d-block w-100" alt="Imagen ${index + 1}">
                        </div>
                    `;
                });

                const recienAgregadosCard = `
                    <!-- Imágenes rotativas -->
                    <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            ${carouselItems}
                        </div>
                        <!-- Controles del carousel -->
                        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Anterior</span>
                        </a>
                        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Siguiente</span>
                        </a>
                    </div>
                `;

                recienAgregados.innerHTML += recienAgregadosCard;
            });

        } else {
            manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};

// Funcion para obtener las valoraciones
const obtenerValoraciones = async () => {
    try {
        const id_producto = sessionStorage.getItem("id_producto");
        const { success, data } = await fetchData(`/public/producto/valoraciones/${id_producto}`);
        const recienAgregados = document.getElementById("valoraciones");

        if (success) {
            recienAgregados.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas

            data.forEach(({ nombre_cliente, calificacion_producto, comentario_producto }) => {
                const recienAgregadosCard = `
                <div class="d-flex flex-row justify-content-start flex-wrap scrollable">
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">${nombre_cliente}</h5>
                                <div class="mb-3">
                                    <!-- Ejemplo de estrellas -->
                                    ${generarEstrellas(calificacion_producto)}
                                </div>
                                <p class="card-text">${comentario_producto}</p>
                            </div>
                        </div>
                    </div>
                
                `;
                recienAgregados.innerHTML += recienAgregadosCard;
            });

        } else {
            manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};

// Funcion para obtener las valoraciones
const obtenerProdcutoSimilares = async () => {
    try {
        const id_producto = sessionStorage.getItem("id_producto");
        const { success, data } = await fetchData(`/public/producto/similares/${id_producto}`);
        const recienAgregados = document.getElementById("similares");

        if (success) {
            recienAgregados.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas

            data[0].forEach(({ nombre_producto, primera_imagen_producto, precio_producto }) => {
                console.log(nombre_producto, primera_imagen_producto, precio_producto);
                const recienAgregadosCard = `
                <div class="product-item">
                        <img src="${imagen}${primera_imagen_producto}"
                            class="rounded mx-auto d-block" alt="Perfume Similar 1">
                        <div class="product-info">
                            <h5>${nombre_producto}</h5>
                            <p class="product-price">Precio: $${precio_producto}</p>
                        </div>
                    </div>

                `;
                recienAgregados.innerHTML += recienAgregadosCard;
            });

        } else {
            manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};
// Funcion para obtener las valoraciones
const agregarCarrito = async () => {
    try {
        const id_cliente = sessionStorage.getItem("id_cliente");
        const id_producto = sessionStorage.getItem("id_producto");

        const cantidad = obtenerElemento("cantidad").value;
        const costo = productoPrecio; 
        
        if (!validaciones.noEstaVacio(cantidad)){ 
            mostrarModal("Seleccione una cantidad.");
        }
        else if (id_cliente == null || id_cliente !== 0){ 
            mostrarModal("Ingrese sesión para poder agregar un pedido al carrito.");
        }
        else{ 
             // Form data para json de body 
            var carrito = {
                cantidad_producto: cantidad,
                costo_actual: costo,
                id_inventario: id_producto,
                id_cliente: id_cliente
            };
            const response = await DataAdmin("/public/producto/save", carrito, 'POST');
            if (response.status == 200) {
                window.location.href = "carrito.html";
            } else {
                manejarError();
            }
        }
        
       
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};
const llamarProcesos = async () => {
    await obtenerProducto();
    await obtenerDetalle();
    await obtenerImagenes();
    await obtenerValoraciones();
    await obtenerProdcutoSimilares();
    
}

document.addEventListener("DOMContentLoaded", function () {
    // Inicializar el modal cuando el DOM esté completamente cargado
    validationsModal = new bootstrap.Modal(obtenerElemento('validationsModal'));
    // Obtener cuando recarga página 

    llamarProcesos();
});

function mostrarModal(mensaje) {
    $('#validationsModal .modal-body p').text(mensaje);
    $('#validationsModal').modal('show');
}
