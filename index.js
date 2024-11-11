const express = require ('express');
const app = express();
const path = require ('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const pacienteRoutes = require('./routes/pacienteRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
const profesionalRoutes = require('./routes/profesionalRoutes');
// const horarioRoutes = require('./routes/horarioRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
// const agendamientoRoutes = require('./routes/agendamientoRoutes');

// const cors = require('cors');
// app.use(cors());

//motor de plantilla pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para parsear datos JSON
app.use(bodyParser.json());

// Middleware para archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.render('index', { title: 'Inicio' });
});

app.use('/agendas', agendaRoutes);
app.use('/turnos', turnoRoutes);
app.use('/profesionales', profesionalRoutes);
// Usar las rutas de pacientes
 app.use('/', pacienteRoutes);
//  app.use('/agendamiento', agendamientoRoutes);

// app.use('/agenda', horarioRoutes);

  
// Iniciar el servidor
// app.listen(3000, () => {
//   console.log('Servidor iniciado en http://localhost:3000');
// });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
