function showContent(contentName) {
    var iframe = document.getElementById('content');
    switch (contentName) {
        case 'marcas':
            iframe.src = 'marcas.html';
            break;
        case 'olores':
            iframe.src = 'olores.html';
            break;
        case 'categorias':
            iframe.src = 'categorias.html';
            break;
            case 'descuentos':
                iframe.src = 'descuento.html';
                break;
        default:
            iframe.src = 'default.html';
    }
}
window.onload = function() {
    // Llamamos a la función para mostrar el contenido predeterminado
    showContent('marcas');
};