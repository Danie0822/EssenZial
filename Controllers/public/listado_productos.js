//Declaración de constantes para uso general
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);

//const myError = new bootstrap.Modal(obtenerElemento('errorModal'));

const obtenerProductos = async () => {
    try {
        const { success, data } = await fetchData('/inventario/vistaPrueba/view');
        
        const contenedor = obtenerElemento('filaTarjeta');
        contenedor.innerHTML = '';
        
        if (success) {
            data.forEach(({ id_imagen, ruta_imagen,id_inventario, nombre_inventario, precio_inventario, nombre_marca }) => {
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
        }else{
           // manejarError();
        }
    } catch (error) {
        //manejarError();
        console.log(error);
    }
}

const obtenerCategorias = async() =>{
    try{
        const { success, data } = await fetchData('/categorias/');
        const form = obtenerElemento('containerCheckCategorias');
        form.innerHTML = '';
        if(success){
            data.forEach(({id_categoria, nombre_categoria}) => {
                const item = document.createElement('div');
                item.className = 'form-check';
                item.innerHTML = `
                    <input class="form-check-input" type="checkbox" value="" id="checkParfum">
                                <label class="form-check-label" for="flexCheckDefault">
                                    ${nombre_categoria}
                                </label>
                `;
                form.appendChild(item);
            });

        }
    }catch(error){
        console.log(error);
    }
}

const obtenerMarcas = async() =>{
    try{
        const { success, data } = await fetchData('/marcas/');
        const form = obtenerElemento('containerCheckMarcas');
        form.innerHTML = '';
        if(success){
            data.forEach(({id_marca, nombre_marca}) => {
                const item = document.createElement('div');
                item.className = 'form-check';
                item.innerHTML = `
                    <input class="form-check-input" type="checkbox" value="">
                                <label class="form-check-label" for="flexCheckDefault">
                                    ${nombre_marca}
                                </label>
                `;
                form.appendChild(item);
            });

        }
    }catch(error){
        console.log(error);
    }
}

const obtenerData = async() =>{
    await obtenerCategorias();
    await obtenerProductos();
    await obtenerMarcas();

}

document.addEventListener("DOMContentLoaded", function(){
    obtenerData();
    
    
});