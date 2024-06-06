// Declaración de constantes para uso general
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);


const myError = new bootstrap.Modal(obtenerElemento('errorModalPe'));
let idPedido = null;

//Funcion para formatear la fecha a una legible por el usuario
const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

//Funcion para obtener los pedidos segun estado especifico 
const obtenerPedidos = async (estado, tabId) => {
    try {
        const { success, data } = await fetchData(`/pedidos/view/status/${estado}`);

        if (success) {
            const tabContent = obtenerElemento(tabId);
            tabContent.innerHTML = '';


            data.forEach(({ id_pedido, fecha_pedido }) => {
                const fechaFormateada = formatearFecha(fecha_pedido);
                const pedidoHtml = `
                <div class="row paneles">
                    <div class="col-6">
                        <h6>Pedido numero #<label>${id_pedido}</label></h6>
                        <p class="titleTwo">Fecha del pedido: <label class="lb">${fechaFormateada}</label></p>
                        <button type="button" class="btn detalles" onclick="abrirDetalles(${id_pedido})">Ver detalles</button>
                    </div>
                    <div class="col-6">
                        <p class="titleTwo">Método de pago: <label class="lb">Contra entrega</label></p>
                    </div>
                </div>
                `;
                tabContent.insertAdjacentHTML('beforeend', pedidoHtml);
            });
        } else {
            manejarError();
            console.error('Error al enviar solicitud:', result.message);
        }
    } catch (error) {
        manejarError();
        console.error(error);
    }
};

//funcion para abrir detalles
function abrirDetalles(idPedido){
     // Redirigir a la página de imágenes.html con el ID como parámetro en la URL
     window.location.href = `detalle_orden.html`;
     sessionStorage.setItem("id_pedido", idPedido);
};

//Funcion para asignar pedidos segun estado en tab bar
const pedidos = async () => {
    await obtenerPedidos('preparandose', 'preparandoseTab');
    // No cargar 'enviando' y 'finalizado' al inicio
};

//Funcion para asignar pedidos segun estado en tab bar
const pedidoEnviado = async () => {
    await obtenerPedidos('enviando', 'enviandoTab');
};

//Funcion para asignar pedidos segun estado en tab bar
const pedidoFinalizado = async () => {
    await obtenerPedidos('finalizado', 'finalizadoTab');
};

// Llamar a la función para obtener 'preparandose' al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    pedidos();
});
