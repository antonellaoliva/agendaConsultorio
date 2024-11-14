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
        const { nombre, apellido, especialidades, matriculas } = req.body;

        console.log("Especialidades recibidas:", especialidades);
        console.log("Matrículas recibidas:", matriculas);

         const especialidadesFiltradas = [];
         const matriculasFiltradas = [];
 
         especialidades.forEach((especialidad, index) => {
             if (especialidad && matriculas[index]) {
                 especialidadesFiltradas.push(especialidad);
                 matriculasFiltradas.push(matriculas[index]);
             }
         });

         if (especialidadesFiltradas.length === 0 || matriculasFiltradas.length === 0) {
            throw new Error("No hay especialidades y matrículas válidas para asociar al médico.");
        }

        const profesionalId = await Profesional.crear({ nombre, apellido });

        await Especialidad.asignarEspecialidades(profesionalId, especialidadesFiltradas, matriculasFiltradas);

        res.redirect('/profesionales');
    } catch (error) {
        console.error("Error al crear el médico:", error);
        res.status(500).send("Hubo un error al crear el médico");
    }
},

actualizarMedico: async (req, res) => {
    const profesionalId = req.params.id;
    const { nombre, apellido, estado, especialidades, matriculas } = req.body;

    try {
        await Profesional.actualizarDatosBasicos(profesionalId, { nombre, apellido, estado });

        await Profesional.actualizarEspecialidadesYMatriculas(profesionalId, especialidades, matriculas);

        res.redirect('/profesionales');
    } catch (error) {
        console.error('Error al actualizar el médico:', error);
        res.status(500).send('Error interno del servidor');
    }
},


formularioEditarMedico: async (req, res) => {
    try {
        const profesionalId = req.params.id;

        const profesional = await Profesional.buscarPorId(profesionalId);

        const especialidadesActuales = await Especialidad.obtenerEspecialidadesYMatriculasPorMedico(profesionalId);
        profesional.especialidades = especialidadesActuales.map(e => ({
            id: e.especialidad_id,
            nombre: e.nombre,
            matricula: e.matricula,
        }));

        const especialidades = await Especialidad.listarTodas(); 
        
        res.render('profesionales/editar', { profesional, especialidades });
    } catch (error) {
        console.error('Error al cargar el formulario de edición:', error);
        res.status(500).send('Error interno del servidor');
    }
},


inactivarMedico: async (req, res) => {
    const profesionalId = req.params.id;
    await Profesional.inactivar(profesionalId);
    res.redirect('/profesionales');
},


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





