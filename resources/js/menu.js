function showContent(contentName) {
    var iframe = document.getElementById('content');
    switch (contentName) {
        case 'gamas':
            iframe.src = 'gamas.html';
            break;
        case 'olores':
            iframe.src = 'olores.html';
            break;
        case 'categorias':
            iframe.src = 'categorias.html';
            break;
        default:
            iframe.src = 'default.html';
    }
}