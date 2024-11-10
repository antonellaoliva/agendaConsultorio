// // controllers/agendamientoController.js
// const Profesional = require('../models/profesional');
// const Turno = require('../models/turno'); // Ajusta según tu modelo

// const agendamientoController = {

//     // mostrarVistaAgendar: async (req, res) => {
//     //     try {
//     //         const profesionales = await Profesional.listarTodos(); // Obtén todos los profesionales
//     //         res.render('agendamiento/agendar', { profesionales }); // Renderiza la vista con los profesionales
//     //     } catch (error) {
//     //         console.error("Error al cargar la vista de agendamiento:", error);
//     //         res.status(500).send("Hubo un error al cargar la vista.");
//     //     }
//     // },

   
//     mostrarHorariosDisponibles: async (req, res) => {
//         try {
//             const { agendaId, diaSemana } = req.query;
    
//             // Asegúrate de que agendaId y diaSemana estén definidos
//             if (!agendaId || !diaSemana) {
//                 return res.status(400).send("Faltan parámetros requeridos: agendaId y diaSemana.");
//             }
    
//             // Obtén los horarios disponibles para la agenda y día dados
//             const horariosDisponibles = await Turno.obtenerHorariosDisponibles(agendaId, diaSemana);
//             const profesionales = await Profesional.listarTodos();
    
//             console.log("Horarios disponibles:", horariosDisponibles);
//             res.render('agendamiento/agendar', { agendaId, diaSemana, horariosDisponibles, profesionales });
//         } catch (error) {
//             console.error("Error al obtener horarios disponibles:", error);
//             res.status(500).send("Hubo un error al obtener los horarios.");
//         }
//     },

    
//     // mostrarHorariosDisponibles: async (req, res) => {
//     //     try {
//     //         const { profesionalId, fecha } = req.query;

//     //         // Obtén los horarios disponibles para el profesional en la fecha dada
//     //         const horariosDisponibles = await Turno.mostrarHorariosDisponibles(profesionalId, fecha);

//     //         res.render('agendamiento/agendar', { profesionalId, fecha, horariosDisponibles });
//     //     } catch (error) {
//     //         console.error("Error al obtener horarios disponibles:", error);
//     //         res.status(500).send("Hubo un error al obtener los horarios.");
//     //     }
//     // },

//     confirmarTurno: async (req, res) => {
//         try {
//             const { profesionalId, pacienteId, fecha, horario } = req.body;

//             // Lógica para guardar el turno
//             await Turno.crearTurno({ profesionalId, pacienteId, fecha, horario });
            
//             res.redirect('/confirmacion'); // Redirige a una pantalla de confirmación
//         } catch (error) {
//             console.error("Error al agendar turno:", error);
//             res.status(500).send("Hubo un error al agendar el turno.");
//         }
//     },

// };

// module.exports = agendamientoController;
