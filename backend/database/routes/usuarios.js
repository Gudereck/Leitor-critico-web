// Define as rotas

const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const autenticarToken = require("../middleware/auth");

router.post("/cadastro", usuariosController.cadastrar);
router.post("/login", usuariosController.login);

// Exemplo de rota protegida
router.get("/perfil", autenticarToken, (req, res) => {
  res.json({ msg: "Você está autenticado!", usuario: req.usuario });
});

module.exports = router;
