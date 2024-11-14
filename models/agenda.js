const db = require('../config/db'); 

class Agenda {
    static async findAll() {
        const query = 'SELECT * FROM agenda';
        const [rows] = await db.execute(query);
        return rows;
    }

    static async findById(id) {
        const query = `SELECT * FROM agenda WHERE id = ?`;
        const [rows] = await db.execute(query, [id]);
        return rows[0]; 
    }


    static async findByFilters({ profesional_especialidad_id, sucursal, clasificacion }) {
        const query = `
            SELECT * FROM agenda
            WHERE (profesional_especialidad_id = ? OR ? IS NULL)
              AND (sucursal_id = ? OR ? IS NULL)
              AND (clasificacion = ? OR ? IS NULL)
        `;
        const [rows] = await db.execute(query, [profesional_especialidad_id, profesional_especialidad_id, sucursal, sucursal, clasificacion, clasificacion]);
        return rows;
    }

    static async obtenerAgendaId(profesionalEspecialidadId, sucursal_id) {
      try {
          const [result] = await db.query(`
              SELECT id FROM agenda
              WHERE profesional_especialidad_id = ? AND sucursal_id = ?
              LIMIT 1
          `, [profesionalEspecialidadId, sucursal_id]);
         
          console.log("Resultado obtenido en obtenerAgendaId:", result);

          return result.length > 0 ? result[0].id : null;
      } catch (error) {
          console.error("Error en la consulta obtenerAgendaId:", error);
          throw error;
      }
  }


      static async create({ profesional_especialidad_id, sucursal_id, clasificacion, max_sobreturnos, duracion_turno }) {
       
        profesional_especialidad_id = profesional_especialidad_id || null;
        sucursal_id = sucursal_id || null;
        clasificacion = clasificacion || null;
        max_sobreturnos = max_sobreturnos || null;
        duracion_turno = duracion_turno || null;

        const query = `
            INSERT INTO agenda (profesional_especialidad_id, sucursal_id, clasificacion, max_sobreturnos, duracion_turno)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [profesional_especialidad_id, sucursal_id, clasificacion, max_sobreturnos, duracion_turno]);
        return result;
    }


    static async update(id, { profesional_especialidad_id, sucursal_id, clasificacion, max_sobreturnos, duracion_turno }) {
    const query = `
        UPDATE agenda 
        SET profesional_especialidad_id = ?, sucursal_id = ?, clasificacion = ?, max_sobreturnos = ?, duracion_turno = ?
        WHERE id = ?
    `;
    await db.execute(query, [profesional_especialidad_id, sucursal_id, clasificacion, max_sobreturnos, duracion_turno, id]);
}


static async filtrar({ especialidad, profesional }) {
    console.log('Filtrando por especialidad y profesional:', especialidad, profesional); 
    let query = `
      SELECT 
        agenda.*, 
        profesional.nombre AS profesional_nombre, 
        profesional.apellido AS profesional_apellido, 
        especialidad.nombre AS especialidad_nombre
      FROM agenda
      JOIN profesional_especialidad ON agenda.profesional_especialidad_id = profesional_especialidad.id
      JOIN profesional ON profesional_especialidad.profesional_id = profesional.id
      JOIN especialidad ON profesional_especialidad.especialidad_id = especialidad.id
      WHERE 1=1`; 

    const params = [];

    if (especialidad) {
      query += ' AND especialidad.id = ?';
      params.push(especialidad);
    }

    if (profesional) {
      query += ' AND profesional.id = ?';
      params.push(profesional);
    }

    console.log('Consulta SQL:', query); 
    console.log('Parámetros:', params);  

    
    const [agendas] = await db.query(query, params);
    return agendas;
}
}


module.exports = Agenda;
