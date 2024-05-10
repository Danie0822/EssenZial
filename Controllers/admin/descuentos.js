//Declaración de constantes para uso general
const obtenerElementoD = (id) => document.getElementById(id);
const abrirModalD = (modal) => modal.show();
const cerrarModalD = (modal) => modal.hide();
const manejarErrorD = () => abrirModalD(myErrorD);
const manejarValidacionesD = () => abrirModalD(validationsModal);

//Declaracion de constantes para obtener los modals necesarios a ocupar
const myActualizarD = new bootstrap.Modal(obtenerElementoD('descuentoModalA'));
const myGuardarD = new bootstrap.Modal(obtenerElementoD('descuentoModal'));
const myEliminarD = new bootstrap.Modal(obtenerElementoD('eliminarDescuentoM'));
const myVerD = new bootstrap.Modal(obtenerElementoD('detallesDescuentoModal'));
const myErrorD = new bootstrap.Modal(obtenerElementoD('errorModal'));
const validationsModal = new bootstrap.Modal(obtenerElementoD('validationsModal'));


let idDescuento = null;

//Funcion para obtener todos los descuentos 
const obtenerDescuentos = async () => {
    try {

        const { success, data } = await fetchData('/descuentos');
        const tbody = obtenerElementoD('tableBody');
        tbody.innerHTML = '';

        if (success) {
            data.forEach(({ id_descuento, cantidad_descuento, estado_descuento }) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td>${cantidad_descuento}</td>
                <td>${estado_descuento}</td>
                <td>
                    <button type="button" class="btn btn-dark" ><i class="fas fa-edit" onclick="abrirDescuentosActualizar(${id_descuento})"></i></button>
                    <button type="button" class="btn btn-dark" onclick="abrirDescuentosVer(${id_descuento})"><i class="fas fa-info-circle"></i></button>
                    <button type="button" class="btn btn-dark" onclick="abrirDescuentosEliminar(${id_descuento})"><i class="fas fa-trash-alt"></i> </button>
                </td>
                `;
                tbody.appendChild(tr);
            });
        }
        else {
            manejarErrorD();
        }
    } catch (error) {
        manejarErrord();
    }

};


async function abrirDescuentos() {
    abrirModalD(myGuardarD);
}

const abrirDescuentosActualizar = (idDescuentos) => {
    if (idDescuentos) {
        mostrarDescuentos(idDescuentos);
        idDescuento = idDescuentos;
        abrirModalD(myActualizarD);
    } else {
        manejarErrorD();
    }

}

const abrirDescuentosEliminar = (idDescuentos) => {
    if (idDescuentos) {
        idDescuento = idDescuentos;
        abrirModalD(myEliminarD);
    } else {
        manejarError();
    }

}

const abrirDescuentosVer = (idDescuentos) => {
    if (idDescuentos) {
        verDescuento(idDescuentos);
        idDescuento = idDescuentos;
        abrirModalD(myVerD);
    } else {
        manejarError();
    }
}



//Funcion para agregar descuentos
const agregarDescuentos = async () => {
    try {

        const check = obtenerElementoD("estadoDescuento");

        let estado = null;
        const cantidadDescuento = obtenerElementoD("cantidadDescuento").value;
        const descripDescuento = obtenerElementoD("descripcionDescuento").value;
        const fechaInicio = obtenerElementoD("fechaIDescuento").value;
        const fechaFin = obtenerElementoD("fechaFDescuento").value;


        if (check.checked) {
            estado = 1;
        } else {
            estado = 0;
        }

        if (!validaciones.contieneSoloLetrasYNumeros(descripDescuento) || !validaciones.esNumeroEntero(cantidadDescuento) || !validaciones.esFechaValida(fechaInicio) || !validaciones.esFechaValida(fechaFin)) {
            manejarValidacionesD();
        } else {
            var descuentosData = {
                cantidad_descuento: cantidadDescuento,
                descripcion_descuento: descripDescuento,
                fecha_inicio_descuento: fechaInicio,
                estado_descuento: estado,
                fecha_fin_descuento: fechaFin
            };

            const success = await DataAdmin("/descuentos/save", descuentosData, 'POST');
            if (success.status == 200) {
                obtenerDescuentos();
                cerrarModalD(myGuardarD);
                setTimeout(() => abrirModalD(new bootstrap.Modal(obtenerElementoD('agregado'))), 500);
            }
        }
    } catch (error) {
        console.log(error);
        manejarErrorD();
    }
};

//Funcion para actualizar los datos
const actualizarDescuentos = async (idDescuento) => {
    try {

        const check = obtenerElementoD("estadoDescuento");
        const idDesc = idDescuento;

        const cantidadDescuento = obtenerElementoD("cantidadDescuento").value;
        const descripDescuento = obtenerElementoD("descripcionDescuento").value;
        const fechaInicio = obtenerElementoD("fechaIDescuento").value;
        const fechaFin = obtenerElementoD("fechaFDescuento").value;

        if (check.checked) {
            estado = 1;
        } else {
            estado = 0;
        }
        if (!validaciones.contieneSoloLetrasYNumeros(descripDescuento) || !validaciones.esNumeroEntero(cantidadDescuento) || !validaciones.esFechaValida(fechaInicio) || !validaciones.esFechaValida(fechaFin)) {
            manejarValidacionesD();
        } else {
            var descuentosData = {
                id_descuento: idDesc,
                cantidad_descuento: cantidadDescuento,
                descripcion_descuento: descripDescuento,
                fecha_inicio_descuento: fechaInicio,
                estado_descuento: estado,
                fecha_fin_descuento: fechaFin
            };

            const success = await DataAdmin("/descuentos/update", descuentosData, 'PUT');
            if (success.status == 200) {
                obtenerDescuentos();
                cerrarModalD(myGuardarD);
                setTimeout(() => abrirModalD(new bootstrap.Modal(obtenerElementoD('actualizado'))), 500);
            }
        }
    } catch (error) {
        console.log(error);
        manejarErrorD();

    }
};

// Funcion para eliminar los datos
const eliminarDescuentos = async (idDescuento) => {
    try {
        const { success } = await deleteData(`/descuentos/delete/${idDescuento}`);
        if (success) {
            obtenerDescuentos();
            cerrarModalD(myEliminarD);
            setTimeout(() => abrirModalD(new bootstrap.Modal(obtenerElementoD('eliminado'))), 500);
        } else {
            manejarErrorD();
        }
    } catch (error) {
        console.log(error);
        manejarErrorD();

    }

}

const obtenerDescuentosDetalles = async (idDescuento) => {
    try {
        const response = await fetchData(`/descuentos/${idDescuento}`);
        if (response.success) {
            return response.data;

        } else {
            throw new Error('No se pudieron obtener los detalles de los descuentos');
        }
    } catch (error) {
        console.error('Error al obtener los detalles de los descuentos')
        manejarErrorD();
    }

}

const mostrarDescuentos = async (idDescuento) => {
    try {
        const detalles = await obtenerDescuentosDetalles(idDescuento);
        if (detalles) {
            const descuentos = detalles[0];
            obtenerElementoD("cantDescuentoAc").value = descuentos.cantidad_descuento;
            obtenerElementoD("descripcionAc").value = descuentos.descripcion_descuento;
            // Obtener las fechas en el formato de la base de datos
            const fechaInicioDB = descuentos.fecha_inicio_descuento;
            const fechaFinDB = descuentos.fecha_fin_descuento;

            // Convertir las fechas a objetos Date
            const fechaInicio = new Date(fechaInicioDB);
            const fechaFin = new Date(fechaFinDB);

            // Obtener las partes de la fecha que necesitamos
            const fechaInicioFormateada = fechaInicio.toISOString().split('T')[0];
            const fechaFinFormateada = fechaFin.toISOString().split('T')[0];

            // Asignar los valores formateados a los campos de fecha en HTML
            obtenerElementoD("fechaInicioAc").value = fechaInicioFormateada;
            obtenerElementoD("fechaFinAc").value = fechaFinFormateada;
            let estado = descuentos.estado_descuento;
            if (estado == 1) {
                obtenerElementoD("estadoAc").checked
            }

        } else {
            console.error('No se encontraron detalles de inventario para el ID proporcionado.');
            manejarErrorD();
            console.log('jejej')
        }

    } catch (error) {
        manejarErrorD();
        console.log(error);

    }
}

//Funcion para Modal de ver
const verDescuento = async (idDescuento) => {
    try {
        const detallesDescuento = await obtenerDescuentos(idDescuento);
        if (detallesDescuento) {
            const descuentos = detallesDescuento[0];
            obtenerElementoD("cantidadDescVer").value = descuentos.cantidad_descuento;
            obtenerElementoD("descripcionDescVer").innerText = descuentos.descripcion_descuento;

            // Obtener las fechas en el formato de la base de datos
            const fechaInicioDB = descuentos.fecha_inicio_descuento;
            const fechaFinDB = descuentos.fecha_fin_descuento;

            // Convertir las fechas a objetos Date
            const fechaInicio = new Date(fechaInicioDB);
            const fechaFin = new Date(fechaFinDB);

            // Obtener las partes de la fecha que necesitamos
            const fechaInicioFormateada = fechaInicio.toISOString().split('T')[0];
            const fechaFinFormateada = fechaFin.toISOString().split('T')[0];

            // Asignar los valores formateados a los campos de fecha en HTML
            obtenerElementoD("fechaInicioAc").innerText = fechaInicioFormateada;
            obtenerElementoD("fechaFinAc").innerText = fechaFinFormateada;

            let estado = descuentos.estado_descuento;
            // Establecer el estado del checkbox según el valor del estado_descuento
            obtenerElementoD("estadoVer").checked = estado == 1;


        }
    } catch (error) {
        manejarErrorD();
        console.log(error);
    }
};

document.addEventListener("DOMContentLoaded", function () {

    obtenerDescuentos();

    const confirmarEliminarBtn = obtenerElementoD("confirmarEliminar");
    confirmarEliminarBtn.addEventListener('click', async () => {
        if (idDescuento) {
            await eliminarDescuentos(idDescuento);
            idDescuento = null;
        }
    })

    const actualizarDecsuentosBtn = obtenerElementoD("btnActualizar");
    actualizarDecsuentosBtn.addEventListener('click', async () => {
        if (idDescuento) {
            await actualizarDescuentos(idDescuento);
            idDescuento = null;
        }
        await agregarDescuentos();
    });

    const agregarDescuentosBtn = obtenerElementoD("btnAgregarDesc");
    agregarDescuentosBtn.addEventListener('click', async () => {
        await agregarDescuentos();
    });


});