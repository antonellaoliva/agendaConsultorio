const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

router.get('/profesionales/:especialidadId/:sucursalId', profesionalController.getProfesionales);
router.get('/', profesionalController.listarMedicos);
router.get('/nuevo', profesionalController.formularioNuevoMedico);
router.post('/', profesionalController.crearMedico);
router.get('/:id/editar', profesionalController.formularioEditarMedico);
router.post('/:id', profesionalController.actualizarMedico);
router.post('/:id/inactivar', profesionalController.inactivarMedico);

module.exports = router;