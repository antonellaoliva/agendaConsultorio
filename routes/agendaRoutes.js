const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

router.get('/', agendaController.listar);

router.get('/crear', agendaController.mostrarFormularioCrear);

router.post('/', agendaController.crear);

router.get('/:id/editar', agendaController.mostrarFormularioEditar);

router.post('//:id', agendaController.actualizarAgenda);

router.get('/filtrar', agendaController.mostrarFormularioFiltrado);

router.get('/filtrar', agendaController.filtrarAgendas);

router.get('/obtenerAgenda', agendaController.obtenerAgenda);



module.exports = router;