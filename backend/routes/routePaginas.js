const express = require("express");
const router = express.Router();
  // Certifique-se de instalar: npm install node-fetch

// Página inicial
router.get("/", (req, res) => res.render("index"));
// Populares
router.get("/populares", (req, res) => res.render("populares"));
// Classicos da Literatura Brasileira
router.get("/classicosdaliteraturabrasileira", (req, res) => res.render("classicos"));
// Populares em 2024
router.get("/popularesem2024", (req, res) => res.render("populares2024"));
// Login
router.get("/login", (req, res) => res.render("login"));

// Cadastro
router.get("/cadastro", (req, res) => res.render("cadastro"));

// Dashboards
router.get("/dashboard/usuario", (req, res) => res.render("dashboardUsuario"));
router.get("/dashboard/critico", (req, res) => res.render("dashboardCritico"));

// Livros - Modificado para capturar parâmetros e sempre passar variáveis
router.get("/livros", async (req, res) => {
  const titulo = req.query.titulo || null;  // Pega o parâmetro ou usa null como padrão
  const autor = req.query.autor || null;   // Pega o parâmetro ou usa null como padrão
  
  let livroData = {  // Dados padrão para evitar erros
    titulo: 'Nome do livro',
    autor: 'Nome do autor',
    imagem: '',
    ano: 'Não disponível',
    editora: 'Não disponível',
    descricao: 'Descrição não disponível',
    error: null
  };
  
  if (titulo && autor) {
    const query = encodeURIComponent(`${titulo} ${autor}`);
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&langRestrict=pt`;
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const info = data.items[0].volumeInfo;
        livroData = {
          titulo: info.title || titulo,
          autor: (info.authors && info.authors[0]) || autor,
          imagem: info.imageLinks?.thumbnail || '',
          ano: info.publishedDate ? info.publishedDate.split('-')[0] : 'Não disponível',
          editora: info.publisher || 'Não disponível',
          descricao: info.description || 'Descrição não disponível',
          error: null
        };
      } else {
        livroData.error = "Livro não encontrado";
      }
    } catch (err) {
      console.error("Erro ao buscar dados da API:", err);
      livroData.error = "Erro ao carregar os detalhes do livro";
    }
  } else {
    livroData.error = "Nenhum livro especificado";
  }
  
  // Sempre passe os dados para o template
  res.render("livrosCritics", livroData);  // Passe o objeto livroData
});

// Editar perfil
router.get("/perfil/editar", (req, res) => res.render("editProfile"));

// Reviews dos Críticos 
router.get("/criticsreviews", (req, res) => res.render("criticsreviews"));

module.exports = router;