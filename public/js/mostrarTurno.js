document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('verHorarios').onclick = function() {
        obtenerTurnosDisponibles();
    };

    function obtenerTurnosDisponibles() {
        const especialidadId = document.getElementById('especialidad').value;
        const sucursalId = document.getElementById('sucursal').value;
        const profesionalId = document.getElementById('profesional').value;
    
        if (especialidadId && sucursalId && profesionalId) {
            document.getElementById('listaTurnos').innerHTML = ''; 
            document.getElementById('resultadosTurnos').style.display = 'block'; 
            document.getElementById('confirmacionContainer').style.display = 'none';
    
            fetch(`/turnos/turnos-disponibles/${especialidadId}/${sucursalId}/${profesionalId}`)
                .then(response => response.json())
                .then(turnos => {
                    const listaHorarios = document.getElementById('listaTurnos');
                    if (turnos.length === 0) {
                        const noTurnos = document.createElement('li');
                        noTurnos.classList.add('list-group-item');
                        noTurnos.textContent = 'No hay turnos disponibles en esta fecha.';
                        listaHorarios.appendChild(noTurnos);
                    } else {
                        turnos.forEach(turno => {
                            const listItem = document.createElement('li');
                            listItem.classList.add('list-group-item');
                            listItem.textContent = `Turno: ${new Date(turno.fecha).toLocaleDateString()} - ${turno.hora}`;
    
                            const selectButton = document.createElement('button');
                            selectButton.textContent = 'Seleccionar';
                            selectButton.classList.add('btn', 'btn-success', 'ml-3');
                            selectButton.onclick = () => {
                                mostrarBotonConfirmacion(turno); 
                            };
                            
                            listItem.appendChild(selectButton);
                            listaHorarios.appendChild(listItem);
                        });
                    }
                })
                .catch(error => console.error('Error al cargar turnos disponibles:', error));
        } else {
            alert('Por favor, seleccione especialidad, sucursal y profesional.');
        }
    }

    function mostrarBotonConfirmacion(turno) {
        const confirmacionContainer = document.getElementById('confirmacionContainer');
        confirmacionContainer.style.display = "block"; 

        
        const especialidadSeleccionada = document.getElementById("especialidad").options[document.getElementById("especialidad").selectedIndex].text;
        const profesionalSeleccionado = document.getElementById("profesional").options[document.getElementById("profesional").selectedIndex].text;
        
    
        document.getElementById("especialidadSeleccionada").textContent = `Especialidad: ${especialidadSeleccionada}`;
        document.getElementById("profesionalSeleccionado").textContent = `Profesional: ${profesionalSeleccionado}`;
        document.getElementById("fechaSeleccionada").textContent = `Fecha: ${new Date(turno.fecha).toLocaleDateString()}`;
        document.getElementById("horaSeleccionada").textContent = `Hora: ${turno.hora}`;

        document.getElementById('turnoId').value = turno.id;
        document.getElementById('agendaId').value = turno.agenda_id;
        document.getElementById('profesionalId').value = document.getElementById("profesional").value;
        document.getElementById('fecha').value = turno.fecha; 
        document.getElementById('hora').value = turno.hora;
        document.getElementById('motivoConsulta').value = turno.motivo_consulta || "";
    }

});

    
async function obtenerAgendaId() {
    const profesionalElement = document.getElementById('profesional');
    const especialidadElement = document.getElementById('especialidad');
    const sucursalElement = document.getElementById('sucursal');

    if (!profesionalElement || !especialidadElement || !sucursalElement) {
        console.error("Uno o más elementos de selección no se encontraron en el DOM.");
        return;
    }

    const profesionalId = profesionalElement.value;
    const especialidadId = especialidadElement.value;
    const sucursalId = sucursalElement.value;
    

    try {
        const response = await fetch(`/agendas/obtenerAgenda?profesional_id=${profesionalId}&especialidad_id=${especialidadId}&sucursal_id=${sucursalId}`);
        const data = await response.json();

        console.log("Respuesta del servidor:", data);

        if (data.agenda_id) {
            localStorage.setItem('agendaId', data.agenda_id);
            console.log("Agenda ID guardado en localStorage:", localStorage.getItem('agendaId'));

        } else {
            alert('No se encontró una agenda con los datos seleccionados.');
        }
    } catch (error) {
        console.error("Error al obtener agenda ID:", error);
    }
}

function cargarAgendaIdEnFormulario() {
    const agendaId = localStorage.getItem('agendaId');

    if (agendaId) {
        document.getElementById('agendaId').value = agendaId;
        console.log("Agenda ID en formulario de confirmación:", agendaId);
    } else {
        console.warn("Agenda ID no encontrado en localStorage");
    }
}

async function confirmarTurno() {
    const pacienteId = localStorage.getItem('pacienteId');
    const turnoId = document.getElementById('turnoId').value; 
    const agendaId = document.getElementById('agendaId').value;
    const profesionalId = document.getElementById('profesionalId').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const motivoConsulta = document.getElementById('motivoConsulta').value;

    if (!pacienteId || !agendaId || !turnoId || !profesionalId || !fecha || !hora) {
        alert("Error: faltan datos para confirmar el turno.");
        return;
    }

    const confirmar = confirm("¿Deseas confirmar el turno con estos datos?");
    if (!confirmar) return;

    try {
        const response = await fetch(`/turnos/confirmar/${turnoId}`, {
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                turno_id: turnoId,
                paciente_id: pacienteId,
                estado_turno: 'reservado',
                motivo_consulta: motivoConsulta
            })
        });

        if (response.ok) {
            alert("Turno confirmado con éxito.");
            document.getElementById('formData').reset();
            document.getElementById('listaTurnos').innerHTML = '';
            document.getElementById('resultadosTurnos').style.display = 'none';
            document.getElementById('confirmacionContainer').style.display = 'none';
        } else {
            const errorData = await response.json();
            console.error("Error al confirmar turno:", errorData.message);
            alert("Hubo un problema al confirmar el turno.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error al procesar la solicitud.");
    }
}






