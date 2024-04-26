const obtenerElemento = (id) => document.getElementById(id);

const obtenerPedidos = async () => {
    try {
        const { success, data } = await fetchData("/pedidos");
        const tbody = obtenerElemento("tablaBody");
        tbody.innerHTML = "";

        if (success) {
            data.forEach(({ id_pedidos, fecha_pedido, estado_pedido, tipo_pago }) => {
                // Formatear la fecha
                const fechaFormateada = new Date(fecha_pedido).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
                const formaPago = tipo_pago === 1 ? 'Efectivo' : 'Tarjeta';
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${fechaFormateada}</td> 
                    <td>${estado_pedido}</td> 
                    <td>${formaPago}</td> 
                    <td class="text-center">
                        <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#Actualizar"><i class="fas fa-edit"></i></button>
                        <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#eliminar"><i class="fas fa-trash-alt"></i></button>
                        <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#detallesModal"><i class="fas fa-info-circle"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            manejarError();
        }
    } catch (error) {
        manejarError();
    }
};


document.addEventListener("DOMContentLoaded", function () {

    obtenerPedidos();
});