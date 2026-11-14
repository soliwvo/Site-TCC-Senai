const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const popularDadosIniciais = require('./config/seed');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const missaoRoutes = require('./routes/missaoRoutes');
const progressoRoutes = require('./routes/progressoRoutes');
const conquistaRoutes = require('./routes/conquistaRoutes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(usuarioRoutes);
app.use(authRoutes);
app.use(missaoRoutes);
app.use(progressoRoutes);
app.use(conquistaRoutes);

sequelize.authenticate()
  .then(() => console.log('Conectado ao banco de dados Nexa Quest'))
  .catch((err) => console.error('Erro ao conectar:', err));

sequelize.sync()
  .then(() => popularDadosIniciais());

app.listen(3000, () => console.log('Servidor Nexa Play rodando na porta 3000'));
