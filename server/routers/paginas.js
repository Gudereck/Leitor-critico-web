const express = require("express");
const path = require("path");
const router = express.Router();

const basePath = path.join(__dirname, "../../frontend/pages");

// Rota para página inicial
router.get("/", (req, res) => {
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
