//Declaración de constantes para uso general
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);

//Declaracion de constantes para obtener los modals necesarios a ocupar
const myActualizar = new bootstrap.Modal(obtenerElemento('actualizar'));
const myGuardar = new bootstrap.Modal(obtenerElemento('guardar'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminar'));
const myActualizado = new bootstrap.Modal(obtenerElemento('actualizado'));
const myAgregado = new bootstrap.Modal(obtenerElemento('agregado'));
const myVer = new bootstrap.Modal(obtenerElemento('detalles'));

let id_inventario = null;

const obtenerInventario = async () => {
    try {
        const { success, data } = await fetchData('/inventarios');
        const tbody = obtenerElemento('tableBody');
        tbody.innerHTML = '';

        if (success) {
            data.forEach(({ id, nombre_inventario, precio_inventario }) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${nombre_inventario}</td>
                    <td>$${precio_inventario}</td>
                    <td>

                    <button class="btn btn-dark actualizar"><i class="fas fa-edit"></i></button>  
                    <button type="button" class="btn btn-dark"><i class="fas fa-info-circle"></i></button>
                    <button type="button" class="btn btn-dark"><i class="fas fa-star"></i></button>
                    <button type="button" class="btn btn-dark"><i class="fas fa-trash-alt"></i> </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            manejarError();
        }
    }
    catch (error) {
        manejarError();
    }
};

const limpiarFormulario = () => {
    document.querySelectorAll('.form-control').forEach(input => input.value = "");
}
//Creando funcion para agregar inventario
const agregarInventario = async () => {
    try {
        const nombre_inventario = obtenerElemento("nombreInventario").value;
        const cantidad_inventario = obtenerElemento("cantidadInventario").value;
        const descripcion_inventario = obtenerElemento("descripcionInventario").value;
        const precio_inventario = obtenerElemento("precioInventario").value;

        if (!validaciones.validacionNombres(nombre_inventario) || !validaciones.longitudMaxima(nombre_inventario, 255) || !validaciones.esNumeroEntero(cantidad_inventario) || !validaciones.validacionNombres(descripcion_inventario) || !validaciones.longitudMaxima(descripcion_inventario, 450) || !validaciones.esNumeroDecimal(precio_inventario) || !validaciones.esNumeroEntero(precio_inventario)) {
            manejarValidaciones();
        }else{
            const formData = new FormData();
            formData.append('nombre_inventario', nombre_inventario);
            formData.append('cantidad_inventario', cantidad_inventario);
            formData.append('descripcion_inventario', descripcion_inventario);
            formData.append('precio_inventario', precio_inventario);
            const { success } = await createData("/inventarios/save", formData);
            if(success){
                obtenerInventario();
                cerrarModal(myAgregar);
                setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('agregado'))), 500);

            }
        }

    }catch(error){
        manejarError();
        console.log(error);
    }
};

const actualizarInventario = async (id_inventario) =>{
    try{
        const nombre_inventario = obtenerElemento("nombreInventario").value;
        const cantidad_inventario = obtenerElemento("cantidadInventario").value;
        const descripcion_inventario = obtenerElemento("descripcionInventario").value;
        const precio_inventario = obtenerElemento("precioInventario").value;

        if (!validaciones.validacionNombres(nombre_inventario) || !validaciones.longitudMaxima(nombre_inventario, 255) || !validaciones.esNumeroEntero(cantidad_inventario) || !validaciones.validacionNombres(descripcion_inventario) || !validaciones.longitudMaxima(descripcion_inventario, 450) || !validaciones.esNumeroDecimal(precio_inventario) || !validaciones.esNumeroEntero(precio_inventario)) {
            manejarValidaciones();
        }else{
            const formData = new FormData();
            formData.append('id_inventario', id_inventario);
            formData.append('nombre_inventario', nombre_inventario);
            formData.append('cantidad_inventario', cantidad_inventario);
            formData.append('descripcion_inventario', descripcion_inventario);
            formData.append('precio_inventario', precio_inventario);
            const { success } = await createData("/inventarios/update", formData);
            if(success){
                obtenerInventario();
                limpiarFormularioActualizar();
                cerrarModal(myActualizar);
                setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('actualizado'))), 500);

            }else{
                manejarError();
            }
        }
    }catch(error){
        console.log(error);
        manejarError();
    }
}

const eliminarInventario = async (id_inventario) => {
    try{
        const  { success } = await deleteData(`/inventarios/delete/${id_inventario}`);
        if(success){
            obtenerInventario();
            cerrarModal(myEliminar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('eliminado'))), 500);
        }else{
            manejarError();
        }

    }catch(error){
        manejarError();
    }

};

document.addEventListener("DOMContentLoaded", function(){

    obtenerInventario();

    const confirmar_eliminar_button = obtenerElemento('confirmarEliminar');
    confirmar_eliminar_button.addEventListener('click', async () =>{
        if(idInventario){
            await eliminarInventario(id_inventario);
            id_inventario= null;
        }
    });

    const confirmar_actualizar_btn = obtenerElemento('actualizadoBtn');
    confirmar_actualizar_btn.addEventListener('click', async() => {
        if(id_inventario){
            await actualizarInventario(id_inventario);
            id_inventario = null;

        }

    });

    const agregarInventarioBtn = obtenerElemento("agregarBtn");
    agregarInventarioBtn.addEventListener("click", agregarInventario);
});

const mostrarInventario = () =>{
    try{
        limpiarFormularioActualizar();
        obtenerElemento("nombreProductoAc").value = nombre_inventario;
        obtenerElemento("cantidadProductoAc").value = cantidad_inventario;
        obtenerElemento("descripcionProductoAc").value = descripcion_inventario;
        obtenerElemento("precioProductoAc").value = precio_inventario; 
    }catch(error){
        manejarError();
    }
}









