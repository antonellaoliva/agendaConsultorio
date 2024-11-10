const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Rutas para pacientes
router.get('/ingreso-dni', pacienteController.ingresarDNI);
router.post('/pedir-turno', pacienteController.pedirTurno);

// Ruta para el registro del paciente
router.get('/registro', pacienteController.registro);
router.post('/registro', pacienteController.uploadDocumento, pacienteController.registrarPaciente);

// Ruta para mostrar el formulario de actualización del paciente
router.get('/actualizar-paciente/:id', pacienteController.mostrarActualizarPaciente);

// Ruta para manejar la actualización de los datos del paciente
router.post('/actualizar-paciente', pacienteController.uploadDocumento, pacienteController.actualizarPaciente);

module.exports = router;