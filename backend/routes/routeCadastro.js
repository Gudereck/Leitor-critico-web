const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Rota de cadastro
app.post("/cadastro ", (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  // Validação básica
  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ msg: "Preencha todos os campos!" });
  }

  // Verificar se o email já existe
  const usuarioExistente = usuarios.find((u) => u.email === email);
  if (usuarioExistente) {
    return res.status(400).json({ msg: "Email já cadastrado!" });
  }

  // Criar novo usuário
  const novoUsuario = { id: usuarios.length + 1, nome, email, senha, tipo };
  usuarios.push(novoUsuario);

  console.log("Usuário cadastrado:", novoUsuario);

  return res.status(201).json({ msg: "Cadastro realizado com sucesso!" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
