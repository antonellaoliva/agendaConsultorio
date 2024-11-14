const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/ingreso-dni', pacienteController.ingresarDNI);
router.post('/pedir-turno', pacienteController.pedirTurno);

router.get('/registro', pacienteController.registro);
router.post('/registro', pacienteController.uploadDocumento, pacienteController.registrarPaciente);

router.get('/actualizar-paciente/:id', pacienteController.mostrarActualizarPaciente);

router.post('/actualizar-paciente', pacienteController.uploadDocumento, pacienteController.actualizarPaciente);

module.exports = router;