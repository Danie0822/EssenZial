function showContent(contentName) {
    var iframe = document.getElementById('content');
    switch (contentName) {
        case 'administrador':
            iframe.src = 'administrador.html';
            break;
        case 'clientes':
            iframe.src = 'clientes.html';
            break;
        default:
            iframe.src = 'default.html';
    }
}
window.onload = function() {
    // Llamamos a la función para mostrar el contenido predeterminado
    showContent('administrador');
};