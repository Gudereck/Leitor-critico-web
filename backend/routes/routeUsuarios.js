const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// Rota para cadastrar um novo usuário
router.post("/cadastro", usuarioController.cadastrarUsuario);

// Rota para fazer login
router.post("/login", usuarioController.loginUsuario);

module.exports = router;
