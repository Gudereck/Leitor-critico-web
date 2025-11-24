const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const db = require("../database/db");

// Middleware de exemplo para proteger a rota (você precisa implementar essa lógica)
const isAdmin = (req, res, next) => {
  // Ex: if (req.session.user && req.session.user.cargo === 'admin') { next(); }
  // Por enquanto, vamos deixar passar para o exemplo funcionar
  next();
};

router.get("/dashboard", isAdmin, (req, res) => {
  try {
    res.render("dashboard_admin");
  } catch (error) {
    console.error("Erro ao renderizar dashboard:", error);
    res.status(500).send("Erro ao carregar a página.");
  }
});

// Rota para listar usuários pendentes
router.get("/solicitacoes", isAdmin, async (req, res) => {
  try {
    const sql =
      "SELECT id, nome, email, DATE_FORMAT(data_cadastro, '%d/%m/%Y') as data_cadastro FROM usuarios WHERE status = 'pendente'";
    const [solicitacoes] = await db.query(sql);
    res.status(200).json(solicitacoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao buscar solicitações." });
  }
});

// Continuação do arquivo: routes/adminRoutes.js

router.post("/aprovar/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "UPDATE usuarios SET status = 'aprovado' WHERE id = ?";
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    res.status(200).json({ mensagem: "Usuário aprovado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao aprovar usuário." });
  }
});

// Você pode criar uma rota similar para rejeitar
router.post("/rejeitar/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "UPDATE usuarios SET status = 'rejeitado' WHERE id = ?";
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    res.status(200).json({ mensagem: "Usuário rejeitado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao rejeitar usuário." });
  }
});

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
      "UPDATE usuarios SET cargo = ? WHERE id = ?",
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
