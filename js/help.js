document.addEventListener('DOMContentLoaded', function () {
    const helpBtn = document.getElementById('helpBtn');
    const keyGuideDialog = document.getElementById('keyGuideDialog');
    const closeDialogBtn = document.getElementById('closeDialogBtn');

    helpBtn.addEventListener('click', function () {
        keyGuideDialog.showModal(); // O .show(), dependiendo de cómo quieras que se comporte
    });

    closeDialogBtn.addEventListener('click', function () {
        keyGuideDialog.close();
    });

    // Keydown H o Shift + H para abrir
    document.addEventListener('keydown', function (event) {
        if ((event.shiftKey && (event.key === 'H' || event.key === 'h'))) {
            keyGuideDialog.showModal();
        }
    });

    // Keydown escape para cerrar
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            keyGuideDialog.close();
        }
    });

    // Click fuera del dialog para cerrar
    keyGuideDialog.addEventListener('click', function (event) {
        if (event.target === keyGuideDialog) {
            keyGuideDialog.close();
        }
    });

    // C o Shift + C para abrir formulario de contacto
    document.addEventListener('keydown', function (event) {
        if (event.shiftKey && (event.key === 'C' || event.key === 'c')) {
            // Verifica si la URL actual contiene '/hobbies'
            if (window.location.href.includes('/hobbies')) {
                // Redirige a "../sobre-mi.html#contacto" si se encuentra '/hobbies'
                window.location.href = "../sobre-mi.html#contacto";
            } else {
                // Redirige a "./sobre-mi.html#contacto" si no se encuentra '/hobbies'
                window.location.href = "./sobre-mi.html#contacto";
            }
        }
    });
});
