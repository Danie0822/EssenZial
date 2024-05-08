//Declaración de constantes para uso general
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);

//Declaracion de constantes para obtener los modals necesarios a ocupar
const myActualizar = new bootstrap.Modal(obtenerElemento('descuentoModalA'));
const myGuardar = new bootstrap.Modal(obtenerElemento('descuentoModal'));
const myEliminar = new bootstrap.Modal(obtenerElemento('eliminarDescuentoM'));
const myVer = new bootstrap.Modal(obtenerElemento('detallesDescuentoModal'));
const myPuntaje = new bootstrap.Modal(obtenerElemento('valoracionesModal'));
const myError = new bootstrap.Modal(obtenerElemento('errorModal'));
const validationsModal = new bootstrap.Modal(obtenerElemento('validationsModal'));

let idDescuento = null;


const obtenerDescuentos = async () => {
    try{

        const { success, data } = await fetchData('/descuentos');
        const tbody = obtenerElemento('tableBody');
        tbody.innerHTML = '';

        if(success){
            data.forEach(({id_descuento, cantidad_descuento, estado_descuento}) =>{
                const tr = document.createElement('tr');
                tr.innerHTML =`
                <td>10 %</td>
                <td>Activo</td>
                <td>
                    <button type="button" class="btn btn-dark" data-toggle="modal"
                        data-target="#descuentoModalA"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-dark" data-toggle="modal"
                        data-target="#detallesDescuentoModal"><i class="fas fa-info-circle"></i>
                    </button>
                    <button type="button" class="btn btn-dark" data-toggle="modal"
                        data-target="#eliminar"><i class="fas fa-trash-alt"></i> </button>


                </td>
                `
            });
        }


    }catch(error){

    }

}