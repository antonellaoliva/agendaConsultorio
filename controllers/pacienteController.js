const Paciente = require('../models/paciente');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'uploads', 'documentos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeFileName = file.originalname.replace(/\s+/g, '_').toLowerCase();
    cb(null, `${Date.now()}_${safeFileName}`);
  }
});

const upload = multer({ storage });

const pacienteController = {
  ingresarDNI: (req, res) => {
    res.render('paciente/ingreso-dni');
  },

  pedirTurno: async (req, res) => {
    const { dni } = req.body;
    try {
      const results = await Paciente.findByDNI(dni);
      if (results.length > 0) {
        res.render('paciente/datos-paciente', { paciente: results[0] });
      } else {
        res.render('paciente/no-encontrado');
      }
    } catch (error) {
      console.error('Error en la consulta de DNI:', error);
      res.status(500).send('Error en la consulta de paciente');
    }
  },

  registro: (req, res) => {
    res.render('paciente/registro');
  },

  registrarPaciente: async (req, res) => {
    const { nombre, apellido, dni, obra_social, datos_contacto } = req.body;
    const documento_path = req.file ? req.file.path : null;

    try {
      await Paciente.create({ nombre, apellido, dni, obra_social, datos_contacto, documento_path });
      res.redirect('/ingreso-dni');
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      res.status(500).send('Error al registrar el paciente');
    }
  },

  mostrarActualizarPaciente: async (req, res) => {
    const { id } = req.params;
    try {
      const paciente = await Paciente.findById(id);
      if (paciente) {
        res.render('paciente/actualizar-paciente', { paciente });
      } else {
        res.status(404).render('paciente/no-encontrado');
      }
    } catch (error) {
      console.error('Error al encontrar paciente:', error);
      res.status(500).send('Error al buscar el paciente');
    }
  },

  actualizarPaciente: async (req, res) => {
    const { id, nombre, apellido, dni, obra_social, datos_contacto } = req.body;
    let documento_path;

    try {
      if (req.file) {
        documento_path = req.file.path;
      } else {
        const paciente = await Paciente.findById(id);
        documento_path = paciente ? paciente.documento_path : null;
      }

      await Paciente.update(id, { nombre, apellido, dni, obra_social, datos_contacto, documento_path });
      res.redirect('/ingreso-dni');
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      res.status(500).send('Error al actualizar los datos del paciente');
    }
  }
};

pacienteController.uploadDocumento = upload.single('documento');

module.exports = pacienteController;