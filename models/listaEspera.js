const db = require('../config/db');

const ListaEspera = {
  async agregarAPacienteListaEspera({ agenda_id, paciente_id, fecha }) {
    const query = `
      INSERT INTO lista_espera (agenda_id, paciente_id, fecha)
      VALUES (?, ?, ?);
    `;
    await db.execute(query, [agenda_id, paciente_id, fecha]);
  },

  async obtenerListaEsperaPorAgenda(agenda_id) {
    const query = `
      SELECT * FROM lista_espera WHERE agenda_id = ? ORDER BY fecha;
    `;
    const [result] = await db.execute(query, [agenda_id]);
    return result;
  }
};

module.exports = ListaEspera;
