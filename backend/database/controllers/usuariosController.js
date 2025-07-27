const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../db");

const SECRET = "minha_chave_secreta";

exports.cadastrar = async (req, res) => {
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
        return res.status(500).json({ msg: "Erro ao cadastrar." });
      }
      res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });
    });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao processar a senha." });
  }
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ msg: "Preencha todos os campos." });
  }

  const query = "SELECT * FROM usuarios WHERE email = ?";
  connection.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ msg: "Erro no servidor." });

    if (results.length === 0) {
      return res.status(401).json({ msg: "Usuário não encontrado." });
    }

    const usuario = results[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ msg: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo_usuario },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, tipo: usuario.tipo_usuario });
  });
};
