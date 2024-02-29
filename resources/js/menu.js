function showContent(contentName) {
    var iframe = document.getElementById('content');
    switch (contentName) {
        case 'gamas':
            iframe.src = 'gamas.html';
            break;
        case 'inventario':
            iframe.src = 'inventario.html';
            break;
        case 's':
            iframe.src = 'inventario.html';
            break;
        default:
            iframe.src = 'default.html';
    }
}