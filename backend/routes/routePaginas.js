const express = require("express");
const router = express.Router();
const pool = require("../database/db");
 

// Certifique-se de instalar: npm install node-fetch

// Página inicial
router.get("/", (req, res) => res.render("index"));

// Populares
router.get("/populares", (req, res) => res.render("populares"));

// Classicos da Literatura Brasileira
router.get("/classicosdaliteraturabrasileira", (req, res) =>
  res.render("classicos")
);

// Populares em 2024
router.get("/popularesem2024", (req, res) => res.render("populares2024"));

// Login
router.get("/login", (req, res) => res.render("login"));

// Cadastro
router.get("/cadastro", (req, res) => res.render("cadastro"));

// Dashboards
router.get("/dashboardCritico", (req, res) => res.render("dashboardCritico"));
router.get("/editProfile", (req, res) => res.render("editProfile"));

// Livros - Modificado para capturar parâmetros e sempre passar variáveis
router.get("/livros", async (req, res) => {
  const id = req.query.id;
  if (!id)
    return res.status(400).send("ID do livro não informado.");

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
       GROUP BY l.id_livro`,
      [id]
    );

    if (rows.length === 0)
      return res.render("livrosCritics", { error: "Livro não encontrado" });

    const livro = rows[0];

    res.render("livrosCritics", {
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


// Editar perfil
router.get("/perfil/editar", (req, res) => res.render("editProfile"));

// Reviews dos Críticos
router.get("/criticsreviews", (req, res) => res.render("criticsreviews"));
router.get("/criticsreviews/:id", (req, res) => res.render("reviewDetalhes"));
module.exports = router;
