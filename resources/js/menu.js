function showContent(contentName) {
    var iframe = document.getElementById('content');
    switch (contentName) {
        case 'dashboard':
            iframe.src = 'dashboard.html';
            break;
        case 'gamas':
            iframe.src = 'gamas.html';
            break;
        case 'inventario':
            iframe.src = 'inventario.html';
            break;
        case 'pedidos':
            iframe.src = 'pedido.html';
            break;
        case 'usuarios':
            iframe.src = 'usuarios.html';
            break;
        default:
            iframe.src = 'default.html';
    }
}