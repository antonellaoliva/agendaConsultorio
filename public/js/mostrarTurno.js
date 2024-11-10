function obtenerTurnosDisponibles() {
    const especialidadId = document.getElementById('especialidad').value;
    const sucursalId = document.getElementById('sucursal').value;
    const profesionalId = document.getElementById('profesional').value;

    if (especialidadId && sucursalId && profesionalId) {
        fetch(`/turnos/turnos-disponibles/${especialidadId}/${sucursalId}/${profesionalId}`)
            .then(response => response.json())
            .then(turnos => {
                const listaHorarios = document.getElementById('listaHorarios');
                listaHorarios.innerHTML = ''; // Limpiar la lista de horarios

                turnos.forEach(turno => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Turno: ${new Date(turno.fecha).toLocaleDateString()} - ${turno.hora}`;
                    
                    // Botón para seleccionar el turno
                    const selectButton = document.createElement('button');
                    selectButton.textContent = 'Seleccionar';
                    selectButton.onclick = () => {
                        // turnoSeleccionadoId = turno.id; // Guardar el ID del turno seleccionado
                        localStorage.setItem('turnoId', turno.id);
                        mostrarBotonConfirmacion(turno); // Mostrar el botón de confirmación y pasar el turno seleccionado
                    };
                    
                    listItem.appendChild(selectButton);
                    listaHorarios.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error al cargar turnos disponibles:', error));
    } else {
        alert('Por favor, seleccione especialidad, sucursal y profesional.');
    }
}


function mostrarBotonConfirmacion(turnoSeleccionado) {
    const confirmacionContainer = document.getElementById('confirmacionContainer');
    confirmacionContainer.style.display = "block"; // Asegúrate de que el contenedor esté visible

    const especialidadSeleccionada = document.getElementById("especialidad").options[document.getElementById("especialidad").selectedIndex].text;
    const profesionalSeleccionado = document.getElementById("profesional").options[document.getElementById("profesional").selectedIndex].text;
    const fechaSeleccionada = document.getElementById("fechaConsulta").value;
    const horaSeleccionada = turnoSeleccionado.hora;
    const agendaIdSeleccionado = turnoSeleccionado.agendaId;
    const turnoIdSeleccionado = turnoSeleccionado.turnoId;
    const profesionalIdSeleccionado = document.getElementById("profesional").value;
    const motivoConsultaSeleccionado = turnoSeleccionado.motivoConsulta || ""; // o algún valor por defecto si no se tiene

    // Mostrar la información en el contenedor de confirmación
    document.getElementById("especialidadSeleccionada").textContent = `Especialidad: ${especialidadSeleccionada}`;
    document.getElementById("profesionalSeleccionado").textContent = `Profesional: ${profesionalSeleccionado}`;
    document.getElementById("fechaSeleccionada").textContent = `Fecha: ${fechaSeleccionada}`;
    document.getElementById("horaSeleccionada").textContent = `Hora: ${horaSeleccionada}`;

    // Asigna los valores a los campos ocultos para enviar al backend
    document.getElementById('turnoId').value = turnoIdSeleccionado;
    document.getElementById('agendaId').value = agendaIdSeleccionado;
    document.getElementById('profesionalId').value = profesionalIdSeleccionado;
    document.getElementById('fecha').value = fechaSeleccionada;
    document.getElementById('hora').value = horaSeleccionada;
    document.getElementById('motivoConsulta').value = motivoConsultaSeleccionado;
}



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
    // const profesionalId = document.getElementById('profesionalId').value;
    // const especialidadId = document.getElementById('especialidadId').value;
    // const sucursalId = document.getElementById('sucursalId').value;

    try {
        const response = await fetch(`/agendas/obtenerAgenda?profesional_id=${profesionalId}&especialidad_id=${especialidadId}&sucursal_id=${sucursalId}`);
        const data = await response.json();

        console.log("Respuesta del servidor:", data);

        if (data.agenda_id) {
            // Guardar el agenda_id en localStorage o en una variable
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
    let agendaId = localStorage.getItem('agendaId');
    if (!agendaId) {
        await obtenerAgendaId();
        agendaId = localStorage.getItem('agendaId');
        if (!agendaId) {
            alert("Error: Agenda ID no encontrado. Selecciona especialidad, sucursal y profesional nuevamente.");
            return;
        }
    } 

    const pacienteId = localStorage.getItem('pacienteId');
    const turnoId = localStorage.getItem('turnoId');  // Turno seleccionado
    const profesionalId = document.getElementById('profesionalId').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const motivoConsulta = document.getElementById('motivoConsulta').value;

    console.log("Turno ID:", turnoId)
    console.log("Paciente ID:", pacienteId);
    console.log("Agenda ID:", agendaId);
    console.log("Profesional ID:", profesionalId);
    console.log("Fecha:", fecha);
    console.log("Hora:", hora);
    console.log("Motivo Consulta:", motivoConsulta);

    if (!pacienteId || !agendaId || !turnoId || !profesionalId || !fecha || !hora) {
        alert("Error: faltan datos para confirmar el turno.");
        return;
    }

    const confirmar = confirm("¿Deseas confirmar el turno con estos datos?");
    if (!confirmar) return;

    try {
        const response = await fetch('/turnos/confirmar/${turnoId}', {
            method: 'POST',  // PUT para actualizar
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





// Mostrar el botón de confirmación y asignar datos
// function mostrarBotonConfirmacion(turnoSeleccionado) {
//     const confirmacionContainer = document.getElementById('confirmacionContainer');
//     confirmacionContainer.style.display = "block"; // Asegúrate de que el contenedor esté visible

//     const especialidadSeleccionada = document.getElementById("especialidad").options[document.getElementById("especialidad").selectedIndex].text;
//     const profesionalSeleccionado = document.getElementById("profesional").options[document.getElementById("profesional").selectedIndex].text;
//     const fechaSeleccionada = document.getElementById("fechaConsulta").value;

//     // Mostrar la información en el contenedor de confirmación
//     document.getElementById("especialidadSeleccionada").textContent = `Especialidad: ${especialidadSeleccionada}`;
//     document.getElementById("profesionalSeleccionado").textContent = `Profesional: ${profesionalSeleccionado}`;
//     document.getElementById("fechaSeleccionada").textContent = `Fecha: ${fechaSeleccionada}`;
//     document.getElementById("horaSeleccionada").textContent = `Hora: ${turnoSeleccionado.hora}`; // Asigna la hora seleccionada
// }


// let turnoSeleccionadoId = null; // Variable para almacenar el ID del turno seleccionado
//let pacienteId = 123; // Suponiendo que tienes el pacienteId en el contexto actual

// function obtenerTurnosDisponibles() {
//     const especialidadId = document.getElementById('especialidad').value;
//     const sucursalId = document.getElementById('sucursal').value;
//     const profesionalId = document.getElementById('profesional').value;
  
//     if (especialidadId && sucursalId && profesionalId) {
//         fetch(`/turnos/turnos-disponibles/${especialidadId}/${sucursalId}/${profesionalId}`)
//             .then(response => response.json())
//             .then(turnos => {
//                 const listaHorarios = document.getElementById('listaHorarios');
//                 listaHorarios.innerHTML = ''; // Limpiar la lista de horarios

//                 turnos.forEach(turno => {
//                     const listItem = document.createElement('li');
//                     listItem.textContent = `Turno: ${new Date(turno.fecha).toLocaleDateString()} - ${turno.hora}`;
                    
//                     // Botón para seleccionar el turno
//                     const selectButton = document.createElement('button');
//                     selectButton.textContent = 'Seleccionar';
//                     selectButton.onclick = () => {
//                         turnoSeleccionadoId = turno.id; // Guardar el ID del turno seleccionado
//                         mostrarBotonConfirmacion(); // Mostrar el botón de confirmación
//                     };
                    
//                     listItem.appendChild(selectButton);
//                     listaHorarios.appendChild(listItem);
//                 });
//             })
//             .catch(error => console.error('Error al cargar turnos disponibles:', error));
//     } else {
//         alert('Por favor, seleccione especialidad, sucursal y profesional.');
//     }
//     document.getElementById("confirmacionContainer").style.display = "block";

//         // Asignar datos seleccionados a variables o directamente al HTML (opcional)
//         const especialidadSeleccionada = document.getElementById("especialidad").options[document.getElementById("especialidad").selectedIndex].text;
//         const profesionalSeleccionado = document.getElementById("profesional").options[document.getElementById("profesional").selectedIndex].text;
//         const fechaSeleccionada = document.getElementById("fechaConsulta").value;
//         const horaSeleccionada = document.getElementById("horariosDisponibles");
      
//         // Muestra la información en el contenedor de confirmación
//         document.getElementById("confirmacionContainer").querySelector("p#especialidadSeleccionada").textContent = especialidadSeleccionada;
//         document.getElementById("confirmacionContainer").querySelector("p#profesionalSeleccionado").textContent = profesionalSeleccionado;
//         document.getElementById("confirmacionContainer").querySelector("p#fechaSeleccionada").textContent = fechaSeleccionada;
//         document.getElementById("confirmacionContainer").querySelector("p#horaSeleccionada").textContent = horaSeleccionada;
      
// }

// // Mostrar el botón de confirmación
// function mostrarBotonConfirmacion() {
//     const confirmacionContainer = document.getElementById('confirmacionContainer');
//     confirmacionContainer.innerHTML = ''; // Limpiar contenido anterior
  
//     const confirmButton = document.createElement('button');
//     confirmButton.textContent = 'Confirmar Turno';
//     confirmButton.onclick = confirmarTurno;
  
//     confirmacionContainer.appendChild(confirmButton);
// }

// Confirmar el turno seleccionado
// async function confirmarTurno() {
//      // Verificar si agendaId está en localStorage
//      let agendaId = localStorage.getItem('agendaId');
//      if (!agendaId) {
//          // Intentar obtener el agendaId si no está presente
//          await obtenerAgendaId();
//          agendaId = localStorage.getItem('agendaId');
         
//          if (!agendaId) {
//              alert("Error: Agenda ID no encontrado. Selecciona especialidad, sucursal y profesional nuevamente.");
//              return;
//          }
//      } 

//     const pacienteId = localStorage.getItem('pacienteId');
   
//     const profesionalId = document.getElementById('profesionalId').value;
//     const fecha = document.getElementById('fecha').value;
//     const hora = document.getElementById('hora').value;
//     const motivoConsulta = document.getElementById('motivoConsulta').value;


//     // Agrega los console.log dentro de la función para verificar los valores
//     console.log("Paciente ID:", pacienteId);
//     console.log("Agenda ID:", agendaId);
//     console.log("Profesional ID:", profesionalId);
//     console.log("Fecha:", fecha);
//     console.log("Hora:", hora);
//     console.log("Motivo Consulta:", motivoConsulta);

  
//     // Verifica que todos los datos estén completos
//     if (!pacienteId || !agendaId || !profesionalId || !fecha || !hora) {
//       alert("Error: faltan datos para confirmar el turno.");
//       return;
//     }

//     mostrarBotonConfirmacion({
//         especialidad: document.getElementById("especialidad").options[document.getElementById("especialidad").selectedIndex].text,
//         profesional: document.getElementById("profesional").options[document.getElementById("profesional").selectedIndex].text,
//         fecha,
//         hora
//     });

//     // Confirmación del usuario antes de enviar la solicitud
//     const confirmar = confirm("¿Deseas confirmar el turno con estos datos?");
//     if (!confirmar) return; // Si el usuario no confirma, se detiene el proceso

  
//     try {
//       // Envía la solicitud al backend
//       const response = await fetch('/turnos/confirmar', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           paciente_id: pacienteId,
//           agenda_id: agendaId,
//           profesional_id: profesionalId,
//           fecha,
//           hora,
//           estado_turno: 'reservado',
//           motivo_consulta: motivoConsulta
//         })
//       });

//       console.log("Agenda ID en confirmación:", agendaId);

  
//       // Maneja la respuesta del servidor
//       if (response.ok) {
//         alert("Turno confirmado con éxito.");
//         // Aquí puedes redirigir o actualizar la interfaz
//       } else {
//         const errorData = await response.json();
//         console.error("Error al confirmar turno:", errorData.message);
//         alert("Hubo un problema al confirmar el turno.");
//       }
//     } catch (error) {
//       console.error("Error en la solicitud:", error);
//       alert("Error al procesar la solicitud.");
//     }
   
//   }
  

