const axios = require("axios");
const pool = require("../database/db");
const categorias = require("../data/categorias");
const cacheCategoria = require("../utils/cacheCategoria");

// Normaliza datas
function normalizarData(data) {
  if (!data) return null;
  if (/^\d{4}$/.test(data)) return `${data}-01-01`;
  if (/^\d{4}-\d{2}$/.test(data)) return `${data}-01`;
  return data;
}

// Lista fixa para popular DB caso vazio
const livrosFixos = [
  { titulo: "Memórias póstumas de Brás Cubas", autor: "Machado de Assis" },
  { titulo: "O Diário de Um Banana - Dias de Cão", autor: "Jeff Kinney" },
  { titulo: "Dom Casmurro", autor: "Machado de Assis" },
  { titulo: "A Menina que Roubava Livros", autor: "Markus Zusak" },
  { titulo: "1984", autor: "George Orwell" },
  { titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry" },
  { titulo: "Harry Potter e a Pedra Filosofal", autor: "J.K. Rowling" },
  { titulo: "A Revolução dos Bichos", autor: "George Orwell" },
  { titulo: "O Alquimista", autor: "Paulo Coelho" },
  { titulo: "Capitães da Areia", autor: "Jorge Amado" },
  {
    titulo: "O Programador Pragmático: De Aprendiz a Mestre",
    autor: "Aldir José Coelho Corrêa da Silva",
  },
  { titulo: "Entendendo Algoritmos", autor: "Aditya Y. Bhargava" },
];

// HOME: top 10 melhores avaliados com fallback em livrosFixos
exports.homeTopDez = async (req, res) => {
  console.log(">>> homeTopDez chamado");
  try {
    const conn = await pool.getConnection();

    // 1) Top 10 pela média das críticas
    const [top] = await conn.query(`
      SELECT
        l.id_livro,
        l.titulo,
        GROUP_CONCAT(DISTINCT a.nome SEPARATOR ', ') AS autores,
        l.data_publicacao,
        l.editora,
        l.media_avaliacao,
        l.descricao,
        l.link_imagem,
        l.idioma,
        l.numero_paginas,
        l.categoria_principal,
        ANY_VALUE(i.isbn_10) AS isbn_10,
        ANY_VALUE(i.isbn_13) AS isbn_13,
        AVG(c.nota) AS media_criticos
      FROM livros l
      LEFT JOIN livros_autores la ON la.id_livro = l.id_livro
      LEFT JOIN autores a ON a.id_autor = la.id_autor
      LEFT JOIN isbns i ON i.id_livro = l.id_livro
      LEFT JOIN criticas c ON c.id_livro = l.id_livro
      GROUP BY l.id_livro
      HAVING media_criticos IS NOT NULL
      ORDER BY media_criticos DESC
      LIMIT 10
    `);

    console.log(
      "TOP RESULT:",
      top.length,
      top.map((l) => ({
        id: l.id_livro,
        titulo: l.titulo,
        media_criticos: l.media_criticos,
        media_avaliacao: l.media_avaliacao,
      }))
    );

    let livrosParaHome;

    if (top.length < 10) {
      const titulosFixos = livrosFixos.map((l) => l.titulo);

      // pega livros fixos que já existem no banco e que ainda não estão no top
      const [fixos] = await conn.query(
        `
        SELECT
          l.id_livro,
          l.titulo,
          GROUP_CONCAT(DISTINCT a.nome SEPARATOR ', ') AS autores,
          l.data_publicacao,
          l.editora,
          l.media_avaliacao,
          l.descricao,
          l.link_imagem,
          l.idioma,
          l.numero_paginas,
          l.categoria_principal,
          ANY_VALUE(i.isbn_10) AS isbn_10,
          ANY_VALUE(i.isbn_13) AS isbn_13,
          NULL AS media_criticos
        FROM livros l
        LEFT JOIN livros_autores la ON la.id_livro = l.id_livro
        LEFT JOIN autores a ON a.id_autor = la.id_autor
        LEFT JOIN isbns i ON i.id_livro = l.id_livro
        WHERE l.titulo IN (?)
          AND l.id_livro NOT IN (?)
        GROUP BY l.id_livro
        `,
        [titulosFixos, top.map((l) => l.id_livro)]
      );

      console.log("FIXOS RESULT:", fixos.length);
      console.log(
        "FIXOS DETALHE:",
        fixos.map((l) => ({ id: l.id_livro, titulo: l.titulo }))
      );

      const faltando = 10 - top.length;
      livrosParaHome = [...top, ...fixos.slice(0, faltando)];
    } else {
      livrosParaHome = top;
    }

    console.log(
      "PARA HOME:",
      livrosParaHome.length,
      livrosParaHome.map((l) => l.titulo)
    );

    conn.release();

    res.render("index", {
      usuario: req.session.user,
      livros: livrosParaHome,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar página inicial");
  }
};

// 🔵 FUNÇÃO PRINCIPAL – Preenche DB se estiver vazio
exports.buscarOuPopularLivros = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(`
      SELECT 
        l.id_livro,
        l.titulo,
        GROUP_CONCAT(DISTINCT a.nome SEPARATOR ', ') AS autor,
        l.data_publicacao,
        l.editora,
        l.media_avaliacao,
        l.descricao,
        l.link_imagem,
        l.idioma,
        l.numero_paginas,
        l.categoria_principal,
        ANY_VALUE(i.isbn_10) AS isbn_10,
        ANY_VALUE(i.isbn_13) AS isbn_13,
        AVG(c.nota) AS media_criticos
      FROM livros l
      LEFT JOIN livros_autores la ON la.id_livro = l.id_livro
      LEFT JOIN autores a ON a.id_autor = la.id_autor
      LEFT JOIN isbns i ON i.id_livro = l.id_livro
      LEFT JOIN criticas c ON c.id_livro = l.id_livro
      GROUP BY l.id_livro
      LIMIT 12
    `);

    if (rows.length > 0) {
      conn.release();
      return res.json(rows);
    }

    // ... resto da função igual ao seu código, sem mudanças ...
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao buscar ou salvar livros" });
  }
};

// 🔵 ROTAS DE CATEGORIAS (sem mudanças)
exports.populares = async (req, res) => {
  const livros = await cacheCategoria("populares", categorias.populares);
  res.json(livros);
};

exports.populares2024 = async (req, res) => {
  const livros = await cacheCategoria(
    "populares2024",
    categorias.populares2024
  );
  res.json(livros);
};

exports.classicos = async (req, res) => {
  const livros = await cacheCategoria("classicos", categorias.classicos);
  res.json(livros);
};

exports.buscarLivroPorId = async (req, res) => {
  try {
    const id = req.params.id;

    const sql = `
      SELECT 
        l.*,
        GROUP_CONCAT(DISTINCT a.nome SEPARATOR ', ') AS autores,
        GROUP_CONCAT(DISTINCT c.nome SEPARATOR ', ') AS categorias
      FROM livros l
      LEFT JOIN livros_autores la ON la.id_livro = l.id_livro
      LEFT JOIN autores a ON a.id_autor = la.id_autor
      LEFT JOIN livros_categorias lc ON lc.id_livro = l.id_livro
      LEFT JOIN categorias c ON c.id_categoria = lc.id_categoria
      WHERE l.id_livro = ?
      GROUP BY l.id_livro
    `;

    const [rows] = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao buscar livro" });
  }
};
