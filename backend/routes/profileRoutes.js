const express = require("express");
const router = express.Router();
const editProfileController = require("../controllers/editProfileController");

// Middleware para verificar se o ID é um número (opcional, mas bom)
router.param("id", (req, res, next, id) => {
  if (isNaN(parseInt(id))) {
    return res.status(400).json({ erro: "ID inválido." });
  }
  next();
});

// Rota para obter os dados do perfil: GET /api/perfil/getProfile/:id
router.get("/getProfile/:id", editProfileController.obterPerfil);

// Rota para atualizar o perfil: POST /api/perfil/updateProfile
router.post("/updateProfile", editProfileController.editarPerfil);

// Rota para deletar a conta: DELETE /api/perfil/delete-account/:id
router.delete("/delete-account/:id", editProfileController.deletarConta);

module.exports = router;
