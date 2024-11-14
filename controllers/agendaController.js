const Agenda = require('../models/agenda');
const ProfesionalEspecialidad = require('../models/profesionalEspecialidad');
const Profesional = require('../models/profesional');
const Especialidad = require('../models/especialidad');


class AgendaController {
    static async listar(req, res) {
        try {
            const agendas = await Agenda.findAll();
            console.log(agendas);
            res.render('agendas/lista', { agendas });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    }

    static mostrarFormularioCrear(req, res) {
        res.render('agendas/crear');  
    }

    static async crear(req, res) {
        try {
            const { profesional_especialidad_id, sucursal_id, estado, clasificacion, max_sobreturnos, duracion_turno } = req.body;

    
            await Agenda.create({
                profesional_especialidad_id: profesional_especialidad_id || null,
                sucursal_id: sucursal_id || null,
                estado: estado || null,
                clasificacion: clasificacion || null,
                max_sobreturnos: max_sobreturnos || null,
                duracion_turno: duracion_turno || null,
            });

            res.redirect('/agendas'); 
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al crear la agenda');
        }
    }
      
    static async mostrarFormularioEditar(req, res) {
        const { id } = req.params;

    try {
        const agenda = await Agenda.findById(id);
        if (!agenda) {
            return res.status(404).send('Agenda no encontrada');
        }
        res.render('agendas/editar', { agenda });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la agenda');
    }
}

    static async actualizarAgenda(req, res) {
        try {
            const { profesional_especialidad_id, sucursal_id, estado, clasificacion, max_sobreturnos, duracion_turno } = req.body;
            await Agenda.update(req.params.id, {
                profesional_especialidad_id, sucursal_id, estado, clasificacion, max_sobreturnos, duracion_turno
            });
            res.redirect('/agendas');
        } catch (error) {
            console.error('Error al actualizar la agenda:', error);
            res.status(500).send('Error al actualizar la agenda');
        }
    }

    static async mostrarFormularioFiltrado(req, res) {
        try {
          const especialidades = await Especialidad.getEspecialidades();
          const profesionales = await Profesional.getProfesional();
    
          res.render('agendas/filtrar', { especialidades, profesionales, agendas: null });
        } catch (error) {
          console.error('Error al cargar el formulario de filtrado:', error);
          res.status(500).send('Error al cargar el formulario de filtrado');
        }
      }

      static async filtrarAgendas(req, res) { 
        const { especialidad, profesional } = req.query;
        console.log('Parámetros de filtrado:', req.query);
    
        try {
            const agendas = await Agenda.filtrar({ especialidad, profesional });
            console.log('Agendas filtradas:', agendas);
    
            const especialidades = await Especialidad.getEspecialidades();
            const profesionales = await Profesional.getProfesional();
    
            res.render('agendas/filtrar', { especialidades, profesionales, agendas });
        } catch (error) {
            console.error('Error al filtrar agendas:', error);
            res.status(500).send('Error al filtrar agendas');
        }
    }
    

      static async obtenerAgenda(req, res) {
        console.log("Solicitud recibida en /obtenerAgenda");
    
        let { profesional_id, especialidad_id, sucursal_id } = req.query;
    
        profesional_id = profesional_id.trim();
        especialidad_id = especialidad_id.trim();
        sucursal_id = sucursal_id.trim();
    
        try {
            console.log("Parámetros recibidos en el controlador:", { profesional_id, especialidad_id, sucursal_id });
    
            const profesionalEspecialidadId = await ProfesionalEspecialidad.obtenerId(profesional_id, especialidad_id);
            
            if (!profesionalEspecialidadId) {
                return res.status(404).json({ error: 'Profesional con la especialidad no encontrado' });
            }
    
            const agendaId = await Agenda.obtenerAgendaId(profesionalEspecialidadId, sucursal_id);
    
            console.log("Agenda ID obtenido:", agendaId);
    
            if (agendaId) {
                res.json({ agenda_id: agendaId });
            } else {
                res.status(404).json({ error: 'Agenda no encontrada' });
            }
        } catch (error) {
            console.error("Error al obtener el ID de la agenda:", error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }

};


module.exports = AgendaController;
