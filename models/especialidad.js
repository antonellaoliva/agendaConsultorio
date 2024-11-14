const db = require('../config/db');

const Especialidad = {
    getEspecialidades: async () => {
        try {
            const [results] = await db.query('SELECT * FROM especialidad');
            return results;
        } catch (error) {
            throw error;
        }
    },

    listarTodas: async () => {
        const [especialidades] = await db.query('SELECT * FROM especialidad');
        return especialidades;
    },

    asignarEspecialidades: async (profesional_id, especialidades, matriculas) => {
    
        const queries = especialidades.map((especialidad, index) => {
            const matricula = matriculas[index];
            return db.query(
                'INSERT INTO profesional_especialidad (profesional_id, especialidad_id, matricula) VALUES (?, ?, ?)',
                [profesional_id, especialidad, matricula]
            );
        });
    
        await Promise.all(queries);
    },

    
    obtenerEspecialidadesYMatriculasPorMedico: async (profesionalId) => {
        const [especialidades] = await db.query(
            `SELECT pe.especialidad_id, e.nombre, pe.matricula
             FROM profesional_especialidad AS pe
             JOIN especialidad AS e ON pe.especialidad_id = e.id
             WHERE pe.profesional_id = ?`,
            [profesionalId]
        );
        return especialidades;
    }
};
    
module.exports = Especialidad;
