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
  
          // Verificación de resultado obtenido
          console.log("Resultado obtenido en obtenerAgendaId:", result);
  
          // Retornar el ID o null si no existe
          return result.length > 0 ? result[0].id : null;
      } catch (error) {
          console.error("Error en la consulta obtenerAgendaId:", error);
          throw error;
      }
  }

  //   static async obtenerAgendaId(profesional_especialidad_id, sucursal_id) {
  //     try {
  //         const query = `
  //             SELECT id 
  //             FROM agenda 
  //             WHERE profesional_especialidad_id = ? AND sucursal_id = ?
  //         `;
  //         const result = await db.query(query, [profesional_especialidad_id, sucursal_id]);

  //         console.log("Resultado de la consulta a agenda:", result); // Añade este log para ver el resultado

  //         return result.length > 0 ? result[0].id : null;
  //     } catch (error) {
  //         console.error("Error al obtener el ID de la agenda:", error);
  //         throw error; // Propaga el error para manejarlo en el controlador
  //     }
  // }


  //   static async obtenerAgendaId(profesional_especialidad_id, sucursal_id) {
  //     try {
  //       console.log("Parámetros recibidos para consulta:", { profesional_especialidad_id, sucursal_id });

  //         const query = `
  //             SELECT id FROM agenda
  //             WHERE profesional_especialidad_id = ?
  //               AND sucursal_id = ?
              
  //         `;

  //         // Ejecuta la consulta y obtiene el resultado
  //         const [rows] = await db.execute(query, [profesional_especialidad_id, sucursal_id]);

  //         console.log("Resultado de la consulta:", rows);

  //         // Devuelve el id de la primera agenda encontrada o null si no hay coincidencias
  //         return rows.length > 0 ? rows[0].id : null;
  //     } catch (error) {
  //         console.error("Error al obtener el ID de la agenda:", error);
  //         throw error;
  //     }
  // }


      static async create({ profesional_especialidad_id, sucursal_id, estado, clasificacion, max_sobreturnos, duracion_turno }) {
       
        profesional_especialidad_id = profesional_especialidad_id || null;
        sucursal_id = sucursal_id || null;
        estado = estado || null;
        clasificacion = clasificacion || null;
        max_sobreturnos = max_sobreturnos || null;
        duracion_turno = duracion_turno || null;

        const query = `
            INSERT INTO agenda (profesional_especialidad_id, sucursal_id, estado, clasificacion, max_sobreturnos, duracion_turno)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [profesional_especialidad_id, sucursal_id, estado, clasificacion, max_sobreturnos, duracion_turno]);
        return result;
    }


    static async update(id, { profesional_especialidad_id, sucursal_id, estado, clasificacion, max_sobreturnos, duracion_turno }) {
    const query = `
        UPDATE agenda 
        SET profesional_especialidad_id = ?, sucursal_id = ?, estado = ?, clasificacion = ?, max_sobreturnos = ?, duracion_turno = ?
        WHERE id = ?
    `;
    await db.execute(query, [profesional_especialidad_id, sucursal_id, estado, clasificacion, max_sobreturnos, duracion_turno, id]);
}

// static async desactivar(id) {
//     return await db.query('UPDATE agenda SET estado = ? WHERE id = ?', ['inactivo', id]);
// }

// static async obtenerEspecialidades() {
//     const query = 'SELECT id, nombre FROM especialidad';
//     const [result] = await db.query(query);
//     return result; // Devuelve el resultado para que pueda ser usado
// }

// // Método para obtener profesionales
// static async obtenerProfesionales() {
//     const query = 'SELECT id, nombre FROM profesional';
//     const [result] = await db.query(query);
//     return result; // Devuelve el resultado para que pueda ser usado
//}

// Método para filtrar agendas
static async filtrar({ especialidad, profesional }) {
    console.log('Filtrando por especialidad y profesional:', especialidad, profesional); // Verifica los parámetros
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
      WHERE 1=1`; // Condición para concatenar los filtros

    const params = [];

    // Filtrar por especialidad si se seleccionó
    if (especialidad) {
      query += ' AND especialidad.id = ?';
      params.push(especialidad);
    }

    // Filtrar por profesional si se seleccionó
    if (profesional) {
      query += ' AND profesional.id = ?';
      params.push(profesional);
    }

    console.log('Consulta SQL:', query); // Para verificar la consulta generada
    console.log('Parámetros:', params);  

    // Ejecución de la consulta con parámetros
    const [agendas] = await db.query(query, params);
    return agendas;
}
}

// Método para obtener estados
// static async obtenerEstados() {
//     const query = 'SELECT id, descripcion FROM estado_turno'; // Ajusta el nombre de la tabla si es necesario
//     const [result] = await db.query(query);
//     return result; // Devuelve el resultado para que pueda ser usado
// }

// static async filtrar({ especialidad, profesional }) {
//     let query = `
//       SELECT agenda.*, profesional.nombre AS profesional_nombre, profesional.apellido AS profesional_apellido, especialidad.nombre AS especialidad_nombre
//       FROM agenda
//       JOIN profesional_especialidad ON agenda.profesional_especialidad_id = profesional_especialidad.id
//       JOIN profesional ON profesional_especialidad.profesional_id = profesional.id
//       JOIN especialidad ON profesional_especialidad.especialidad_id = especialidad.id
//       WHERE 1=1`;

//     const params = [];

//     // Filtrar por especialidad si se seleccionó
//     if (especialidad) {
//       query += ' AND especialidad.id = ?';
//       params.push(especialidad);
//     }

//     // Filtrar por profesional si se seleccionó
//     if (profesional) {
//       query += ' AND profesional.id = ?';
//       params.push(profesional);
//     }

//     const [agendas] = await db.query(query, params);
//     return agendas;
//   }
// }

module.exports = Agenda;
