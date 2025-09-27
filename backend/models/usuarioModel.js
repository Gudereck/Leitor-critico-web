const db = require("../database/connection");

const Usuario = {
  // Cria um novo usuário no banco
  create: (novoUsuario, callback) => {
    const query =
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?)";
    db.query(
      query,
      [
        novoUsuario.nome,
        novoUsuario.email,
        novoUsuario.senha,
        novoUsuario.tipo,
      ],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results.insertId);
      }
    );
  },

  // Busca um usuário pelo email (para verificar se já existe e para login)
  findByEmail: (email, callback) => {
    const query = "SELECT * FROM usuarios WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
};

module.exports = Usuario;
