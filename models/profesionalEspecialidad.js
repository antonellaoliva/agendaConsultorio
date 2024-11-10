const db = require('../config/db');

const ProfesionalEspecialidad = {
    getProfesionalesPorEspecialidad: async (especialidadId) => {
        const query = `
            SELECT p.*
            FROM profesional p
            JOIN profesional_especialidad pe ON p.id = pe.profesional_id
            WHERE pe.especialidad_id = ?;
        `;
        
        try {
            const [results] = await db.query(query, [especialidadId]);
            return results;
        } catch (error) {
            throw error;
        }
    },

    // obtenerId: async (profesional_id, especialidad_id) => {
    //     try {
    //         const query = `
    //             SELECT id 
    //             FROM profesional_especialidad 
    //             WHERE profesional_id = ? AND especialidad_id = ?
    //         `;
    //         const result = await db.query(query, [profesional_id, especialidad_id]);
    //         console.log("Buscando profesional_especialidad con:", { profesional_id, especialidad_id });

    //         // Retorna el ID si se encuentra, de lo contrario, null
    //         return result.length > 0 ? result[0].id : null;
    //     } catch (error) {
    //         console.error("Error al obtener el ID de profesional_especialidad:", error);
    //         throw error; // Propaga el error para manejarlo en el controlador
    //     }
    // }

    obtenerId: async (profesional_id, especialidad_id) => {
        try {
            const query = `SELECT id FROM profesional_especialidad WHERE profesional_id = ? AND especialidad_id = ?`;
            const values = [profesional_id, especialidad_id];
            const [resultado] = await db.query(query, values); // Asumiendo que `db` es tu conexión

            if (resultado.length === 0) {
                console.log("No se encontró un registro para profesional_id:", profesional_id, "y especialidad_id:", especialidad_id);
                return null; // Si no se encuentra, retorna null
            }

            console.log("Registro encontrado:", resultado[0]);
            return resultado[0].id; // Retorna el ID encontrado
        } catch (error) {
            console.error("Error al obtener el ID de profesional_especialidad:", error);
            throw error;
        }
    }


};

module.exports = ProfesionalEspecialidad;
