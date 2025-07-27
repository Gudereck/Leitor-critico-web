// Servidor Principal

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const usuariosRoutes = require("./routes/usuarios");
app.use("/api", usuariosRoutes); // prefixo das rotas

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
