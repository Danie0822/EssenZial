//Declaración de constantes para uso general
const obtenerElementoD = (id) => document.getElementById(id);
const abrirModalD = (modal) => modal.show();
const cerrarModalD = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);
const manejarValidaciones = () => abrirModal(validationsModal);

//Declaracion de constantes para obtener los modals necesarios a ocupar
const myActualizar = new bootstrap.Modal(obtenerElementoD('descuentoModalA'));
const myGuardar = new bootstrap.Modal(obtenerElementoD('descuentoModal'));
const myEliminar = new bootstrap.Modal(obtenerElementoD('eliminarDescuentoM'));
const myVer = new bootstrap.Modal(obtenerElementoD('detallesDescuentoModal'));
const myError = new bootstrap.Modal(obtenerElementoD('errorModal'));

let idDescuento = null;


const obtenerDescuentos = async () => {
    try{

        const { success, data } = await fetchData('/descuentos');
        const tbody = obtenerElementoD('tableBody');
        tbody.innerHTML = '';

        if(success){
            data.forEach(({id_descuento, cantidad_descuento, estado_descuento}) =>{
                const tr = document.createElement('tr');
                tr.innerHTML =`
                <td>${cantidad_descuento}</td>
                <td>${estado_descuento}</td>
                <td>
                    <button type="button" class="btn btn-dark" ><i class="fas fa-edit" onclick="abrirDescuentosActualizar(${id_descuento})"></i></button>
                    <button type="button" class="btn btn-dark" onclick="abrirDescuentosVer(${id_descuento})"><i class="fas fa-info-circle"></i>
                    </button>
                    <button type="button" class="btn btn-dark" onclick="abrirDescuentosEliminar(${id_descuento})"><i class="fas fa-trash-alt"></i> </button>


                </td>
                `;
                tbody.appendChild(tr);
            });
        }
        else{
            manejarError();
        }
    }catch(error){
        manejarError();
    }

};


async function abrirDescuentos( ){
    abrirModalD (myGuardar);
}

const abrirDescuentosActualizar = (idDescuentos) => {
    if(idDescuentos){
        idDescuento = idDescuentos;
        mostrarDescuentos(idDescuentos);
        abrirModalD (myActualizar);
    }

}

const abrirDescuentosEliminar = (idDescuentos) =>{
    if(idDescuentos){
        idDescuento = idDescuentos;
        abrirModalD (myEliminar);
    }else{
        manejarError();
    }

}

const abrirDescuentosVer = (idDescuentos) =>{
    if(idDescuentos){
        verDescuento(idDescuentos);
        idDescuento = idDescuentos;
        abrirModalD(myVer);
    }else{
        manejarError();
    }
}

const mostrarDescuentos = async (idDescuento) =>{

}

const verDescuento = async (idDescuento) =>{

}

document.addEventListener("DOMContentLoaded", function(){

    obtenerDescuentos();
})