const express = require("express");
const router = express.Router();

// Página inicial
router.get("/", (req, res) => res.render("index"));

// Login
router.get("/login", (req, res) => res.render("login"));

// Cadastro
router.get("/cadastro", (req, res) => res.render("cadastro"));

// Dashboards
router.get("/dashboard/usuario", (req, res) => res.render("dashboardUsuario"));
router.get("/dashboard/critico", (req, res) => res.render("dashboardCritico"));

// Livros
router.get("/livros", (req, res) => res.render("livrosCritics"));

// Editar perfil
router.get("/perfil/editar", (req, res) => res.render("editProfile"));

// Reviews dos Críticos 
router.get("/criticsreviews", (req, res) => res.render("criticsreviews"));

module.exports = router;
