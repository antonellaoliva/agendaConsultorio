const db = require('../config/db');

const Profesional = {
    getProfesional: async () => {
        try {
            const [results] = await db.query('SELECT * FROM profesional');
            return results;
        } catch (error) {
            throw error;
        }
    },

    listarTodos: async() => {
        const [profesionales] = await db.query('SELECT * FROM profesional');
        return profesionales;
    },

    buscarPorId: async (id) => {
        const [[profesionales]] = await db.query('SELECT * FROM profesional WHERE id = ?', [id]);
        return profesionales;
    },

     crear: async ({ nombre, apellido }) => {
        const [resultado] = await db.query(
            'INSERT INTO profesional (nombre, apellido, estado) VALUES (?, ?, "activo")',
            [nombre, apellido]
        );
        return resultado.insertId;
    },

    actualizar: async (id, { nombre, apellido, estado }) => {
        await db.query(
            'UPDATE profesional SET nombre = ?, apellido = ?, estado = ? WHERE id = ?',
            [nombre, apellido, estado, id]
        );
    },

    inactivar: async (id) => {
        await db.query('UPDATE profesional SET estado = "inactivo" WHERE id = ?', [id]);
    },

    // Función para obtener profesionales por especialidad y sucursal
    getProfesionalesPorEspecialidadYSucursal: async (especialidadId, sucursalId) => {
        try {
          const [result] = await db.query(
            `SELECT p.id, p.nombre, p.apellido 
             FROM profesional p
             JOIN profesional_especialidad pe ON p.id = pe.profesional_id
             JOIN agenda a ON a.profesional_especialidad_id = pe.id
             JOIN sucursal s ON s.id = a.sucursal_id
             WHERE pe.especialidad_id = ? AND s.id = ? AND p.estado = 'activo'
             LIMIT 0, 25`,
            [especialidadId, sucursalId]
          );
          return result;
        } catch (error) {
          throw new Error('Error al obtener los profesionales');
        }
      }
    };

module.exports = Profesional;
