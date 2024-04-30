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
const myVer = new bootstrap.Modal(obtenerElemento('detalles'));
const myPuntaje = new bootstrap.Modal(obtenerElemento('valoracionesModal'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const validationsModal = new bootstrap.Modal(obtenerElemento('validationsModal'));


let idIventario = null;

//Obtenemos todas lo datos necesarios para cargar los 4 comboboxes
const obtenerOlores = async () => {
    try {
        const { success, data } = await fetchData('/olores/'); // Suponiendo que '/olores' es la ruta para obtener los olores
        const selectOlores = document.getElementById('olorProducto'); // Obtener el elemento select

        if (success) {
            selectOlores.innerHTML = ''; // Limpiar opciones anteriores

            data.forEach(({ id_olor, nombre_olor }) => {
                const option = document.createElement('option');
                option.value = id_olor; // Asignar el id como valor de la opción
                option.text = nombre_olor; // Asignar el nombre como texto de la opción
                selectOlores.appendChild(option);
            });
        } else {
            throw new Error('No se pudieron obtener los olores.');
        }
    } catch (error) {
        console.error('Error al obtener los olores:', error);
    }
};

const obtenerCategorias = async () => {
    try {
        const { success, data } = await fetchData('/categorias/');
        const selectOlores = document.getElementById('categoriaProducto');

        if (success) {
            selectOlores.innerHTML = '';

            data.forEach(({ id_categoria, nombre_categoria }) => {
                const option = document.createElement('option');
                option.value = id_categoria;
                option.text = nombre_categoria;
                selectOlores.appendChild(option);
            });
        } else {
            throw new Error('No se pudieron obtener las categorías.');
        }
    } catch (error) {
        console.error('Error al obtener las categprías:', error);
    }
};

const obtenerDescuentos = async () => {
    try {
        const { success, data } = await fetchData('/descuentos/especifico');
        const selectOlores = document.getElementById('descuentoSeleccionado');

        if (success) {
            selectOlores.innerHTML = '';

            data.forEach(({ id_descuento, cantidad_descuento }) => {
                const option = document.createElement('option');
                option.value = id_descuento;
                option.text = cantidad_descuento;
                selectOlores.appendChild(option);
            });
        } else {
            throw new Error('No se pudieron obtener los descuentos.');
        }
    } catch (error) {
        console.error('Error al obtener los descuentos:', error);
    }
};

const obtenerMarcas = async () => {
    try {
        const { success, data } = await fetchData('/marcas/');
        const selectOlores = document.getElementById('marcaProducto');

        if (success) {
            selectOlores.innerHTML = '';

            data.forEach(({ id_marca, nombre_marca }) => {
                const option = document.createElement('option');
                option.value = id_marca;
                option.text = nombre_marca;
                selectOlores.appendChild(option);
            });
        } else {
            throw new Error('No se pudieron obtener las marcas.');
        }
    } catch (error) {
        console.error('Error al obtener las marcas:', error);
    }
};

async function obtenerCmb(){
    try {
        await obtenerOlores();
        await obtenerCategorias();
        await obtenerDescuentos();
        await obtenerMarcas();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

//Funcion de obtener todos los productos del inventario
const obtenerInventario = async () => {
    try {
        const { success, data } = await fetchData('/inventario');
        const tbody = obtenerElemento('tableBody');
        tbody.innerHTML = '';

        if (success) {
            data.forEach(({ id_inventario, nombre_inventario, precio_inventario }) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${nombre_inventario}</td>
                    <td>$${precio_inventario}</td>
                    <td>

                    <button class="btn btn-dark actualizar" onclick="abrirModalEditar(${id_inventario})"><i class="fas fa-edit"></i></button>  
                    <button type="button" class="btn btn-dark" onclick="abrirModalVer(${id_inventario})"><i class="fas fa-info-circle"></i></button>
                    <button type="button" class="btn btn-dark" onclick="abrirModalPuntaje${id_inventario}"><i class="fas fa-star"></i></button>
                    <button type="button" class="btn btn-dark" onclick="abrirModalEliminar(${id_inventario})"><i class="fas fa-trash-alt"></i> </button>
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
//Abrir modal para agregar inventario
async function abrirAgregar() {
    abrirModal(myGuardar);
    obtenerCmb();
}

const limpiarFormulario = () => {
    document.querySelectorAll('.form-control').forEach(input => input.value = "");
}

//Funcion para abrir modal de editar 
const abrirModalEditar = (idInventarios) =>{
    if(idInventarios){
        mostrarInventariosId(idInventarios);
        idIventario = idInventarios;
        abrirModal(myActualizar);
    }
}

//Funcion para abrir modal de eliminar
const abrirModalEliminar = (idIventarios) =>{
    if(idIventarios){
        idIventario = idIventarios;
        abrirModal(myEliminar);
    }else{
        manejarError();
    }

}
//Funcion para abrir modal de ver
const abrirModalVer = (idIventarios) =>{
    if(idInventarios){
        idIventario = idIventarios;
        abrirModal(myVer);
    }else{
        manejarError();
    }

}
//Funcion para abrir modal de puntuacion
const abrirModalPuntaje = (idInventarios) =>{
    if(idInventarios){
        idIventario = idInventarios;
        abrirModal(myPuntaje);
    }else{
        manejarError();
    }


}

//Creando funcion para agregar inventario
const agregarInventario = async () => {
    try {
        const nombreInventario = obtenerElemento("nombreProducto").value;
        const cantidadInventario = obtenerElemento("cantidadProducto").value;
        const descripcionInventario = obtenerElemento("descripcionProducto").value;
        const precioInventario = obtenerElemento("precioProducto").value;
        const idOlor = obtenerElemento("olorProducto").value;
        const idCategoria = obtenerElemento("categoriaProducto").value;
        const idMarca = obtenerElemento("marcaProducto").value;
        const idDescuento = obtenerElemento("descuentoSeleccionado").value;

        if (!validaciones.contieneSoloLetrasYNumeros(nombre_inventario) || !validaciones.longitudMaxima(nombre_inventario, 250)) {
            manejarValidaciones();
        } else {
            var inventarioData = {
                nombre_inventario: nombreInventario,
                cantidad_inventario: cantidadInventario,
                descripcion_inventario: descripcionInventario,
                precio_inventario: precioInventario,
                id_olor: idOlor,
                id_categoria: idCategoria,
                id_marca: idMarca,
                id_descuento: idDescuento
            };

            const  success = await DataAdmin("/inventario/save", inventarioData,'POST');
            if (success.status == 200) {
                obtenerInventario();
                cerrarModal(myGuardar);
                setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('agregado'))), 500);

            }
        }

    } catch (error) {
       
        console.log(error);
       manejarError();
    }
};

const actualizarInventario = async (id_inventario) => {
    try {
        const nombre_inventario = obtenerElemento("nombreInventario").value;
        const cantidad_inventario = obtenerElemento("cantidadInventario").value;
        const descripcion_inventario = obtenerElemento("descripcionInventario").value;
        const precio_inventario = obtenerElemento("precioInventario").value;

        if (!validaciones.validacionNombres(nombre_inventario) || !validaciones.longitudMaxima(nombre_inventario, 255) || !validaciones.esNumeroEntero(cantidad_inventario) || !validaciones.validacionNombres(descripcion_inventario) || !validaciones.longitudMaxima(descripcion_inventario, 450) || !validaciones.esNumeroDecimal(precio_inventario) || !validaciones.esNumeroEntero(precio_inventario)) {
            manejarValidaciones();
        } else {
            const formData = new FormData();
            formData.append('id_inventario', id_inventario);
            formData.append('nombre_inventario', nombre_inventario);
            formData.append('cantidad_inventario', cantidad_inventario);
            formData.append('descripcion_inventario', descripcion_inventario);
            formData.append('precio_inventario', precio_inventario);
            const { success } = await createData("/inventarios/update", formData);
            if (success) {
                obtenerInventario();
                limpiarFormularioActualizar();
                cerrarModal(myActualizar);
                setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('actualizado'))), 500);

            } else {
                manejarError();
            }
        }
    } catch (error) {
        console.log(error);
        manejarError();
    }
}

const eliminarInventario = async (id_inventario) => {
    try {
        const { success } = await deleteData(`/inventario/delete/${id_inventario}`);
        if (success) {
            obtenerInventario();
            cerrarModal(myEliminar);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('eliminado'))), 500);
        } else {
            manejarError();
        }

    } catch (error) {
        manejarError();
    }

};

