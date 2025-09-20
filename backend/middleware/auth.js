// para proteger rotas privadas

const jwt = require("jsonwebtoken");
const SECRET = "minha_chave_secreta";

function autenticarToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "Token não fornecido." });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Token inválido." });
    req.usuario = decoded;
    next();
  });
}

module.exports = autenticarToken;
