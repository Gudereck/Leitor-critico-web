const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const rotasPaginas = require('./routers/paginas');// caminho ajustado para ../routes

// Middleware para ler dados do formulário e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/pages'))); // Add this line
// Usar rotas definidas modularmente
app.use('/', rotasPaginas);

// Inicializar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
