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

            // Asegúrate de que los valores estén definidos antes de llamar a create
            await Agenda.create({
                profesional_especialidad_id: profesional_especialidad_id || null,
                sucursal_id: sucursal_id || null,
                estado: estado || null,
                clasificacion: clasificacion || null,
                max_sobreturnos: max_sobreturnos || null,
                duracion_turno: duracion_turno || null,
            });

            res.redirect('/agendas'); // Redirige o envía una respuesta
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

    // Procesa los datos del formulario y actualiza la agenda
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

    // static async desactivarAgenda(req, res) {
    //     const { id } = req.params;
    //     console.log(`Intentando desactivar la agenda con ID: ${id}`);
    
    //     try {
    //         await Agenda.desactivar(id);  // Llama al método desactivar en lugar de delete
    //         res.redirect('/api/agendas'); // Redirige a la lista de agendas después de "desactivar"
    //     } catch (error) {
    //         console.error('Error al desactivar la agenda:', error);
    //         res.status(500).send('Error al desactivar la agenda');
    //     }
    // }
    static async mostrarFormularioFiltrado(req, res) {
        try {
          // Obtener listas para el formulario
          const especialidades = await Especialidad.getEspecialidades();
          const profesionales = await Profesional.getProfesional();
    
          // Renderizar la vista con los datos
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
            // Obtener resultados de agendas filtradas
            const agendas = await Agenda.filtrar({ especialidad, profesional });
            console.log('Agendas filtradas:', agendas); // Verificar si agendas tiene datos
    
            // Obtener opciones para los filtros
            const especialidades = await Especialidad.getEspecialidades();
            const profesionales = await Profesional.getProfesional();
    
            // Renderizar la vista de resultados con los datos filtrados
            res.render('agendas/filtrar', { especialidades, profesionales, agendas });
        } catch (error) {
            console.error('Error al filtrar agendas:', error);
            res.status(500).send('Error al filtrar agendas');
        }
    }
    
    
      // Método para procesar los filtros
    //   static async filtrarAgendas(req, res) {
    //     const { especialidad, profesional } = req.query;
    //     console.log('Parámetros de filtrado:', req.query);
    
    //     try {
    //       // Obtener resultados de agendas filtradas
    //       console.log('Especialidad:', especialidad);
    //       console.log('Profesional:', profesional);

    //       const agendas = await Agenda.filtrar({ especialidad, profesional });
    
    //       // Renderizar la vista de resultados con los datos filtrados
    //       const especialidades = await Agenda.obtenerEspecialidades();
    //       const profesionales = await Agenda.obtenerProfesionales();
    
    //       res.render('agendas/filtrar', { especialidades, profesionales, agendas });
    //     } catch (error) {
    //       console.error('Error al filtrar agendas:', error);
    //       res.status(500).send('Error al filtrar agendas');
    //     }
    //   }

      static async obtenerAgenda(req, res) {
        console.log("Solicitud recibida en /obtenerAgenda");
    
        let { profesional_id, especialidad_id, sucursal_id } = req.query;
    
        // Eliminar caracteres no deseados
        profesional_id = profesional_id.trim();
        especialidad_id = especialidad_id.trim();
        sucursal_id = sucursal_id.trim();
    
        try {
            console.log("Parámetros recibidos en el controlador:", { profesional_id, especialidad_id, sucursal_id });
    
            // Obtener el ID de profesional_especialidad
            const profesionalEspecialidadId = await ProfesionalEspecialidad.obtenerId(profesional_id, especialidad_id);
            
            if (!profesionalEspecialidadId) {
                return res.status(404).json({ error: 'Profesional con la especialidad no encontrado' });
            }
    
            // Ahora puedes pasar el profesional_especialidad_id a la función obtenerAgendaId
            const agendaId = await Agenda.obtenerAgendaId(profesionalEspecialidadId, sucursal_id);

            // console.log("Resultado completo de la consulta a agenda:", result);

            // // Extraer el ID de la agenda de manera segura
            // const agendaId = result[0] && result[0][0] ? result[0][0].id : null;

    
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
