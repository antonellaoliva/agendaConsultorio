const db = require('../config/db');

const Paciente = {
  findById: async (id) => {
    try {
      const [results] = await db.execute('SELECT * FROM Paciente WHERE id = ?', [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  },

  findByDNI: async (dni) => {
    try {
      const [results] = await db.execute('SELECT * FROM Paciente WHERE dni = ?', [dni]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      const query = `INSERT INTO Paciente (nombre, apellido, dni, obra_social, datos_contacto, documento_path) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [data.nombre, data.apellido, data.dni, data.obra_social, data.datos_contacto, data.documento_path];
      const [results] = await db.execute(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, datosPaciente) => {
    try {
      const query = `UPDATE Paciente SET nombre = ?, apellido = ?, dni = ?, obra_social = ?, datos_contacto = ?, documento_path = ? WHERE id = ?`;
      const { nombre, apellido, dni, obra_social, datos_contacto, documento_path } = datosPaciente;
      const [results] = await db.execute(query, [nombre, apellido, dni, obra_social, datos_contacto, documento_path, id]);
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Paciente;