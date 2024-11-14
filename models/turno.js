const db = require('../config/db');

const Turno = {
  async crearTurno({ paciente_id, agenda_id, profesional_id, fecha, hora, estado_turno, motivo_consulta }) {
    const query = `
      INSERT INTO turno (paciente_id, agenda_id, profesional_id, fecha, hora, estado_turno, motivo_consulta)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await db.query(query, [paciente_id, agenda_id, profesional_id, fecha, hora, estado_turno, motivo_consulta]);
      return { success: true, message: "Turno guardado correctamente" };
    } catch (error) {
      console.error("Error al guardar el turno:", error);
      throw new Error("Error al guardar el turno");
    }
  },

  actualizarTurno: async (turnoId, pacienteId, nuevoEstado, motivoConsulta) => {
    const query = `
        UPDATE turno 
        SET estado_turno = ?, paciente_id = ?, motivo_consulta = ?
        WHERE id = ?;
    `;
    await db.execute(query, [nuevoEstado, pacienteId, motivoConsulta, turnoId]);
},


  async mostrarHorariosDisponibles(criterios) {
    const { fecha, sucursal_id, profesional_id, especialidad_id } = criterios;

    const query = `
      SELECT h.id AS horario_id, h.dia_semana, h.hora_inicio, h.hora_fin, a.id AS agenda_id, 
             p.nombre AS profesional_nombre, p.apellido AS profesional_apellido, e.nombre AS especialidad
      FROM horario h
      JOIN agenda a ON h.agenda_id = a.id
      JOIN profesional_especialidad pe ON a.profesional_especialidad_id = pe.id
      JOIN profesional p ON pe.profesional_id = p.id
      JOIN especialidad e ON pe.especialidad_id = e.id
      LEFT JOIN turno t ON t.agenda_id = a.id AND t.fecha = ? AND t.hora = h.hora_inicio
      WHERE h.estado = 'activo' 
        
        AND t.id IS NULL
        AND (? IS NULL OR a.sucursal_id = ?)
        AND (? IS NULL OR pe.profesional_id = ?)
        AND (? IS NULL OR e.id = ?)
      ORDER BY h.dia_semana, h.hora_inicio;
    `;

    try {
      const [results] = await db.execute(query, [fecha, sucursal_id, sucursal_id, profesional_id, profesional_id, especialidad_id, especialidad_id]);
      return results;
    } catch (error) {
      console.error("Error al buscar horarios disponibles:", error);
      throw error;
    }
  },

  async registrarTurno(turnoData) {
    const { paciente_id, agenda_id, profesional_id, fecha, hora, estado_turno_id, motivo_consulta } = turnoData;

    const query = `
      INSERT INTO turno (paciente_id, agenda_id, profesional_id, fecha, hora, estado_turno_id, motivo_consulta)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    try {
      await db.execute(query, [paciente_id, agenda_id, profesional_id, fecha, hora, estado_turno_id, motivo_consulta]);
    } catch (error) {
      console.error("Error al registrar turno:", error);
      throw error;
    }
  },

  getPorEspecialidadSucursalYProfesional: async (especialidadId, sucursalId, profesionalId) => {
    const query = `
      SELECT * FROM turno
      WHERE agenda_id IN (
        SELECT id FROM agenda
        WHERE profesional_especialidad_id IN (
          SELECT id FROM profesional_especialidad 
          WHERE especialidad_id = ? AND profesional_id = ?
        ) 
        AND sucursal_id = ?
      ) 
      AND estado_turno = 'libre'
      
      AND fecha >= CURRENT_DATE;  `;

    const [turnos] = await db.execute(query, [especialidadId, profesionalId, sucursalId]);
    return turnos;
  },

  
};


  

module.exports = Turno;
