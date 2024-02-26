const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

    const openCreate = () => {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Crear producto';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        /*EXISTENCIAS_PRODUCTO.disabled = false;
        fillSelect(CATEGORIA_API, 'readAll', 'categoriaProducto');*/
    }