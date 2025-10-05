const express = require("express");
const cors = require("cors");
const path = require("path");

// Importar suas rotas
const paginasRoutes = require("./routes/routePaginas");
const cadastroRoutes = require("./routes/routeCadastro");

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));
// Servir arquivos estáticos (CSS, JS do frontend, imagens)
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.static(path.join(__dirname, "../frontend/views")));

// Usar os roteadores
app.use("/", paginasRoutes); // Rotas que servem as páginas HTML
app.use("/api", cadastroRoutes); // Rotas da API (para dados)

module.exports = app;
