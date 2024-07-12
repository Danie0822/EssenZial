// Declaración de constantes para uso general
const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();
const manejarError = () => abrirModal(myError);

const myError = new bootstrap.Modal(obtenerElemento('errorModal'));

const idPedido = sessionStorage.getItem("id_pedido");

//Funcion para formatear la fecha a una legible por el usuario
const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

//Funcion para obtener detalles de pedido 
const obtenerDetalles = async () => {
    try {
        const { success, data } = await fetchData(`/pedidos/procedure/details/${idPedido}`);

        if (success) {
            actualizarDetallesPedido(data[0]);
        } else {
            console.error("Error al obtener los detalles del pedido");
        }
    } catch (error) {
        manejarError();
        console.error("Error en la solicitud:", error);
    }
};

// Funcion para setear datos del pedido
const actualizarDetallesPedido = (data) => {
    const pedido = data[0]; // Acceder al primer elemento del array de datos
    const fechaFormateada = formatearFecha(pedido.fecha_pedido);

    try {
        // Actualizar la información del pedido
        obtenerElemento('numPedido').innerText = `Pedido número: #${pedido.id_pedido}`;
        obtenerElemento('fechaPedido').innerText = fechaFormateada;
        obtenerElemento('totalPedido').innerText = pedido.total_pago;

        if (pedido.estado_pedido === 'Preparandose') {
            obtenerElemento('estadoPedido').innerText = `Tu orden está siendo preparada con éxito`;
        }
        else if (pedido.estado_pedido === 'Enviando') {
            obtenerElemento('estadoPedido').innerText = `Tu orden está siendo enviada con éxito`;
        }
        else {
            obtenerElemento('estadoPedido').innerText = `Tu orden ha finalizado con éxito`;
        }


        // Limpiar el contenedor de productos
        const contenedorProductos = document.getElementById('contenedorProductos');
        contenedorProductos.innerHTML = '';

        // Añadir los productos al contenedor
        data.forEach(producto => {
            const productoElemento = document.createElement('div');
            productoElemento.className = 'row';
            productoElemento.innerHTML = `
            <div class="col-md-2 text-center">
                <img src="${imagen}${producto.ruta_imagen}" style="max-width: 100%;">
            </div>
            <div class="col-md-6 pt-4">
                <h5>${producto.nombre_inventario}</h5>
                <p>${producto.nombre_marca}</p>
            </div>
            <div class="col-md-4 col-xs-12 text-right pt-4">
                <div class="row">
                    <div class="col-cm-6 pr-5 pl-3">
                        <h5>Cant: ${producto.cantidad_producto}</h5>
                    </div>
                    <div class="col-cm-6">
                        <h5>$${producto.precio_inventario}</h5>
                    </div>
                </div>
            </div>
            <hr>
        `;
            contenedorProductos.appendChild(productoElemento);
        });

        // Actualizar la información del cliente
        obtenerElemento('nombreCliente').innerText = pedido.nombre_cliente;
        obtenerElemento('apellidoCliente').innerText = pedido.apellido_cliente;
        obtenerElemento('correoCliente').innerText = pedido.correo_cliente;
        obtenerElemento('telCliente').innerText = pedido.telefono_cliente;

        // Actualizar la información de la dirección
        obtenerElemento('nombreDireccion').innerText = pedido.nombre_direccion;
        obtenerElemento('direccion').innerText = pedido.direccion_cliente;
        obtenerElemento('telDireccion').innerText = pedido.telefono_cliente;
        obtenerElemento('codigoPostal').innerText = pedido.codigo_postal;
    } catch (error) {
        manejarError();
        console.error("Error al cargar los datos:", error);

    }
};

const obtenerFactura = async () =>{
    try{
        const blobResponse = await fetchPdfAndBlobCliente(`/pedidos/reporte/factura/${idPedido}/`, token);
        if(!blobResponse.ok){
            throw new Error('Error al descargar el reporte en PDF');
        }
        const blob = await blobResponse.blob();
        descargarArchivo(blob, 'factura.pdf');
    }catch(error){
        console.error('Error al obtener el reporte:', error);
        manejarError();
    }
}

//Funcion que ejecuta el codigo al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {

    obtenerDetalles();

});

