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
                    <button type="button" class="btn btn-dark" onclick="abrirDescuentosVer(${id_descuento})"><i class="fas fa-info-circle"></i></button>
                    <button type="button" class="btn btn-dark" onclick="abrirDescuentosEliminar(${id_descuento})"><i class="fas fa-trash-alt"></i> </button>
                </td>
                `;
                tbody.appendChild(tr);
            });
        }
        else{
            manejarErrorD();
        }
    }catch(error){
        manejarErrord();
    }

};


async function abrirDescuentos( ){
    abrirModalD(myGuardarD);
}

const abrirDescuentosActualizar = (idDescuentos) => {
    if(idDescuentos){
        idDescuento = idDescuentos;
        mostrarDescuentos(idDescuentos);
        abrirModalD (myActualizarD);
    }

}

const abrirDescuentosEliminar = (idDescuentos) =>{
    if(idDescuentos){
        idDescuento = idDescuentos;
        abrirModalD (myEliminarD);
    }else{
        manejarError();
    }

}

const abrirDescuentosVer = (idDescuentos) =>{
    if(idDescuentos){
        verDescuento(idDescuentos);
        idDescuento = idDescuentos;
        abrirModalD(myVerD);
    }else{
        manejarError();
    }
}

//Funcion para agregar descuentos
const agregarDescuentos = async () =>{
    try{

        const check = obtenerElementoD("estadoDescuento");

        let estado = null;
        const cantidadDescuento = obtenerElementoD("cantidadDescuento").value;
        const descripDescuento = obtenerElementoD("descripcionDescuento").value;
        const fechaInicio = obtenerElementoD("fechaIDescuento").value;
        const fechaFin = obtenerElementoD("fechaFDescuento").value;
        console.log(fechaInicio)

        if(check.checked){
            estado = 1;
        }else{
            estado = 0;
        }

        if(!validaciones.contieneSoloLetrasYNumeros(descripDescuento)|| !validaciones.esNumeroEntero(cantidadDescuento) || !validaciones.esFechaValida(fechaInicio) || !validaciones.esFechaValida(fechaFin)){
            manejarValidacionesD();
        }else{
            var descuentosData = {
                cantidad_descuento: cantidadDescuento,
                descripcion_descuento: descripDescuento,
                fecha_inicio_descuento : fechaInicio,
                estado_descuento : estado,
                fecha_fin_descuento: fechaFin
            };

            const success = await DataAdmin("/descuentos/save", descuentosData, 'POST');
            if(success.status == 200){
                obtenerDescuentos();
                cerrarModalD(myGuardarD);
                setTimeout(() => abrirModalD(new bootstrap.Modal(obtenerElementoD('agregado'))), 500);
            }
        }
    }catch(error){
        console.log(error);
        manejarErrorD();
    }
};

const mostrarDescuentos = async (idDescuento) =>{

}

const verDescuento = async (idDescuento) =>{

}

document.addEventListener("DOMContentLoaded", function(){

    obtenerDescuentos();

    const agregarDescuentosBtn = obtenerElementoD("btnAgregarDesc");
    agregarDescuentosBtn.addEventListener('click', async () => {
        await agregarDescuentos();
    });


});