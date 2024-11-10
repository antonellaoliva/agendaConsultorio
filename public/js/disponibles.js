document.addEventListener('DOMContentLoaded', function() {
    const listaHorarios = document.getElementById('listaHorarios');
    const botonSiguiente = document.getElementById('siguiente');
  
    document.getElementById('verHorarios').onclick = function() {
      const especialidad = document.getElementById('especialidad').value;
      const sucursal = document.getElementById('sucursal').value;
      const profesional = document.getElementById('profesional').value;
      const fecha = document.getElementById('fechaConsulta').value;
  
      fetch(`/turnos/disponibles?especialidad=${especialidad}&sucursal=${sucursal}&profesional=${profesional}&fecha=${fecha}&_=${new Date().getTime()}`)
        .then(response => response.json())
        .then(data => {
          listaHorarios.innerHTML = ''; // Limpiar la lista existente
  
          if (data.horarios && data.horarios.length > 0) {

            data.horarios.forEach(horario => {
              const li = document.createElement('li');
              li.className = 'list-group-item d-flex justify-content-between align-items-center';
              li.textContent = `${horario.dia_semana}: ${horario.hora_inicio} - ${horario.hora_fin}`;
              
              // Crear un checkbox para seleccionar el horario
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.className = 'form-check-input';
              checkbox.value = `${horario.id}`; // Guarda el ID del horario
              checkbox.onchange = function() {
                // Mostrar el botón "Siguiente" si hay un horario seleccionado
                botonSiguiente.style.display = Array.from(listaHorarios.querySelectorAll('input[type="checkbox"]')).some(cb => cb.checked) ? 'inline-block' : 'none';
              };
  
              li.appendChild(checkbox);
              listaHorarios.appendChild(li);
            });
          } else {
            listaHorarios.innerHTML = '<li class="list-group-item">No hay horarios disponibles</li>';
          }
  
          document.getElementById('horariosDisponibles').style.display = 'block';
        })
        .catch(error => console.error('Error al obtener horarios:', error));
    };
    });