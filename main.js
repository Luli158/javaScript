document.addEventListener('DOMContentLoaded', () => {
    const listaTareas = document.getElementById('listaTareas');
    const tareasPredeterminadas = document.getElementById('tareasPredeterminadas');
    const listaPapelera = document.getElementById('listaPapelera');
    const formularioTarea = document.getElementById('formularioTarea');
    const tituloTarea = document.getElementById('tituloTarea');
    const descripcionTarea = document.getElementById('descripcionTarea');
    const prioridadTarea = document.getElementById('prioridadTarea');

    let tareas = [];
    let papelera = [];

    // Cargar tareas predeterminadas desde JSON
    const getPred = async () => {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al cargar tareas desde el archivo JSON:', error);
            return [];
        }
    };

    // Agregar tareas predeterminadas
    const agregarPred = (tareasPred) => {
        tareasPredeterminadas.innerHTML = '';
        tareasPred.forEach((tarea, indice) => {
            const tareaElement = document.createElement('li');
            tareaElement.innerHTML = `
                <h3>${tarea.titulo}</h3>
                <p>${tarea.descripcion}</p>
                <strong>Prioridad: ${tarea.prioridad}</strong>
                <button class="agregar">Agregar</button>
            `;
            tareaElement.querySelector('.agregar').addEventListener('click', () => agregarTarea(tarea));
            tareasPredeterminadas.appendChild(tareaElement);
        });
    };

    // Agregar tareas en la lista principal
    const agregarTareas = () => {
        listaTareas.innerHTML = '';
        tareas.forEach((tarea, indice) => {
            const tareaElement = document.createElement('li');
            tareaElement.classList.add('tarea');
            tareaElement.innerHTML = `
                <h3>${tarea.titulo}</h3>
                <p>${tarea.descripcion}</p>
                <strong>Prioridad: ${tarea.prioridad}</strong>
                <div class="acciones">
                    <button class="completar">✓ Completar</button>
                    <button class="editar">✎ Editar</button>
                    <button class="eliminar">🗑️ Eliminar</button>
                </div>
            `;

            tareaElement.querySelector('.completar').addEventListener('click', () => completarTarea(indice));
            tareaElement.querySelector('.editar').addEventListener('click', () => editarTarea(indice));
            tareaElement.querySelector('.eliminar').addEventListener('click', () => eliminarTarea(indice));
            listaTareas.appendChild(tareaElement);
        });
    };

    // Agregar a papelera
    const agregarPapelera = () => {
        listaPapelera.innerHTML = '';
        papelera.forEach((tarea, indice) => {
            const tareaElement = document.createElement('li');
            tareaElement.innerHTML = `
                <h3>${tarea.titulo}</h3>
                <p>${tarea.descripcion}</p>
                <strong>Prioridad: ${tarea.prioridad}</strong>
                <button class="restaurar">Restaurar</button>
            `;
            tareaElement.querySelector('.restaurar').addEventListener('click', () => restaurarTarea(indice));
            listaPapelera.appendChild(tareaElement);
        });
    };

    // Agregar una tarea a la lista
    const agregarTarea = (tarea) => {
        tareas.push(tarea);
        guardarTareas();
        agregarTareas();
    };

    // Completar una tarea
    const completarTarea = (indice) => {
        Swal.fire('¡Tarea completada!', `Has completado la tarea: ${tareas[indice].titulo}`, 'success');
        tareas.splice(indice, 1);
        guardarTareas();
        agregarTareas();
    };

    // Editar una tarea
    const editarTarea = (indice) => {
        Swal.fire({
            title: 'Editar tarea',
            html: `
                <input id="titulo" class="swal2-input" value="${tareas[indice].titulo}">
                <textarea id="descripcion" class="swal2-textarea">${tareas[indice].descripcion}</textarea>
            `, 
            confirmButtonText: 'Guardar',
            customClass: {
                confirmButton: 'agregar'
            },
            preConfirm: () => {
                const nuevoTitulo = document.getElementById('titulo').value;
                const nuevaDescripcion = document.getElementById('descripcion').value;
                if (nuevoTitulo && nuevaDescripcion) {
                    tareas[indice].titulo = nuevoTitulo;
                    tareas[indice].descripcion = nuevaDescripcion;
                    guardarTareas();
                    agregarTareas();
                    Swal.fire({
                        title: 'Tarea editada',
                        text: 'La tarea ha sido actualizada correctamente',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'agregar',
                        }
                    });
                }
            },
        });
    };

    // Eliminar una tarea (envia a la papelera)
    const eliminarTarea = (indice) => {
        Swal.fire({
            title: '¿Estás seguro que quiere eliminar la tarea?',
            text: "Se enviara la tarea a la papelera.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'agregar',
                cancelButton: 'agregar',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                papelera.push(tareas[indice]);
                tareas.splice(indice, 1);
                guardarTareas();
                guardarPapelera();
                agregarTareas();
                agregarPapelera();
                Swal.fire({
                    title: 'Eliminada',
                    text: 'La tarea ha sido enviada a la papelera',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'agregar',
                    }
                });
            }
        });
    };

    // Restaurar una tarea de la papelera
    const restaurarTarea = (indice) => {
        tareas.push(papelera[indice]);
        papelera.splice(indice, 1);
        guardarTareas();
        guardarPapelera();
        agregarTareas();
        agregarPapelera();
    };

    // Guardar las tareas en localStorage
    const guardarTareas = () => {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    };

    // Guardar la papelera en localStorage
    const guardarPapelera = () => {
        localStorage.setItem('papelera', JSON.stringify(papelera));
    };

    // Cargar lista de tareas desde el localStorage
    const cargarTareas = async () => {
        const tareasGuardadas = localStorage.getItem('tareas');
        if(tareasGuardadas){
            tareas = JSON.parse(tareasGuardadas);
        }
        agregarTareas();
    };

    // Cargar las tareas predeterminadas desde JSON
    const cargarTareasPred = async () => {
            const tareasPred = await getPred();
            agregarPred(tareasPred);
    };

    // Cargar papelera desde localStorage
    const cargarPapelera = () => {
        const papeleraGuardada = localStorage.getItem('papelera');
        if (papeleraGuardada) {
            papelera = JSON.parse(papeleraGuardada);
        }
        agregarPapelera();
    };

    // formulario
    formularioTarea.addEventListener('submit', (e) => {
        e.preventDefault();
        const nuevaTarea = {
            titulo: tituloTarea.value,
            descripcion: descripcionTarea.value,
            prioridad: prioridadTarea.value
        };
        agregarTarea(nuevaTarea);
        formularioTarea.reset();
    });

    // Cargar tareas y papelera al iniciar
    cargarTareas();
    cargarTareasPred();
    cargarPapelera();
});
