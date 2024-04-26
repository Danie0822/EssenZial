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

let idInventario = null;

const obtenerInventario = async () => {
    try {
        const { success, data } = await fetchData('/inventarios');
        const tbody = obtenerElemento('tableBody');
        tbody.innerHTML = '';

        if (success) {
            data.forEach(({ id_inventario, nombre_inventario, precio_inventario }) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${nombre_inventario}/td>
                    <td>$${precio_inventario}</td>
                    <td>

                    <button type="button" class="btn btn-dark"></i></button>
                    <button type="button" class="btn btn-dark"><i class="fas fa-info-circle"></i></button>
                    <button type="button" class="btn btn-dark"><i class="fas fa-star"></i></button>
                    <button type="button" class="btn btn-dark"><i class="fas fa-trash-alt"></i> </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });else{
                manejarError();
            }
        }
    }
    catch(error){
        manejarError();
    }
}


