const cacheCategoria = require('../utils/cacheCategoria');
const categorias = require('../data/categorias');

exports.populares = async (req, res) => {
  try {
    const livros = await cacheCategoria('populares', categorias.populares);
    
    const livrosPorPagina = 10;
    const paginaAtual = parseInt(req.query.pagina) || 1;
    const inicio = (paginaAtual - 1) * livrosPorPagina;
    const fim = inicio + livrosPorPagina;
    
    const livrosPaginados = livros.slice(inicio, fim);
    const totalPaginas = Math.ceil(livros.length / livrosPorPagina);
    
    res.render('populares', {
      livros: livrosPaginados,
      paginaAtual,
      totalPaginas,
      usuario: req.user || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('erro', { mensagem: 'Erro ao carregar populares' });
  }
};
