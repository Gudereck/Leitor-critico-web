const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const bcrypt = require("bcrypt");

// Rota de login
router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  // Validação básica
  if (!email || !senha) {
    return res.status(400).json({ msg: "Preencha todos os campos!" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Buscar o usuário pelo email
    const [rows] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    // Verificar se o usuário existe
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Email ou senha inválidos." });
    }

    const usuario = rows[0];

    // Comparar a senha enviada com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (senhaCorreta) {
      return res.status(200).json({
        msg: "Login realizado com sucesso!",
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          cargo: usuario.cargo,
        },
      });
    } else {
      return res.status(401).json({ msg: "Email ou senha inválidos." });
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return res
      .status(500)
      .json({ msg: "Erro no servidor. Tente novamente mais tarde." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
