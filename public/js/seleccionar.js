document.addEventListener('DOMContentLoaded', function () {
    const especialidadSelect = document.getElementById('especialidad');
    const sucursalSelect = document.getElementById('sucursal');
    const profesionalSelect = document.getElementById('profesional');
    const fechaConsultaInput = document.getElementById('fechaConsulta');
    

    sucursalSelect.disabled = true;
    profesionalSelect.disabled = true;

    especialidadSelect.addEventListener('change', function () {
      if (especialidadSelect.value) {
        sucursalSelect.disabled = false;
      } else {
        sucursalSelect.disabled = true;
        profesionalSelect.disabled = true;
      }
    });

    sucursalSelect.addEventListener('change', function () {
      if (sucursalSelect.value) {
        profesionalSelect.disabled = false;
      } else {
        profesionalSelect.disabled = true;
      }
    });

    const today = new Date().toISOString().split('T')[0];
    fechaConsultaInput.value = today;



});

function cargarProfesionales() {
  const especialidadId = document.getElementById('especialidad').value;
  const sucursalId = document.getElementById('sucursal').value;

  if (especialidadId && sucursalId) {
    fetch(`/profesionales/profesionales/${especialidadId}/${sucursalId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la red');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Inspeccionar datos recibidos
        const profesionalSelect = document.getElementById('profesional');
        profesionalSelect.innerHTML = ''; // Limpiar opciones anteriores
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Seleccionar';
        optionDefault.disabled = true;
        optionDefault.selected = true;
        profesionalSelect.appendChild(optionDefault);

        if (Array.isArray(data)) {
          data.forEach(profesional => {
            const option = document.createElement('option');
            option.value = profesional.id;
            option.textContent = `${profesional.nombre} ${profesional.apellido}`;
            profesionalSelect.appendChild(option);
          });
          profesionalSelect.disabled = false; // Habilitar select de profesionales
        } else {
          console.error('Datos no válidos:', data);
        }
      })
      .catch(error => console.error('Error al cargar profesionales:', error));
  } else {
    document.getElementById('profesional').innerHTML = ''; // Limpiar opciones si no hay especialidad o sucursal
    document.getElementById('profesional').disabled = true; // Deshabilitar select de profesionales
  }
}