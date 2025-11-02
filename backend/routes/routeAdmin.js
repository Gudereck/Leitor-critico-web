const express = require("express");
const router = express.Router();
const pool = require("../database/db");

// Rota: GET /api/admin/promover-critico/:usuarioId
// Esta rota é acessada quando o admin clica no link do e-mail
router.get("/promover-critico/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params;

  if (!usuarioId) {
    return res.status(400).send("<h1>Erro: ID do usuário não fornecido.</h1>");
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Executa o UPDATE para mudar o cargo do usuário
    const [result] = await connection.execute(
      "UPDATE usuarios SET role = ? WHERE id = ?",
      ["critico", usuarioId] // O novo cargo é 'critico'
    );

    if (result.affectedRows === 0) {
      // Se o ID não existir no banco
      return res.status(404).send("<h1>Erro: Usuário não encontrado.</h1>");
    }

    // Se der certo, o admin verá esta mensagem no navegador
    return res.status(200).send(`
            <h1>Sucesso!</h1>
            <p>O usuário com ID <strong>${usuarioId}</strong> foi promovido para <strong>'critico'</strong>.</p>
            <p>Você já pode fechar esta aba.</p>
        `);
  } catch (error) {
    console.error("Erro ao promover usuário:", error);
    return res
      .status(500)
      .send(
        "<h1>Erro no Servidor</h1><p>Não foi possível atualizar o cargo do usuário.</p>"
      );
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
