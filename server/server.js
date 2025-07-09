const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Caminho absoluto correto para a pasta 'frontend' na raiz do projeto
const basePath = path.join(__dirname, "..", "frontend");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos do frontend corretamente
app.use(express.static(basePath));
// Rota principal
app.get("/Home", (req, res) => {
  res.sendFile(path.join(basePath, "indexOficial.html"));
});

app.listen(port, () => {
  console.log(`A aplicação está rodando na porta ${port}`);
});