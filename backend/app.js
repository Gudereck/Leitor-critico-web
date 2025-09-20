const express = require("express");
const cors = require("cors");
const path = require("path");
const usuarioRoutes = require("./routes/routeUsuarios"); // Importa as rotas de usuário

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota principal da API
app.get("/api", (req, res) => {
  res.json({ message: "API Leitor Crítico funcionando!" });
});

// Usa as rotas de usuário com o prefixo /api/usuarios
app.use("/api/usuarios", usuarioRoutes);

// Servir arquivos estáticos do frontend
// 'frontend' deve estar no mesmo nível que 'backend'
app.use(express.static(path.join(__dirname, "../frontend")));

// Rota para a página inicial (se o frontend for servido pelo backend)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "indexOficial.html"));
});

// Exporta a instância do app
module.exports = app;
