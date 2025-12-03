const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const bcrypt = require("bcrypt");

// LOGIN COM SESSÃO REAL
router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Email ou senha inválidos." });
    }

    const usuario = rows[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    connection.release();

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Email ou senha inválidos." });
    }

    // 🔥 SALVA USUÁRIO NA SESSÃO
    req.session.user = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
    };

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({
      message: "Erro no servidor. Tente novamente mais tarde.",
    });
  }
});

module.exports = router;
