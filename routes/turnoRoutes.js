const express = require('express');
const TurnoController = require('../controllers/turnoController');
const router = express.Router();

router.get('/registrar', TurnoController.mostrarFormulario);
//router.post('/registrar', TurnoController.registrarTurno);

// Ruta para la selección de especialidades
router.get('/seleccion-especialidad', TurnoController.seleccionarEspecialidad);

router.get('/disponibles', TurnoController.mostrarHorariosDisponibles);

router.get('/turnos-disponibles/:especialidadId/:sucursalId/:profesionalId', TurnoController.getTurnosDisponibles);

// Ruta para obtener turnos disponibles
router.get('/turnos/disponibles/:profesionalId', TurnoController.getTurnosDisponibles);

//router.post('/confirmar/:turnoId', TurnoController.confirmarTurnoConPaciente);

router.post('/confirmar/:turnoId', TurnoController.confirmarTurno);

module.exports = router;
