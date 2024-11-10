const ListaEspera = require('../models/listaEspera');

const ListaEsperaController = {
  async mostrar(req, res) {
    const { agenda_id } = req.params;
    const listaEspera = await ListaEspera.obtenerListaEsperaPorAgenda(agenda_id);
    res.json(listaEspera);
  }
};

module.exports = ListaEsperaController;
