const express = require("express");
const cors = require("cors");
const path = require("path");

// Rotas
const paginasRoutes = require("./routes/routePaginas");
const cadastroRoutes = require("./routes/routeCadastro");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

// Servir todos os arquivos estáticos da pasta 'frontend'
app.use(express.static(path.join(__dirname, "../frontend")));
console.log("Arquivos estáticos servidos de:", path.join(__dirname, "../frontend"));

// Rotas
app.use("/", paginasRoutes);
app.use("/api", cadastroRoutes);

module.exports = app;
