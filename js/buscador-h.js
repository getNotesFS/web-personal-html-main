 
  


    // Función para cargar y almacenar contenido de las páginas
function cargarContenido() {
    const paginas = ['../index.html', '../musica.html', '../peliculas.html','../sobre-mi.html', 'index.html', '../hobbies/fotografia.html', '../hobbies/videojuegos.html', '../hobbies/senderismo.html'];
  
    paginas.forEach(url => {
        fetch(url).then(response => response.text()).then(html => {
            localStorage.setItem(url, html); // Guardar contenido en localStorage
        });
    });
}



function buscar(query) {
    if (query.length < 1) {
        return [];
    }
    const resultados = [];
    const etiquetas = ['title', 'p', 'a', 'h1', 'h2', 'h3', 'h4', 'figcaption', 'img'];
    const paginas = ['../index.html', '../musica.html', '../peliculas.html','../sobre-mi.html', 'index.html', '../hobbies/fotografia.html', '../hobbies/videojuegos.html', '../hobbies/senderismo.html'];
  
    paginas.forEach(url => {
        const contenido = localStorage.getItem(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(contenido, 'text/html');

        // Obtener el título de la página
        const titulo = obtenerTituloPagina(contenido);

        etiquetas.forEach(etiqueta => {
            const elementos = doc.querySelectorAll(etiqueta);
            elementos.forEach(elemento => {
                if (elemento.textContent.toLowerCase().includes(query.toLowerCase())) {
                    const texto = elemento.textContent;
                    const startIndex = texto.toLowerCase().indexOf(query.toLowerCase());
                    const endIndex = startIndex + query.length;
                    const fragmentStart = Math.max(startIndex - 100, 0);
                    const fragmentEnd = Math.min(endIndex + 100, texto.length);
                    const fragment = texto.substring(fragmentStart, fragmentEnd).replace(new RegExp(query, 'gi'), `<mark>${query}</mark>`);

                    resultados.push({ url, titulo, fragment });
                }
            });
        });
    });

    return resultados;
}


function obtenerTituloPagina(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const titleElement = doc.querySelector('title');
    return titleElement ? titleElement.textContent : '';
}



// Función para mostrar resultados
function mostrarResultados(resultados) {
    const resultadosDiv = document.getElementById('resultados-busqueda');

    if (resultados.length === 0) {
        resultadosDiv.innerHTML = '<p>No se encontraron resultados.</p>';
    } else {
        resultadosDiv.innerHTML = '';
        resultados.forEach(({ url, fragment, titulo }) => {
            // Verificar si el fragmento contiene una etiqueta de imagen
            const hasImage = /<img.*?>/.test(fragment);
            const cut_title = titulo.split('-');
            const title_part = cut_title[0].trim(); // trim() para eliminar espacios en blanco alrededor

            // Si contiene una imagen, agregarla a los resultados
            if (hasImage) {
                resultadosDiv.innerHTML += `
                    <a class="search-resultados" href="${url}">${url}
                        <div>${fragment}</div>
                    </a>`;
            } else {
                resultadosDiv.innerHTML += `
                    <a class="search-resultados" href="${url}"><b>Página: ${title_part}</b><p>${fragment}</p></a>`;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', cargarContenido);


document.addEventListener('DOMContentLoaded', () => {
    const maxAttempts = 10; // Número máximo de intentos
    let currentAttempt = 0;

    const checkElementInterval = setInterval(() => {
        const searchContainer = document.getElementById('search_main_container');
        const botonBuscar = document.getElementById('boton-buscar');
        const btnBuscar = document.getElementById('btn-buscar');
        const campoBuscar = document.getElementById('campo-buscar');

        if (searchContainer && botonBuscar && campoBuscar) {
            // Si todos los elementos están presentes, detener el intervalo y agregar los eventos
            clearInterval(checkElementInterval);

            const ejecutarBusqueda = () => {
                const query = campoBuscar.value;
                const resultados = buscar(query);
                mostrarResultados(resultados);
            };

            btnBuscar.addEventListener('click', () => {
                console.log("Click en boton buscar");
                searchContainer.classList.toggle('show');
                document.getElementById('overlay').classList.toggle('show');
                setTimeout(() => {
                    campoBuscar.focus();
                }, 200); // Ajusta el tiempo según sea necesario
            });

            botonBuscar.addEventListener('click', () => {

                campoBuscar.focus(); // Enfocar el campo de búsqueda al abrir el contenedor
                ejecutarBusqueda(); // Ejecutar búsqueda al hacer clic en el botón
            });

            campoBuscar.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') { 
                    searchContainer.classList.remove('show');
                    document.getElementById('overlay').classList.remove('show');
                } else if (event.key === 'Enter') {
                    // Ejecutar la búsqueda cuando se presiona "ENTER"
                    ejecutarBusqueda();
                }
            });

            console.log("Elementos encontrados y eventos agregados.");
        } else {
            // Si los elementos no están presentes y no se ha alcanzado el número máximo de intentos, continuar verificando
            currentAttempt++;
            if (currentAttempt >= maxAttempts) {
                // Si se supera el número máximo de intentos, detener el intervalo
                clearInterval(checkElementInterval);
                console.log("Elementos no encontrados después de varios intentos.");
            }
        }
    }, 1000); // Verificar cada segundo (puedes ajustar el intervalo según tus necesidades)


    const searchContainer = document.getElementById('search_main_container');
    const campoBuscar = document.getElementById('campo-buscar');

    // Escuchar los eventos de teclado en el campo de búsqueda
    campoBuscar.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Cerrar el contenedor cuando se presiona "ESCAPE"
            searchContainer.classList.remove('show');
            document.getElementById('overlay').classList.remove('show');
        } else if (event.key === 'Enter') {
            // Ejecutar la búsqueda cuando se presiona "ENTER"
            const query = campoBuscar.value;
            const resultados = buscar(query);
            mostrarResultados(resultados);
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const searchContainer = document.getElementById('search_main_container');
    const campoBuscar = document.getElementById('campo-buscar');
    let btnBuscar = document.getElementById('btn-buscar');

    if (!searchContainer || !campoBuscar) {
        console.error("Algunos elementos esenciales no se encontraron en el DOM.");
        return;
    }

    const intentarEncontrarBtnBuscar = setInterval(() => {
        btnBuscar = document.getElementById('btn-buscar');
        if (btnBuscar) {
            clearInterval(intentarEncontrarBtnBuscar);
            agregarEventListeners();
        }
    }, 100); // Intentar cada 100ms

    function agregarEventListeners() {
        // Event listener para cerrar el contenedor al presionar "Escape"
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                searchContainer.classList.remove('show');
                document.getElementById('overlay').classList.remove('show');
            }
        });

        // Event listener para simular clic en el botón al presionar "Mayúsculas + S"
        document.addEventListener('keydown', (event) => {
            if (event.key === 'S' || event.key === 's') {
                btnBuscar.click(); // Simula un clic en el botón de búsqueda
                //document.getElementById('overlay').classList.toggle('show'); // Muestra el overlay
        
                // Establece un temporizador para enfocar el campo de búsqueda después de un breve retraso
                setTimeout(() => {
                    campoBuscar.focus();
                }, 300); // Ajusta el tiempo según sea necesario
            }
        });
    }
});


document.getElementById('overlay').addEventListener('click', function(event) {
    const overlay_search = document.getElementById('overlay');
    const searchContainer = document.getElementById('search_main_container'); 

    // Verificar si la ventana de búsqueda está abierta (visible)
    if (searchContainer.classList.contains('show')) {
        // Cerrar la ventana de búsqueda
         overlay_search.classList.remove('show');
         searchContainer.classList.remove('show');
    }
}
);

 


 