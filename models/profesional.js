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

    actualizarDatosBasicos: async (id, { nombre, apellido, estado }) => {
    await db.query(
        'UPDATE profesional SET nombre = ?, apellido = ?, estado = ? WHERE id = ?',
        [nombre, apellido, estado, id]
    );
},

    actualizarEspecialidadesYMatriculas: async (id, especialidades, matriculas) => {
    
    const especialidadesFiltradas = [];
    const matriculasFiltradas = [];

    especialidades.forEach((especialidad, index) => {
        if (especialidad && matriculas[index]) {
            especialidadesFiltradas.push(especialidad);
            matriculasFiltradas.push(matriculas[index]);
        }
    });

    
    [especialidadesExistentes] = await db.query(
        'SELECT especialidad_id FROM profesional_especialidad WHERE profesional_id = ?',
        [id]
    );
    
    const idsExistentes = especialidadesExistentes.map(row => row.especialidad_id);
    const idsParaEliminar = idsExistentes.filter(id => !especialidadesFiltradas.includes(id));

    if (idsParaEliminar.length > 0) {
        
        const [referenciasAgenda] = await db.query(
            'SELECT COUNT(*) AS count FROM agenda WHERE profesional_especialidad_id IN (?)',
            [idsParaEliminar]
        );

        if (referenciasAgenda[0].count === 0) {
            await db.query(
                'DELETE FROM profesional_especialidad WHERE profesional_id = ? AND especialidad_id IN (?)',
                [id, idsParaEliminar]
            );
        }
    }

    
    for (let i = 0; i < especialidadesFiltradas.length; i++) {
        const especialidad_id = especialidadesFiltradas[i];
        const matricula = matriculasFiltradas[i];

        if (especialidad_id && matricula) {
            const [existingEspecialidad] = await db.query(
                'SELECT * FROM profesional_especialidad WHERE profesional_id = ? AND especialidad_id = ?',
                [id, especialidad_id]
            );

            if (existingEspecialidad.length > 0) {
                await db.query(
                    'UPDATE profesional_especialidad SET matricula = ? WHERE profesional_id = ? AND especialidad_id = ?',
                    [matricula, id, especialidad_id]
                );
            } else {
                await db.query(
                    'INSERT INTO profesional_especialidad (profesional_id, especialidad_id, matricula) VALUES (?, ?, ?)',
                    [id, especialidad_id, matricula]
                );
            }
        }
    }
},

    inactivar: async (id) => {
        await db.query('UPDATE profesional SET estado = "inactivo" WHERE id = ?', [id]);
    },

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
