const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "senha do mysql", // Troque pela sua senha do MySQL
  database: "cadastro_usuario",
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err);
    return;
  }
  console.log("Conexão com o banco de dados estabelecida!");
});

module.exports = connection;
