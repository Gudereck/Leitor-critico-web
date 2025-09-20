const Usuario = require("../models/usuarioModel");
const bcrypt = require("bcrypt");

const saltRounds = 10; // Fator de custo para o hash da senha

// Controller para cadastrar um novo usuário
exports.cadastrarUsuario = (req, res) => {
  const { nome, email, senha } = req.body;

  // 1. Verifica se o usuário já existe
  Usuario.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (user)
      return res.status(400).json({ message: "Este e-mail já está em uso." });

    // 2. Criptografa a senha antes de salvar
    bcrypt.hash(senha, saltRounds, (err, hash) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erro ao criptografar a senha." });

      const novoUsuario = { nome, email, senha: hash };

      // 3. Chama o model para criar o usuário no banco
      Usuario.create(novoUsuario, (err, userId) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Erro ao cadastrar usuário." });
        res
          .status(201)
          .json({ message: "Usuário cadastrado com sucesso!", userId });
      });
    });
  });
};

// Controller para realizar o login
exports.loginUsuario = (req, res) => {
  const { email, senha } = req.body;

  // 1. Busca o usuário pelo e-mail
  Usuario.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    // 2. Compara a senha enviada com a senha criptografada no banco
    bcrypt.compare(senha, user.senha, (err, isMatch) => {
      if (err)
        return res.status(500).json({ message: "Erro ao comparar senhas." });

      if (isMatch) {
        // Senha correta! (Aqui você geraria um token JWT em uma aplicação real)
        res
          .status(200)
          .json({
            message: "Login realizado com sucesso!",
            user: { id: user.id, nome: user.nome, email: user.email },
          });
      } else {
        // Senha incorreta
        res.status(401).json({ message: "Senha incorreta." });
      }
    });
  });
};
