const obtenerElemento = (id) => document.getElementById(id);

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

const obtenerProducto = async () => {
    try {
        const id_producto = 1;
        const { success, data } = await fetchData(`/public/producto/${id_producto}`);
        const recienAgregados = document.getElementById("producto_inicio");

        if (success) {
            recienAgregados.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas

            data.forEach(({ titulo_perfume, valoracion_calculada, precio, unidades_disponibles, primera_imagen }) => {
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
                        <input type="text" class="form-control" placeholder="$ ${precio}" aria-label="Disabled input example" disabled>
                        <input type="number" class="form-control" placeholder="Cantidad">
                    </div>

                    <!-- Disponibilidad -->
                    <p>Disponibilidad: ${unidades_disponibles}</p>

                    <!-- Botón de añadir al carrito -->
                    <a href="../../Views/public/carrito.html" type="button" class="btn btn-dark"><i class="fas fa-shopping-cart"></i> Añadir al Carrito</a>
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

const obtenerDetalle = async () => {
    try {
        const id_producto = 1;
        const { success, data } = await fetchData(`/public/producto/detalle/${id_producto}`);
        const recienAgregados = document.getElementById("detalle");

        if (success) {
            recienAgregados.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas

            data.forEach(({ descripcion_producto, marca, categoria, aroma}) => {
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
const llamarProcesos = async () => {
    await obtenerProducto();
    await obtenerDetalle();
} 
document.addEventListener("DOMContentLoaded", function () {
    // Obtener cuando recarga página 
    llamarProcesos();
});
