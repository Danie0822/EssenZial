// Declaración de constantes para uso general
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);

//const myError = new bootstrap.Modal(obtenerElemento('errorModal'));

const obtenerProductos = async (categoriasSeleccionadas = [], marcasSeleccionadas = [], rangoPrecio = 300) => {
    try {
        const { success, data } = await fetchData('/inventario/vistaPrueba/view');
        const contenedor = document.getElementById('filaTarjeta');
        contenedor.innerHTML = '';

        if (success) {
            const productosFiltrados = data.filter(({ id_categoria, id_marca, precio_inventario }) => {
                const enCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(String(id_categoria));
                const enMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(String(id_marca));
                const enRango = rangoPrecio == 300 || precio_inventario <= rangoPrecio; // Manejar el rango de precio

                // Aplicar filtros de manera independiente
                return enCategoria && enMarca && enRango;
            });

            productosFiltrados.forEach(({ id_imagen, ruta_imagen, nombre_inventario, precio_inventario, nombre_marca }) => {
                const card = document.createElement('div');
                card.className = 'col-sm-12 col-md-6 col-lg-3';
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
                                    <a href="../../Views/public/detalles_productos.html" type="button"
                                        class="btn btn-outline-secondary btn-sm"> Comprar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                contenedor.appendChild(card);
            });
        } else {
            // manejarError();
        }
    } catch (error) {
        // manejarError();
        console.log(error);
    }
};

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

const obtenerData = async () => {
    await obtenerCategorias();
    await obtenerProductos();
    await obtenerMarcas();
};

const actualizarFiltros = () => {
    const categoriasSeleccionadas = Array.from(document.querySelectorAll('.categoria-checkbox:checked')).map(cb => cb.value);
    const marcasSeleccionadas = Array.from(document.querySelectorAll('.marca-checkbox:checked')).map(cb => cb.value);
    const rangoPrecio = document.getElementById('inputRango').value || 300;

    obtenerProductos(categoriasSeleccionadas, marcasSeleccionadas, rangoPrecio);
};

document.addEventListener("DOMContentLoaded", function () {
    obtenerData();

    document.getElementById('containerCheckCategorias').addEventListener('change', actualizarFiltros);
    document.getElementById('containerCheckMarcas').addEventListener('change', actualizarFiltros);

    const rangeInput = document.getElementById("inputRango");
    const rangeLabel = document.getElementById("textoRango");
    rangeInput.addEventListener("input", function () {
        rangeLabel.textContent = `$${rangeInput.value}`;
        actualizarFiltros();
    });
});
