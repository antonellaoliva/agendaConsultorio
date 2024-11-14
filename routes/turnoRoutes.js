const express = require('express');
const TurnoController = require('../controllers/turnoController');
const router = express.Router();

router.get('/registrar', TurnoController.mostrarFormulario);

router.get('/seleccion-especialidad', TurnoController.seleccionarEspecialidad);

router.get('/disponibles', TurnoController.mostrarHorariosDisponibles);

router.get('/turnos-disponibles/:especialidadId/:sucursalId/:profesionalId', TurnoController.getTurnosDisponibles);

router.get('/turnos/disponibles/:profesionalId', TurnoController.getTurnosDisponibles);

router.post('/confirmar/:turnoId', TurnoController.confirmarTurno);


module.exports = router;
