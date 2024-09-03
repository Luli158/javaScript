document.addEventListener('DOMContentLoaded', () => {
    const formularioTarea = document.getElementById('formularioTarea');
    const listaTareas = document.getElementById('listaTareas');
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    const guardarTareas = () => {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    };

    const renderizarTareas = () => {
        listaTareas.innerHTML = '';
        tareas.forEach((tarea, indice) => {
            const li = document.createElement('li');
            li.className = `prioridad-${tarea.prioridad}`;
            if (tarea.completada) {
                li.classList.add('completada');
            }

            li.innerHTML = `
                <strong>${tarea.titulo}</strong> - ${tarea.descripcion}
                <div class="acciones"></div>
            `;

            const divAcciones = li.querySelector('.acciones');

            const botonCompletar = document.createElement('button');
            botonCompletar.textContent = '✓';
            botonCompletar.addEventListener('click', () => completarTarea(indice));

            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = '🗑️';
            botonEliminar.addEventListener('click', () => eliminarTarea(indice));

            divAcciones.appendChild(botonCompletar);
            divAcciones.appendChild(botonEliminar);

            listaTareas.appendChild(li);
        });
    };

    const completarTarea = (indice) => {
        tareas[indice].completada = !tareas[indice].completada;
        guardarTareas();
        renderizarTareas();
    };

    const eliminarTarea = (indice) => {
        tareas.splice(indice, 1);
        guardarTareas();
        renderizarTareas();
    };

    formularioTarea.addEventListener('submit', (e) => {
        e.preventDefault();
        const titulo = document.getElementById('tituloTarea').value;
        const descripcion = document.getElementById('descripcionTarea').value;
        const prioridad = document.getElementById('prioridadTarea').value;

        agregarTarea(titulo, descripcion, prioridad);

        formularioTarea.reset();
    });

    const agregarTarea = (titulo, descripcion, prioridad) => {
        tareas.push({ titulo, descripcion, prioridad, completada: false });
        guardarTareas();
        renderizarTareas();
    };

    renderizarTareas();
});
