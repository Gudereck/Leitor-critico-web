const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const connection = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET_JWT;

// Rota de Cadastro
app.post("/cadastro", async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ msg: "Preencha todos os campos." });
  }

  try {
    const hashSenha = await bcrypt.hash(senha, 10);
    const query =
      "INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)";

    connection.query(query, [nome, email, hashSenha, tipo], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ msg: "Email já cadastrado." });
        }
        console.error(err);
        return res.status(500).json({ msg: "Erro ao cadastrar." });
      }
      res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ msg: "Erro ao criptografar senha." });
  }
});

// Rota de Login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ msg: "Preencha todos os campos." });
  }

  const query = "SELECT * FROM usuarios WHERE email = ?";
  connection.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Erro no servidor." });
    }

    if (results.length > 0) {
      const usuario = results[0];
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (senhaValida) {
        const token = jwt.sign(
          { id: usuario.id, tipo: usuario.tipo_usuario },
          SECRET,
          { expiresIn: "2h" }
        );

        return res.json({
          token,
          tipo: usuario.tipo_usuario,
        });
      } else {
        return res.status(401).json({ msg: "Senha incorreta." });
      }
    } else {
      return res.status(401).json({ msg: "Usuário não encontrado." });
    }
  });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log("Servidor Node rodando na porta 3000");
});

