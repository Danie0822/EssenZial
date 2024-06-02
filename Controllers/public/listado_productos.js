// Declaración de constantes para uso general
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);

const myError = new bootstrap.Modal(obtenerElemento('errorModalPro'));

//Funcion para obtener todos los productos
const obtenerProductos = async (categoriasSeleccionadas = [], marcasSeleccionadas = []) => {
    try {
        const { success, data } = await fetchData('/inventario/vistaPrueba/view');
        const contenedor = document.getElementById('filaTarjeta');
        contenedor.innerHTML = '';

        if (success) {
            const productosFiltrados = data.filter(({ id_categoria, id_marca, precio_inventario }) => {
                const enCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(String(id_categoria));
                const enMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(String(id_marca));

                // Aplicar filtros de manera independiente
                return enCategoria && enMarca;
            });

            productosFiltrados.forEach(({ id_imagen, ruta_imagen, nombre_inventario, precio_inventario, nombre_marca, id_inventario }) => {
                const card = document.createElement('div');
                card.className = 'col-sm-12 col-md-6 col-lg-4 ms-4';
                card.innerHTML = `
                    <div class="card me-2" style="width: 18rem;">
                        <img src="${imagen}${ruta_imagen}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h6 class="card-text" style="color: black;">${nombre_inventario}</h6>
                            <p class="textBrand">${nombre_marca}</p>
                            <div class="row">
                                <div class="col-lg-6 col-md-12 col-sm-12">
                                    <label for="">$${precio_inventario}</label>
                                </div>
                                <div class="col-lg-6 col-md-12 col-sm-12">
                                    <a onclick = "obtenerId(${id_inventario})" type="button"
                                        class="btn btn-outline-secondary btn-sm"> Comprar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                contenedor.appendChild(card);
            });
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
        console.error("Error en la solicitud:", error);
    }
};
//Funcion para obtener todas las categorias para los filtros
const obtenerCategorias = async () => {
    try {
        const { success, data } = await fetchData('/categorias/');
        const form = document.getElementById('containerCheckCategorias');
        form.innerHTML = '';
        if (success) {
            const categorias = [...new Set(data.map(({ id_categoria, nombre_categoria }) => ({ id_categoria, nombre_categoria })))];

            categorias.forEach(({ id_categoria, nombre_categoria }) => {
                const item = document.createElement('div');
                item.className = 'form-check';
                item.innerHTML = `
                    <input class="form-check-input categoria-checkbox" type="checkbox" value="${id_categoria}" id="checkCategoria${id_categoria}">
                    <label class="form-check-label" for="checkCategoria${id_categoria}">
                        ${nombre_categoria}
                    </label>
                `;
                form.appendChild(item);
            });
        }
    } catch (error) {
        console.log(error);
    }
};
//Funcion para obtener todas las marcas para filtros
const obtenerMarcas = async () => {
    try {
        const { success, data } = await fetchData('/marcas/');
        const form = document.getElementById('containerCheckMarcas');
        form.innerHTML = '';
        if (success) {
            // Crear un conjunto de marcas únicas utilizando un objeto como auxiliar
            const marcasUnicas = {};
            data.forEach(({ id_marca, nombre_marca }) => {
                if (!marcasUnicas[id_marca]) {
                    marcasUnicas[id_marca] = nombre_marca;
                }
            });

            // Convertir el objeto de marcas únicas en un array para iterar sobre él
            const marcas = Object.entries(marcasUnicas).map(([id_marca, nombre_marca]) => ({ id_marca, nombre_marca }));

            marcas.forEach(({ id_marca, nombre_marca }) => {
                const item = document.createElement('div');
                item.className = 'form-check';
                item.innerHTML = `
                    <input class="form-check-input marca-checkbox" type="checkbox" value="${id_marca}" id="checkMarca${id_marca}">
                    <label class="form-check-label" for="checkMarca${id_marca}">
                        ${nombre_marca}
                    </label>
                `;
                form.appendChild(item);
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const obtenerId = async (data) => { 
    await  sessionStorage.setItem("id_producto", data); 
    window.location.href = "detalles_productos.html";
};

//Funcion asincrona para ejecutar el código de manera correcta
const obtenerData = async () => {
    await obtenerCategorias();
    await obtenerProductos();
    await obtenerMarcas();
};
//Funcion para aplicar los filtros y actualizarlos
const actualizarFiltros = () => {
    const categoriasSeleccionadas = Array.from(document.querySelectorAll('.categoria-checkbox:checked')).map(cb => cb.value);
    const marcasSeleccionadas = Array.from(document.querySelectorAll('.marca-checkbox:checked')).map(cb => cb.value);

    obtenerProductos(categoriasSeleccionadas, marcasSeleccionadas);
};

//Funcion DOM para cargar acciones
document.addEventListener("DOMContentLoaded", function () {
    obtenerData();

    document.getElementById('containerCheckCategorias').addEventListener('change', actualizarFiltros);
    document.getElementById('containerCheckMarcas').addEventListener('change', actualizarFiltros);
});