document.addEventListener("DOMContentLoaded", function () {

    obtenerInventario();

    const confirmar_eliminar_button = obtenerElemento('confirmarEliminar');
    confirmar_eliminar_button.addEventListener('click', async () => {
        if (idInventario) {
            await eliminarInventario(id_inventario);
            id_inventario = null;
        }
    });

    const confirmar_actualizar_btn = obtenerElemento('actualizadoBtn');
    confirmar_actualizar_btn.addEventListener('click', async () => {
        if (id_inventario) {
            await actualizarInventario(id_inventario);
            id_inventario = null;

        }

    });

    const agregarInventarioBtn = obtenerElemento("agregarBtnInventario");
    agregarInventarioBtn.addEventListener('click', async () => {
        await agregarInventario();
    });

});

//Funcion para traer los datos de la base
const obtenerInventarioDetalles = async (idIventario) =>{
    try {
        // Realizar una solicitud al servidor para obtener los detalles de la categoría por su ID
        const response = await fetchData(`/inventario/${idIventario}`); // Suponiendo que '/categorias/:id' es la ruta para obtener detalles de una categoría por su ID
        if (response.success) {
            // Si la solicitud fue exitosa, devolver los datos de la categoría
            return response.data;
        } else {
            // Si la solicitud falla, lanzar un error
            throw new Error('No se pudieron obtener los detalles de la categoría.');
        }
    } catch (error) {
        // Manejar cualquier error que ocurra durante la solicitud
        console.error('Error al obtener los detalles de la categoría:', error);
        manejarError();
    }
}

//Funcion para asignar valores de la peticion select/id
const mostrarInventariosId = async (idInventario) => {
    try {
        // Obtener los detalles de la categoría por su ID
        const detallesInventario = await obtenerInventarioDetalles(idInventario);

        // Llenar los inputs del formulario con los detalles obtenidos
        obtenerElemento("nombreProductoAc").value = detallesInventario.nombre_inventario;
        obtenerElemento("cantidadProductoAc").value = detallesInventario.cantidad_inventario;
        obtenerElemento("descripcionProductoAc").value = detallesInventario.descripcion_inventario;
        obtenerElemento("precioProductoAc").value = detallesInventario.precio_inventario;
        obtenerElemento("oloresProductoAc").text = detallesInventario.id_olor.nombre_olor;

    } catch (error) {
        manejarError();
    }
};
