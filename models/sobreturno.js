const db = require('../config/db');

const Sobreturno = {
  async crearSobreturno({ turno_id, paciente_id, fecha, hora }) {
    const query = `
      INSERT INTO sobreturno (turno_id, paciente_id, fecha, hora)
      VALUES (?, ?, ?, ?);
    `;
    try {
      await db.execute(query, [turno_id, paciente_id, fecha, hora]);
      return { success: true, message: "Sobreturno registrado correctamente" };
    } catch (error) {
      console.error("Error al registrar el sobreturno:", error);
      throw error;
    }
  },

  async contarSobreturnos(turno_id) {
    const query = `
      SELECT COUNT(*) AS total FROM sobreturno
      WHERE turno_id = ?;
    `;
    const [result] = await db.execute(query, [turno_id]);
    return result[0].total;
  },

  async obtenerMaxSobreturnos(agenda_id) {
    const query = `
      SELECT max_sobreturnos FROM agenda WHERE id = ?;
    `;
    const [result] = await db.execute(query, [agenda_id]);
    return result[0].max_sobreturnos;
  }
};

module.exports = Sobreturno;
