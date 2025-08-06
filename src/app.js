const express = require('express');
const cors = require('cors');

const veiculosRoutes = require('./routes/veiculosRoutes');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
}));

// Libera o acesso de qualquer origem (ou especifique apenas o 5173)
app.use(cors());

// Outras configurações:
app.use(express.json());
app.use('/veiculos', veiculosRoutes);

module.exports = app;