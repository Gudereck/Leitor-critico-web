const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const bcrypt = require("bcrypt");

// Rota de cadastro
router.post("/cadastro", async (req, res) => {
  const { nome, email, senha, tipo_usuario } = req.body;

  // Validação básica
  if (!nome || !email || !senha || !tipo_usuario) {
    return res.status(400).json({ msg: "Preencha todos os campos!" });
  }

  // Obter uma conexão do pool
  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Verificar se o email já existe
    const [rows] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.status(400).json({ msg: "Email já cadastrado!" });
    }

    // 2. Criptografar (hash) a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // 3. Inserir o novo usuário no banco de dados
    const [result] = await connection.execute(
      "INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)",
      [nome, email, senhaHash, tipo_usuario]
    );

    console.log("Usuário cadastrado com ID:", result.insertId);

    // Retorna sucesso
    return res.status(201).json({
      msg: "Cadastro realizado com sucesso!",
      usuarioId: result.insertId,
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return res
      .status(500)
      .json({ msg: "Erro no servidor. Tente novamente mais tarde." });
  } finally {
    // Garante que a conexão seja liberada de volta para o pool
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
