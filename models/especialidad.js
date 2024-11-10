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

    asignarEspecialidades: async (profesionalId, especialidades) => {
        if (!Array.isArray(especialidades)) {
            throw new Error('especialidades debe ser un array');
        }
    
        // Obtén las especialidades actuales
        const [filas] = await db.query(
            'SELECT especialidad_id FROM profesional_especialidad WHERE profesional_id = ?',
            [profesionalId]
        );
        const idsActuales = filas.map(e => e.especialidad_id);
    
        // Determina las especialidades a agregar y las que se podrían eliminar si no tienen dependencias
        const especialidadesAAgregar = especialidades.filter(id => !idsActuales.includes(id));
        const especialidadesAEliminar = idsActuales.filter(id => !especialidades.includes(id));
    
        // Agrega las nuevas especialidades
        for (const especialidadId of especialidadesAAgregar) {
            await db.query(
                'INSERT INTO profesional_especialidad (profesional_id, especialidad_id) VALUES (?, ?)',
                [profesionalId, especialidadId]
            );
        }
    
        // Intenta eliminar las especialidades no deseadas solo si no tienen dependencias
        for (const especialidadId of especialidadesAEliminar) {
            try {
                await db.query(
                    'DELETE FROM profesional_especialidad WHERE profesional_id = ? AND especialidad_id = ?',
                    [profesionalId, especialidadId]
                );
            } catch (error) {
                // Ignorar error de restricción de clave externa si ocurre
                if (error.code !== 'ER_ROW_IS_REFERENCED_2') {
                    throw error;
                }
                console.log(`No se pudo eliminar la especialidad ${especialidadId} porque está en uso en otra tabla.`);
            }
        }
    },
    
    // asignarEspecialidades: async (profesionalId, especialidades) => {
    //     // Elimina las especialidades actuales del médico
    //     await db.query('DELETE FROM profesional_especialidad WHERE profesional_id = ?', [profesionalId]);
        
    //     // Asigna nuevas especialidades
    //     for (const especialidadId of especialidades) {
    //         await db.query(
    //             'INSERT INTO profesional_especialidad (profesional_id, especialidad_id) VALUES (?, ?)',
    //             [profesionalId, especialidadId]
    //         );
    //     }
    // },

    obtenerEspecialidadesPorMedico: async (profesionalId) => {
        const [especialidades] = await db.query(
            'SELECT especialidad_id FROM profesional_especialidad WHERE profesional_id = ?',
            [profesionalId]
        );
        return especialidades.map(e => e.especialidad_id);
    }

};

module.exports = Especialidad;
