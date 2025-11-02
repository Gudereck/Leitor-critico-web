const app = require("./app"); // Importa o aplicativo Express configurado de app.js

const PORT = process.env.PORT || 3000; // Define a porta, com um fallback para 3033


app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});


