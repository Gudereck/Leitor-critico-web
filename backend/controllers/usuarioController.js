const Usuario = require("../models/usuarioModel");
const bcrypt = require("bcrypt");

exports.cadastrarUsuario = (req, res) => {
  const { nome, email, senha } = req.body;

  Usuario.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (user) return res.status(400).json({ message: "Este e-mail já está em uso." });

    bcrypt.hash(senha, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: "Erro ao criptografar a senha." });

      Usuario.create({ nome, email, senha: hash }, (err, userId) => {
        if (err) return res.status(500).json({ message: "Erro ao cadastrar usuário." });

        return res.status(201).json({
          message: "Usuário cadastrado com sucesso!",
          userId
        });
      });
    });
  });
};

exports.loginUsuario = (req, res) => {
  const { email, senha } = req.body;

  Usuario.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    bcrypt.compare(senha, user.senha, (err, ok) => {
      if (!ok) return res.status(401).json({ message: "Senha incorreta." });

      req.session.user = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cargo: user.cargo
      };

      return res.status(200).json({
        message: "Login realizado com sucesso!",
        user: req.session.user
      });
    });
  });
};
