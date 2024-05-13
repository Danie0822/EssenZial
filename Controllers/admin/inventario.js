
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


let idInventario = null;

const obtenerOlores = async (idCombobox) => {
    try {
        const { success, data } = await fetchData('/olores/'); // Suponiendo que '/olores' es la ruta para obtener los olores
        const selectOlores = document.getElementById(idCombobox); // Obtener el elemento select usando el ID proporcionado

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

const obtenerCategorias = async (idCmb) => {
    try {
        const { success, data } = await fetchData('/categorias/');
        const selectCat = document.getElementById(idCmb);

        if (success) {
            selectCat.innerHTML = '';

            data.forEach(({ id_categoria, nombre_categoria }) => {
                const option = document.createElement('option');
                option.value = id_categoria;
                option.text = nombre_categoria;
                selectCat.appendChild(option);
            });
        } else {
            throw new Error('No se pudieron obtener las categorías.');
        }
    } catch (error) {
        console.error('Error al obtener las categprías:', error);
    }
};

const obtenerDescuentos = async (idCmb) => {
    try {
        const { success, data } = await fetchData('/descuentos/especifico');
        const selectDesc = document.getElementById(idCmb);

        if (success) {
            selectDesc.innerHTML = '';

            data.forEach(({ id_descuento, cantidad_descuento }) => {
                const option = document.createElement('option');
                option.value = id_descuento;
                option.text = cantidad_descuento;
                selectDesc.appendChild(option);
            });
        } else {
            throw new Error('No se pudieron obtener los descuentos.');
        }
    } catch (error) {
        console.error('Error al obtener los descuentos:', error);
    }
};

const obtenerMarcas = async (idCmb) => {
    try {
        const { success, data } = await fetchData('/marcas/');
        const selectMarcas = document.getElementById(idCmb);

        if (success) {
            selectMarcas.innerHTML = '';

            data.forEach(({ id_marca, nombre_marca }) => {
                const option = document.createElement('option');
                option.value = id_marca;
                option.text = nombre_marca;
                selectMarcas.appendChild(option);
            });
        } else {
            throw new Error('No se pudieron obtener las marcas.');
        }
    } catch (error) {
        console.error('Error al obtener las marcas:', error);
    }
};

//Cargando comboBoxes para modal de agregar
async function obtenerCmb() {
    try {
        await obtenerOlores("olorProducto");
        await obtenerCategorias("categoriaProducto");
        await obtenerDescuentos("descuentoSeleccionado");
        await obtenerMarcas("marcaProducto");
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

//Cargando comboBoxes para modal de actualizar
async function obtenerCmbAc() {
    try {
        await obtenerOlores("oloresProductoAc");
        await obtenerCategorias("categoriaProductoAc");
        await obtenerDescuentos("descuentoSeleccionadoAc");
        await obtenerMarcas("marcaProductoAc");
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
                    <button type="button" class="btn btn-dark" onclick="abrirModalPuntaje(${id_inventario})"><i class="fas fa-star"></i></button>
                    <button type="button" class="btn btn-dark" onclick="abrirModalEliminar(${id_inventario})"><i class="fas fa-trash-alt"></i> </button>
                    <button type="button" class="btn btn-dark" onclick="abrirImagenes(${id_inventario})"><i class="fas fa-image"></i></button>
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

//Funcion para abrir pantalla y enviar id 
function abrirImagenes(idInventario) {
    // Redirigir a la página de imágenes.html con el ID como parámetro en la URL
    window.location.href = `imagenes.html`;
    sessionStorage.setItem("id_inventario", idInventario);
}

//Abrir modal para agregar inventario
async function abrirAgregar() {
    abrirModal(myGuardar);
    obtenerCmb();
}

const limpiarFormulario = () => {
    document.querySelectorAll('.form-control').forEach(input => input.value = "");
}

//Funcion para abrir modal de editar 
const abrirModalEditar = (idInventarios) => {
    if (idInventarios) {
        mostrarInventariosId(idInventarios);
        idInventario = idInventarios;
        abrirModal(myActualizar);
    }
}

//Funcion para abrir modal de eliminar
const abrirModalEliminar = (idInventarios) => {
    if (idInventarios) {
        idInventario = idInventarios;
        abrirModal(myEliminar);
    } else {
        manejarError();
    }

}

//Funcion para abrir modal de ver
const abrirModalVer = (idInventarios) => {
    if (idInventarios) {
        verInventario(idInventarios);
        idIventario = idInventarios;
        abrirModal(myVer);
    } else {
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

        if (!validaciones.contieneSoloLetrasYNumeros(nombreInventario) || !validaciones.longitudMaxima(nombreInventario, 250) || !validaciones.esNumeroEntero(cantidadInventario) || !validaciones.esNumeroDecimal(precioInventario)) {
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

            const success = await DataAdmin("/inventario/save", inventarioData, 'POST');
            if (success.status == 200) {
                obtenerInventario();
                limpiarFormulario();
                cerrarModal(myGuardar);
                setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('agregado'))), 500);

            }
        }

    } catch (error) {

        console.log(error);
        manejarError();
    }
};

//Funcion para actualizar los datos 
const actualizarInventario = async (idInventario) => {
    try {
        const idInvent = idInventario;
        const nombreInventario = obtenerElemento("nombreProductoAc").value;
        const cantidadInventario = obtenerElemento("cantidadProductoAc").value;
        const descripcionInventario = obtenerElemento("descripcionProductoAc").value;
        const precioInventario = obtenerElemento("precioProductoAc").value;
        const idOlor = obtenerElemento("oloresProductoAc").value;
        const idCategoria = obtenerElemento("categoriaProductoAc").value;
        const idMarca = obtenerElemento("marcaProductoAc").value;
        const idDescuento = obtenerElemento("descuentoSeleccionadoAc").value;

        if (!validaciones.contieneSoloLetrasYNumeros(nombreInventario) || !validaciones.longitudMaxima(nombreInventario, 250) || !validaciones.esNumeroEntero(cantidadInventario) || !validaciones.esNumeroDecimal(precioInventario)) {
            manejarValidaciones();
        } else {
            var inventarioData = {
                id_inventario: idInvent,
                nombre_inventario: nombreInventario,
                cantidad_inventario: cantidadInventario,
                descripcion_inventario: descripcionInventario,
                precio_inventario: precioInventario,
                id_olor: idOlor,
                id_categoria: idCategoria,
                id_marca: idMarca,
                id_descuento: idDescuento
            };

            const success = await DataAdmin("/inventario/update", inventarioData, 'PUT');
            if (success.status == 200) {
                obtenerInventario();
                cerrarModal(myActualizar);
                setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('actualizado'))), 500);

            }
        }
    } catch (error) {
        console.log(error);
        manejarError();
    }
}

