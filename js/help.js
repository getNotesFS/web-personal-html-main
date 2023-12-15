document.addEventListener('DOMContentLoaded', function() {
    const helpBtn = document.getElementById('helpBtn');
    const keyGuideDialog = document.getElementById('keyGuideDialog');
    const closeDialogBtn = document.getElementById('closeDialogBtn');

    helpBtn.addEventListener('click', function() {
        keyGuideDialog.showModal(); // O .show(), dependiendo de cómo quieras que se comporte
    });

    closeDialogBtn.addEventListener('click', function() {
        keyGuideDialog.close();
    });
//Keydown H para para abrir
    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 72) {
            keyGuideDialog.showModal();
        }
    });
    //Keydown escape para cerrar
    keyGuideDialog.addEventListener('keydown', function(event) {
        if (event.keyCode === 27) {
            keyGuideDialog.close();
        }
    });

    // Click fuera del dialog para cerrar
    keyGuideDialog.addEventListener('click', function(event) {
        if (event.target === keyGuideDialog) {
            keyGuideDialog.close();
        }
    });

    // C para abrir formulario de contacto
    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 67) {
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
