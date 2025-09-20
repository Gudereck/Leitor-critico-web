const express = require("express");
const path = require("path");
const router = express.Router();

// O basePath já aponta para a pasta correta: .../LEITOR-CRITICO-WEB/frontend/views
const basePath = path.join(__dirname, "../../frontend/views");

// Rota para página inicial
router.get("/", (req, res) => { // Correção: Junte o basePath diretamente com o nome do arquivo
res.sendFile(path.join(basePath, "indexOficial.html"));
});

router.get("/login", (req, res) => {
res.sendFile(path.join(basePath, "login.html"));
});

router.get("/cadastro", (req, res) => {
  res.sendFile(path.join(basePath, "cadastro.html"));
});

router.get("/dashboard/usuario", (req, res) => {
res.sendFile(path.join(basePath, "dashboardUsuario.html"));
});

router.get("/dashboard/critico", (req, res) => {
 res.sendFile(path.join(basePath, "dashboardCritico.html"));
});

router.get("/livros", (req, res) => {
 res.sendFile(path.join(basePath, "livrosCritics.html"));
});

router.get("/perfil/editar", (req, res) => {
  res.sendFile(path.join(basePath, "editProfile.html"));
});

module.exports = router;