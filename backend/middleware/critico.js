module.exports = (req, res, next) => {
  const usuario = req.body.usuario;

  if (!usuario || usuario.cargo !== "critico") {
    return res.status(403).json({ msg: "Acesso não autorizado" });
  }
  next();
};
