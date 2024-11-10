const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');


// Ruta para crear horarios de la agenda
router.post('/crearHorarios', horarioController.crearHorarios);


module.exports = router;