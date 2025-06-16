const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const connection = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Rota de Cadastro
app.post("/cadastro", (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ msg: "Preencha todos os campos." });
  }

  const query =
    "INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)";
  connection.query(query, [nome, email, senha, tipo], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ msg: "Email já cadastrado." });
      }
      console.error(err);
      return res.status(500).json({ msg: "Erro ao cadastrar." });
    }
    res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });
  });
});

// Rota de Login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const query = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
  connection.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Erro no servidor." });
    }

    if (results.length > 0) {
      const usuario = results[0];
      res.json({
        token: "TOKEN_EXEMPLO",
        tipo: usuario.tipo_usuario,
      });
    } else {
      res.status(401).json({ msg: "Email ou senha inválidos." });
    }
  });
});

app.listen(3000, () => {
  console.log("Servidor Node rodando na porta 3000");
});
