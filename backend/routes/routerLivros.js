const express = require("express");
const router = express.Router();
const livrosController = require("../controllers/livrosController");

// Lista os 12 fixos (ou busca + salva)
router.get("/", livrosController.buscarOuPopularLivros);

// Populares
router.get("/populares", livrosController.populares);

// Populares 2024
router.get("/populares-2024", livrosController.populares2024);

// Clássicos
router.get("/classicos", livrosController.classicos);
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
  ano: anoCalc,
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


module.exports = router;
