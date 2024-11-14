const Sobreturno = require('../models/sobreturno');
const ListaEspera = require('../models/ListaEspera');

const SobreturnoController = {
  async crear(req, res) {
    const { turno_id, paciente_id, fecha, hora, agenda_id } = req.body;
    
    const maxSobreturnos = await Sobreturno.obtenerMaxSobreturnos(agenda_id);
    const totalSobreturnos = await Sobreturno.contarSobreturnos(turno_id);

    if (totalSobreturnos < maxSobreturnos) {
      await Sobreturno.crearSobreturno({ turno_id, paciente_id, fecha, hora });
      res.json({ success: true, message: "Sobreturno asignado exitosamente" });
    } else {
     
      await ListaEspera.agregarAPacienteListaEspera({ agenda_id, paciente_id, fecha });
      res.json({ success: true, message: "Sobreturnos llenos. Paciente agregado a la lista de espera" });
    }
  }
};

module.exports = SobreturnoController;
