const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

// Ruta para listar agendas
router.get('/', agendaController.listar);

//Ruta para crear agendas
router.get('/crear', agendaController.mostrarFormularioCrear);

router.post('/', agendaController.crear);

// Ruta para mostrar el formulario de edición
router.get('/:id/editar', agendaController.mostrarFormularioEditar);

// Ruta para procesar el formulario y actualizar la agenda
router.post('//:id', agendaController.actualizarAgenda);

// router.post('/agendas/:id/desactivar', agendaController.desactivarAgenda);

// router.get('/agendas/filtrar', agendaController.filtrarAgendas);


// Ruta para mostrar el formulario de filtrado
router.get('/filtrar', agendaController.mostrarFormularioFiltrado);

// Ruta para procesar los filtros
router.get('/filtrar', agendaController.filtrarAgendas);

router.get('/obtenerAgenda', agendaController.obtenerAgenda);


// Ruta para filtrar agendas
//router.post('/agendas/filtrar', agendaController.filtrar);

module.exports = router;