//Funcion para eiminar un inventario
const eliminarInventario = async (idInventario) => {
    try {
        const { success } = await deleteData(`/inventario/delete/${idInventario}`);
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

//Funcion DOM para cargar acciones
document.addEventListener("DOMContentLoaded", function () {

    obtenerInventario();

    const confirmar_eliminar_button = obtenerElemento('confirmarEliminar');
    confirmar_eliminar_button.addEventListener('click', async () => {
        if (idInventario) {
            await eliminarInventario(idInventario);
            idInventario = null;
        }
    });

    const confirmar_actualizar_btn = obtenerElemento("actualizarBtn");
    confirmar_actualizar_btn.addEventListener('click', async () => {
        if (idInventario) {
            await actualizarInventario(idInventario);
            idInventario = null;

        }

    });

    const agregarInventarioBtn = obtenerElemento("agregarBtnInventario");
    agregarInventarioBtn.addEventListener('click', async () => {
        await agregarInventario();
    });

});

//Funcion para traer los datos de la base acerca de los inventarios segun el ID
const obtenerInventarioDetalles = async (idIventario) => {
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


const desactivarCombobox = (idCombobox) => {
    const combobox = document.getElementById(idCombobox);
    combobox.disabled = true;
};

const activarCombobox = (idCombobox) => {
    const combobox = document.getElementById(idCombobox);
    combobox.disabled = false;
};

const obtenerMarcaPorId = async (idCmb, id, nombre) => {
    try {
        desactivarCombobox(idCmb);
        const selectMarcas = document.getElementById(idCmb);
        selectMarcas.innerHTML = '';
        // Crear una opción para la marca recuperada
        const option = document.createElement('option');
        option.value = id;
        option.text = nombre;
        selectMarcas.appendChild(option); 
       
        activarCombobox(idCmb);
        //Agregar un controlador de eventos que se activará solo la primera vez que hagas clic en el combobox
        const clickHandler = async () => {
            selectMarcas.removeEventListener('click', clickHandler); // Eliminar el controlador de eventos después del primer clic
             // Activar el combobox después del primer clic
             await obtenerMarcas(idCmb);
        };
        
        selectMarcas.addEventListener('click', clickHandler);
    } catch (error) {
        console.error('Error al obtener la marca:', error);
    }
};

const obtenerDescuentoPorId = async (idCmb, id, nombre) => {
    try {
        desactivarCombobox(idCmb);
        const selectMarcas = document.getElementById(idCmb);
        selectMarcas.innerHTML = '';
        // Crear una opción para la marca recuperada
        const option = document.createElement('option');
        option.value = id;
        option.text = nombre;
        selectMarcas.appendChild(option); 
       
        activarCombobox(idCmb);
        //Agregar un controlador de eventos que se activará solo la primera vez que hagas clic en el combobox
        const clickHandler = async () => {
            selectMarcas.removeEventListener('click', clickHandler); // Eliminar el controlador de eventos después del primer clic
             // Activar el combobox después del primer clic
            await obtenerDescuentos(idCmb);
        };
        
        selectMarcas.addEventListener('click', clickHandler);
    } catch (error) {
        console.error('Error al obtener la marca:', error);
    }
};

const obtenerCategoriaPorId = async (idCmb, id, nombre) => {
    try {
        desactivarCombobox(idCmb);
        const selectMarcas = document.getElementById(idCmb);
        selectMarcas.innerHTML = '';
        // Crear una opción para la marca recuperada
        const option = document.createElement('option');
        option.value = id;
        option.text = nombre;
        selectMarcas.appendChild(option); 

        activarCombobox(idCmb);
        const clickHandler = async () => {
            // Desactivar el evento de clic mientras se obtienen las categorías para evitar problemas
            selectMarcas.removeEventListener('click', clickHandler);
            await obtenerCategorias(idCmb); // Llamar a la función para obtener las categorías
        };
        
        // Agregar el evento de clic al combobox
        selectMarcas.addEventListener('click', clickHandler);
    } catch (error) {
        console.error('Error al obtener la marca:', error);
    }
};

const obtenerOloresPorId = async (idCmb, id, nombre) => {
    try {
        desactivarCombobox(idCmb);
        const selectMarcas = document.getElementById(idCmb);
        selectMarcas.innerHTML = '';
        // Crear una opción para la marca recuperada
        const option = document.createElement('option');
        option.value = id;
        option.text = nombre;
        selectMarcas.appendChild(option); 
       
        activarCombobox(idCmb);
        //Agregar un controlador de eventos que se activará solo la primera vez que hagas clic en el combobox
        const clickHandler = async () => {
            selectMarcas.removeEventListener('click', clickHandler); // Eliminar el controlador de eventos después del primer clic
             // Activar el combobox después del primer clic
           await obtenerOlores(idCmb);
        };
        
        selectMarcas.addEventListener('click', clickHandler);
    } catch (error) {
        console.error('Error al obtener la marca:', error);
    }
};




//Funcion para asignar valores de la peticion select/id
const mostrarInventariosId = async (idInventario) => {
    try {
        // Obtener los detalles de la categoría por su ID
        const detallesInventario = await obtenerInventarioDetalles(idInventario);

        // Verificar si hay algún elemento en el array y si es así, obtener el primer elemento
        if (detallesInventario.length > 0) {
            const inventario = detallesInventario[0];

            // Llenar los inputs del formulario con los detalles obtenidos
            obtenerElemento("nombreProductoAc").value = inventario.nombre_inventario;
            obtenerElemento("cantidadProductoAc").value = inventario.cantidad_inventario;
            obtenerElemento("descripcionProductoAc").value = inventario.descripcion_inventario;
            obtenerElemento("precioProductoAc").value = inventario.precio_inventario;
            obtenerMarcaPorId("marcaProductoAc",inventario.id_marca, inventario.nombre_marca);
           await obtenerCategoriaPorId("categoriaProductoAc", inventario.id_categoria, inventario.nombre_categoria);
            obtenerDescuentoPorId("descuentoSeleccionadoAc", inventario.id_descuento, inventario.cantidad_descuento);
            obtenerOloresPorId("oloresProductoAc", inventario.id_olor, inventario.nombre_olor);
        
        } else {
            console.error('No se encontraron detalles de inventario para el ID proporcionado.');
            manejarError();
        }

    } catch (error) {
        manejarError();
    }
};




const verInventario = async (idInventario) => {
    try {
        const detalles = await obtenerInventarioDetalles(idInventario);
        if (detalles.length > 0) {
            const inventario = detalles[0];

            obtenerElemento("nombreP").innerText = inventario.nombre_inventario;
            obtenerElemento("cantidadP").innerText = inventario.cantidad_inventario;
            obtenerElemento("descriP").innerText = inventario.descripcion_inventario;
            obtenerElemento("precioP").innerText = "$" + inventario.precio_inventario;
            obtenerElemento("categoriaP").innerText = inventario.nombre_categoria;
            obtenerElemento("olorP").innerText = inventario.nombre_olor;
            obtenerElemento("marcaP").innerText = inventario.nombre_marca;
            obtenerElemento("descuentoP").innerText = inventario.cantidad_descuento;

        }
    } catch (error) {
        // Manejar cualquier error que ocurra durante la solicitud
        console.error('Error al obtener los detalles de la categoría:', error);
        manejarError();
    }

};

//Funcion para abrir modal de puntuacion
const abrirModalPuntaje = (idInventarios) => {
    if (idInventarios) {
        obtenerValoraciones(idInventarios);
        idIventario = idInventarios;
        abrirModal(myPuntaje);
    } else {
        manejarError();
    }
}

//Funcion para obtener valoraciones
const obtenerValoracionessDet = async (idInventario) => {
    try {
        const response = await fetchData(`/valoraciones/${idInventario}`);
        if (response.success) {
            return response.data;
        } else {
            throw new Error('No se pudieron obtener los detalles de las valoraciones');
        }
    } catch (error) {
        // Manejar cualquier error que ocurra durante la solicitud
        console.error('Error al obtener los detalles de la categoría:', error);
        manejarError();
    }
}

//Función para el modal de obtener valoraciones
const obtenerValoraciones = async (idInventario) => {
    try {
        const detalles = await obtenerValoracionessDet(idInventario);
        const tbody = obtenerElemento('tbodyValo');
        tbody.innerHTML = '';

        if (detalles.length > 0) {
            const valo = detalles[0];
            obtenerElemento('nombrePerfume').textContent = valo.nombre_inventario;

            let totalCalificaciones = 0;

            detalles.forEach(({ calificacion_producto, nombre_cliente, estado_comentario, id_valoracion, id_inventario }) => {
                totalCalificaciones += calificacion_producto;
                const estadoTexto = estado_comentario === 1 ? 'Activo' : 'Inactivo';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${nombre_cliente}</td>
                    <td>${estadoTexto}</td>
                    <td>
                        <div class="rating">
                            ${calificacion_producto}
                        </div>
                        <button class="btn btn-dark actualizar" onclick="ActualizarEstadoValoraciones(${id_valoracion}, ${estado_comentario}, ${id_inventario})"><i class="fas fa-edit"></i></button>  
                    </td>
                `;
                tbody.appendChild(tr);
            });

            const promedio = totalCalificaciones / detalles.length;
            obtenerElemento('rating').innerHTML = generarEstrellas(promedio);
        }

    } catch (error) {
        manejarError();
        console.log(error);
    }
};
const ActualizarEstadoValoraciones = async (idValoraciones, estado, idInven) => {
    try {
        let estadoCambio = estado == 1 ? false : true;

        var valoracion = {
            id_valoracion: idValoraciones,
            estado_comentario: estadoCambio,
        };

        const success = await DataAdmin("/valoraciones/update", valoracion, 'PUT');
        if (success.status == 200) {
            // Actualizar la información de la tabla
            await obtenerValoraciones(idInven);
            setTimeout(() => abrirModal(new bootstrap.Modal(obtenerElemento('agregado'))), 500);
        }
    } catch (error) {
        console.log(error);
        manejarError();
    }
}

const generarEstrellas = (promedio) => {
    const estrellas = [];

    // Asegurar que el promedio esté dentro del rango de 1 a 5
    promedio = Math.min(Math.max(promedio, 1), 5);

    // Generar estrellas llenas
    for (let i = 1; i <= promedio; i++) {
        estrellas.push(`<label style="background-image: url('/resources/img/estrellaRe.png');"></label>`);
    }

    // Completar con estrellas vacías
    for (let i = promedio + 1; i <= 5; i++) {
        estrellas.push(`<label style="background-image: url('/resources/img/estrella.png');"></label>`);
    }

    return estrellas.join('');
};
