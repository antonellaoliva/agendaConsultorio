document.getElementById("buscarPacienteForm").onsubmit = async function(event) {
    event.preventDefault(); 
    const dni = document.getElementById("dni").value;

    try {
      const response = await fetch('/pacientes/pedir-turno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni })
      });

      const data = await response.json();

      if (data.success) {
        const paciente = data.paciente;

        localStorage.setItem('pacienteId', paciente.id);

        const datosPacienteContainer = document.getElementById("datosPaciente");
        datosPacienteContainer.innerHTML = `
          <dt class="col-sm-4">Documento:</dt><dd class="col-sm-8">${paciente.dni}</dd>
          <dt class="col-sm-4">Nombre:</dt><dd class="col-sm-8">${paciente.nombre}</dd>
          <dt class="col-sm-4">Apellido:</dt><dd class="col-sm-8">${paciente.apellido}</dd>
          <dt class="col-sm-4">Obra Social:</dt><dd class="col-sm-8">${paciente.obra_social}</dd>
          <dt class="col-sm-4">Datos de contacto:</dt><dd class="col-sm-8">${paciente.datos_contacto}</dd>
        `;

        document.getElementById("datosPacienteContainer").hidden = false;
        document.getElementById("continuarBtn").hidden = false;
        
      } else {
        alert(data.message || "Paciente no encontrado");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al buscar el paciente.");
    }
  };