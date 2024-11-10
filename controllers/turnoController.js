const especialidad = require('../models/especialidad');
const sucursal = require('../models/sucursal');
const profesional = require('../models/profesional');
const profesionalEspecialidad = require('../models/profesionalEspecialidad');
const turno = require('../models/turno');

const TurnoController = {
    seleccionarEspecialidad: async (req, res) => {
        try {
            const especialidades = await especialidad.getEspecialidades();
            const profesionales = await profesional.getProfesional();
            const sucursales = await sucursal.getSucursales();

            res.render('turnos/seleccionEspecialidad', { especialidades, profesionales, sucursales });
        } catch (error) {
            console.error("Error en seleccionarEspecialidad:", error);
            res.status(500).send("Error al obtener datos.");
        }
    },

    obtenerProfesionalesPorEspecialidad: async (req, res) => {
        const { especialidadId } = req.params;
        try {
            const profesionales = await profesionalEspecialidad.getProfesionalesPorEspecialidad(especialidadId);
            res.json(profesionales);
        } catch (error) {
            console.error("Error al obtener profesionales:", error);
            res.status(500).send("Error al obtener profesionales para la especialidad seleccionada.");
        }
    },

    mostrarHorariosDisponibles: async (req, res) => {
        try {
            const criterios = {
                fecha: req.query.fecha || null,
                sucursal_id: req.query.sucursal || null,
                profesional_id: req.query.profesional || null,
                especialidad_id: req.query.especialidad || null
            };

            console.log('Criterios:', criterios);
            const horarios = await turno.mostrarHorariosDisponibles(criterios);
            //if (!Array.isArray(horarios)) {
              if (!Array.isArray(horarios) || horarios.length === 0) {
                return res.status(404).json({ error: 'No se encontraron horarios' });
            }

            console.log('Horarios:', horarios);
            res.json({ horarios });
        } catch (error) {
            console.error('Error al buscar horarios:', error);
            res.status(500).send('Error en el servidor');
        }
    },

    
    getTurnosDisponibles: async (req, res) => {
        const { especialidadId, sucursalId, profesionalId } = req.params;
      
        if (!especialidadId || !sucursalId || !profesionalId) {
          return res.status(400).json({ error: 'Debe proporcionar especialidadId, sucursalId y profesionalId' });
        }
      
        try {
          const turnos = await turno.getPorEspecialidadSucursalYProfesional(especialidadId, sucursalId, profesionalId);
          // const turnos = await turno.getPorEspecialidadSucursalYProfesional(especialidadId, sucursalId, profesionalId, fechaSeleccionada);
      
          if (turnos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron turnos disponibles' });
          }
      
          res.status(200).json(turnos);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error al obtener los turnos disponibles' });
        }
      },

      confirmarTurno: async (req, res) => {
        const { turno_id, paciente_id, estado_turno, motivo_consulta } = req.body;
    
        if (!turno_id || !paciente_id || !estado_turno) {
            return res.status(400).json({ error: "Debe proporcionar el ID del turno, el paciente y el nuevo estado" });
        }
    
        try {
            await turno.actualizarTurno(turno_id, paciente_id, estado_turno, motivo_consulta);
            res.status(200).json({ message: "El turno ha sido reservado con éxito" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al reservar el turno" });
        }
    },
    

    mostrarFormulario: (req, res) => {
        res.render('turnos/formularioTurno'); 
    }
};

module.exports = TurnoController;



