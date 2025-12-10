const express = require("express");
const router = express.Router();
const pool = require("../database/db");

const cacheCategoria = require("../utils/cacheCategoria");
const categorias = require("../data/categorias");

// Página inicial
const livrosController = require("../controllers/livrosController");

// Página inicial
router.get("/", livrosController.homeTopDez);

// Populares
router.get("/populares", async (req, res) => {
  try {
    const livros = await cacheCategoria("populares", categorias.populares);
    
    const livrosPorPagina = 10;
    const paginaAtual = parseInt(req.query.pagina) || 1;
    const inicio = (paginaAtual - 1) * livrosPorPagina;
    const fim = inicio + livrosPorPagina;
    
    const livrosPaginados = livros.slice(inicio, fim);
    const totalPaginas = Math.ceil(livros.length / livrosPorPagina);
    
    // 🔍 DEBUG
    console.log(`========== POPULARES ==========`);
    console.log(`Total de livros: ${livros.length}`);
    console.log(`Página atual: ${paginaAtual}`);
    console.log(`Início: ${inicio}, Fim: ${fim}`);
    console.log(`Livros nesta página: ${livrosPaginados.length}`);
    console.log(`Primeiros 3 títulos:`, livrosPaginados.slice(0, 3).map(l => l.titulo));
    console.log(`==============================\n`);
    
    res.render("populares", {
      livros: livrosPaginados,
      paginaAtual,
      totalPaginas,
      usuario: req.session.user
    });
  } catch (err) {
    console.error("ERRO:", err.message);
    res.status(500).send("Erro ao carregar populares");
  }
});

// Clássicos
router.get("/classicosdaliteraturabrasileira", async (req, res) => {
  try {
    const livros = await cacheCategoria("classicos", categorias.classicos);
    
    const livrosPorPagina = 10;
    const paginaAtual = parseInt(req.query.pagina) || 1;
    const inicio = (paginaAtual - 1) * livrosPorPagina;
    const fim = inicio + livrosPorPagina;
    
    const livrosPaginados = livros.slice(inicio, fim);
    const totalPaginas = Math.ceil(livros.length / livrosPorPagina);
    console.log(
  "CLÁSSICOS PÁGINA",
  paginaAtual,
  livrosPaginados.map(l => ({ id: l.id_livro, titulo: l.titulo, autores: l.autores }))
);


    res.render("classicos", {
      livros: livrosPaginados,
      paginaAtual,
      totalPaginas,
      usuario: req.session.user
    });
  } catch (err) {
    console.error("ERRO:", err.message);
    res.status(500).send("Erro ao carregar clássicos");
  }
});

// Populares 2024
router.get("/popularesem2024", async (req, res) => {
  try {
    const livros = await cacheCategoria("populares2024", categorias.populares2024);
    
    const livrosPorPagina = 10;
    const paginaAtual = parseInt(req.query.pagina) || 1;
    const inicio = (paginaAtual - 1) * livrosPorPagina;
    const fim = inicio + livrosPorPagina;
    
    const livrosPaginados = livros.slice(inicio, fim);
    const totalPaginas = Math.ceil(livros.length / livrosPorPagina);
    
    // 🔍 DEBUG
    console.log(`========== POPULARES 2024 ==========`);
    console.log(`Total de livros: ${livros.length}`);
    console.log(`Página atual: ${paginaAtual}`);
    console.log(`Início: ${inicio}, Fim: ${fim}`);
    console.log(`Livros nesta página: ${livrosPaginados.length}`);
    console.log(`Primeiros 3 títulos:`, livrosPaginados.slice(0, 3).map(l => l.titulo));
    console.log(`==============================\n`);
    
    res.render("populares2024", {
      livros: livrosPaginados,
      paginaAtual,
      totalPaginas,
      usuario: req.session.user
    });
  } catch (err) {
    console.error("ERRO:", err.message);
    res.status(500).send("Erro ao carregar populares 2024");
  }
});

// Login
router.get("/login", (req, res) => res.render("login", { usuario: req.session.user }));

// Cadastro
router.get("/cadastro", (req, res) => res.render("cadastro", { usuario: req.session.user }));

// Dashboards
router.get("/dashboardCritico", (req, res) => res.render("dashboardCritico", { usuario: req.session.user }));
router.get("/editProfile", (req, res) => res.render("editProfile", { usuario: req.session.user }));

// Livros com dados e sessão
router.get("/livros", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send("ID do livro não informado.");

  try {
    const [rows] = await pool.query(
      `SELECT 
          l.id_livro,
          l.titulo,
          GROUP_CONCAT(a.nome SEPARATOR ', ') AS autores,
          l.data_publicacao,
          l.editora,
          l.descricao,
          l.link_imagem,
          l.idioma,
          l.numero_paginas,
          l.categoria_principal,
          ANY_VALUE(i.isbn_10) AS isbn_10,
          ANY_VALUE(i.isbn_13) AS isbn_13
       FROM livros l
       LEFT JOIN livros_autores la ON la.id_livro = l.id_livro
       LEFT JOIN autores a ON a.id_autor = la.id_autor
       LEFT JOIN isbns i ON i.id_livro = l.id_livro
       WHERE l.id_livro = ?
       GROUP BY l.id_livro`, [id]
    );

    if (rows.length === 0)
      return res.render("livrosCritics", { error: "Livro não encontrado", usuario: req.session.user });

    const livro = rows[0];

    res.render("livrosCritics", {
      usuario: req.session.user,
      livro_id: livro.id_livro,
      titulo: livro.titulo,
      autor: livro.autores,
      ano: livro.data_publicacao
        ? livro.data_publicacao instanceof Date
          ? livro.data_publicacao.toISOString().split("T")[0].split("-")[0]
          : String(livro.data_publicacao).split("-")[0]
        : "",
      editora: livro.editora,
      descricao: livro.descricao,
      imagem: livro.link_imagem,
      idioma: livro.idioma,
      paginas: livro.numero_paginas,
      categoria: livro.categoria_principal,
      isbn10: livro.isbn_10,
      isbn13: livro.isbn_13
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro interno");
  }
});

// Reviews dos Críticos
router.get("/criticsreviews", (req, res) => res.render("criticsreviews", { usuario: req.session.user }));
router.get("/criticsreviews/:id", (req, res) => res.render("reviewDetalhes", { usuario: req.session.user }));

module.exports = router;
