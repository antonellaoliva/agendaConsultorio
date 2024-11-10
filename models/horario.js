const db = require('../config/db');

const Horario = {
    getHorarios: async (profesionalId, sucursalId, fecha) => {
        const diaSemana = new Date(fecha).getDay();
        const query = `
            SELECT h.hora_inicio, h.hora_fin
            FROM horario h
            JOIN agenda a ON h.agenda_id = a.id
            WHERE a.profesional_especialidad_id = ?
            AND a.sucursal_id = ?
            AND h.dia_semana = ?
            AND h.estado = 'libre';
        `;
        
        try {
            const [results] = await db.query(query, [profesionalId, sucursalId, diaSemana]);
            return results;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Horario;
