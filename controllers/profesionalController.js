const Profesional = require('../models/profesional');
const Especialidad = require('../models/especialidad');

const ProfesionalController = { 

listarMedicos: async (req, res) => {
    const profesionales = await Profesional.listarTodos();
    res.render('profesionales/index', { profesionales });
},

formularioNuevoMedico: async (req, res) => {
    const especialidades = await Especialidad.listarTodas();
    res.render('profesionales/nuevo', { especialidades });
},

crearMedico: async (req, res) => {
    try {
        const { nombre, apellido, especialidades } = req.body;

        // Verifica si especialidades es un array; si no, lo convierte en uno
        const especialidadesArray = Array.isArray(especialidades) ? especialidades : [especialidades];

        // Crea el nuevo profesional
        const profesionalId = await Profesional.crear({ nombre, apellido });

        // Asigna las especialidades al profesional
        await Especialidad.asignarEspecialidades(profesionalId, especialidadesArray);

        // Redirecciona a la lista de profesionales
        res.redirect('/profesionales');
    } catch (error) {
        console.error("Error al crear el médico:", error);
        res.status(500).send("Hubo un error al crear el médico");
    }
},

// crearMedico: async (req, res) => {
//     const { nombre, apellido, especialidades } = req.body;
//     const profesionalId = await Profesional.crear({ nombre, apellido });
//     await Especialidad.asignarEspecialidades(profesionalId, especialidades);
//     res.redirect('/profesionales');
// },

formularioEditarMedico: async (req, res) => {
    try {
        const profesionalId = req.params.id;

        // Obtiene la información del profesional
        const profesional = await Profesional.buscarPorId(profesionalId);

        // Obtiene las especialidades actuales del profesional
        const especialidadesActuales = await Especialidad.obtenerEspecialidadesPorMedico(profesionalId);
        profesional.especialidades = especialidadesActuales; // Array de IDs de especialidades actuales

        // Obtiene todas las especialidades disponibles
        const especialidades = await Especialidad.listarTodas(); // Usamos listarTodas() para obtener todas las especialidades

        // Renderiza la vista de edición
        res.render('profesionales/editar', { profesional, especialidades });
    } catch (error) {
        console.error('Error al cargar el formulario de edición:', error);
        res.status(500).send('Error interno del servidor');
    }
},

// formularioEditarMedico: async (req, res) => {
//     const profesionalId = req.params.id;
//     const profesional = await Profesional.buscarPorId(profesionalId);
//     const especialidades = await Especialidad.listarTodas();
//     const especialidadesAsignadas = await Especialidad.obtenerEspecialidadesPorMedico(profesionalId);
//     res.render('profesionales/editar', { profesional, especialidades, especialidadesAsignadas });
// },

inactivarMedico: async (req, res) => {
    const profesionalId = req.params.id;
    await Profesional.inactivar(profesionalId);
    res.redirect('/profesionales');
},

actualizarMedico: async (req, res) => {
    const profesionalId = req.params.id;
    const { nombre, apellido, estado } = req.body;
    let especialidades = req.body.especialidades; // Cambiamos `const` a `let`

    try {
        // Convierte `especialidades` a un array si es un solo valor
        if (typeof especialidades === 'string') {
            especialidades = [especialidades]; // Convierte un valor único en un array
        }

        // Actualiza la información del profesional
        await Profesional.actualizar(profesionalId, { nombre, apellido, estado });

        // Actualiza las especialidades del profesional
        await Especialidad.asignarEspecialidades(profesionalId, especialidades);

        // res.redirect(`/profesionales/${profesionalId}/editar`);
        res.redirect('/profesionales');
    } catch (error) {
        console.error('Error al actualizar el médico:', error);
        res.status(500).send('Error interno del servidor');
    }
},


// actualizarMedico: async (req, res) => {
//     const profesionalId = req.params.id;
//     const { nombre, apellido, estado, especialidades } = req.body;
//     await Profesional.actualizar(profesionalId, { nombre, apellido, estado });
//     await Especialidad.asignarEspecialidades(profesionalId, especialidades);
//     res.redirect('/profesionales');
// },



// Controlador para obtener profesionales según especialidad y sucursal
getProfesionales: async (req, res) => {
  const { especialidadId, sucursalId } = req.params;

  console.log("Especialidad ID:", especialidadId);
  console.log("Sucursal ID:", sucursalId);

  if (!especialidadId || !sucursalId) {
    return res.status(400).json({ error: 'Debe proporcionar especialidadId y sucursalId' });
  }

  try {
    const profesionales = await Profesional.getProfesionalesPorEspecialidadYSucursal(especialidadId, sucursalId);
    
    if (profesionales.length === 0) {
      return res.status(404).json({ message: 'No se encontraron profesionales para la especialidad y sucursal especificadas' });
    }

    res.status(200).json(profesionales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los profesionales' });
  }
}
};

module.exports = ProfesionalController;