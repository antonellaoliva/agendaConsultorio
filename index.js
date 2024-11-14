const express = require ('express');
const app = express();
const path = require ('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const pacienteRoutes = require('./routes/pacienteRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
const profesionalRoutes = require('./routes/profesionalRoutes');
const agendaRoutes = require('./routes/agendaRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));


app.get('/', (req, res) => {
  res.render('index', { title: 'Inicio' });
});

app.use('/agendas', agendaRoutes);
app.use('/turnos', turnoRoutes);
app.use('/profesionales', profesionalRoutes);
app.use('/pacientes', pacienteRoutes);



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
