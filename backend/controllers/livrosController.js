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


    // Se já tem livros → retorna
    if (rows.length > 0) {
      conn.release();
      return res.json(rows);
    }

    const livrosProcessados = [];

    for (const livro of livrosFixos) {
      const query = encodeURIComponent(`${livro.titulo} ${livro.autor}`);
      const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&langRestrict=pt`;

      const { data } = await axios.get(url);
      if (!data.items || data.items.length === 0) continue;

      const info = data.items[0].volumeInfo;
      const idGoogle = data.items[0].id;
      const dataPublicacao = normalizarData(info.publishedDate);

      const [result] = await conn.query(
        `
        INSERT INTO livros
        (id_google, titulo, subtitulo, descricao, data_publicacao, editora, idioma, 
         numero_paginas, categoria_principal, media_avaliacao, qtd_avaliacoes, link_previa, link_imagem)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE id_livro = LAST_INSERT_ID(id_livro)
        `,
        [
          idGoogle,
          info.title || livro.titulo,
          info.subtitle || "",
          info.description || "",
          dataPublicacao,
          info.publisher || "",
          info.language || "",
          info.pageCount || null,
          info.categories ? info.categories[0] : "",
          info.averageRating || null,
          info.ratingsCount || null,
          info.previewLink || "",
          info.imageLinks ? info.imageLinks.thumbnail : "",
        ]
      );

      const idLivro = result.insertId;

      // Autores
      if (info.authors && info.authors.length > 0) {
        for (const nomeAutor of info.authors) {
          const [autor] = await conn.query(
            `INSERT INTO autores (nome)
             VALUES (?)
             ON DUPLICATE KEY UPDATE id_autor = LAST_INSERT_ID(id_autor)`,
            [nomeAutor]
          );

          await conn.query(
            `INSERT IGNORE INTO livros_autores (id_livro, id_autor)
             VALUES (?, ?)`,
            [idLivro, autor.insertId]
          );
        }
      }

      // Categorias
      if (info.categories && info.categories.length > 0) {
        for (const nomeCategoria of info.categories) {
          const [cat] = await conn.query(
            `INSERT INTO categorias (nome)
             VALUES (?)
             ON DUPLICATE KEY UPDATE id_categoria = LAST_INSERT_ID(id_categoria)`,
            [nomeCategoria]
          );

          await conn.query(
            `INSERT IGNORE INTO livros_categorias (id_livro, id_categoria)
             VALUES (?, ?)`,
            [idLivro, cat.insertId]
          );
        }
      }

      livrosProcessados.push(idLivro);
    }

    conn.release();

    const [finalLivros] = await pool.query(`
  SELECT 
    l.id_livro,
    l.titulo,
    GROUP_CONCAT(a.nome SEPARATOR ', ') AS autor,
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
return res.json(finalLivros);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao buscar ou salvar livros" });
  }
};

// 🔵 ROTAS DE CATEGORIAS
exports.populares = async (req, res) => {
  const livros = await cacheCategoria("populares", categorias.populares);
  res.json(livros);
};

exports.populares2024 = async (req, res) => {
  const livros = await cacheCategoria("populares2024", categorias.populares2024);
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

exports.detalhesLivro = async (req, res) => {
  const id = req.params.id;

  try {
    const [livroRaw] = await pool.query(
      `SELECT * FROM livros WHERE id_livro = ?`,
      [id]
    );

    if (livroRaw.length === 0)
      return res.status(404).json({ erro: "Livro não encontrado" });

    const livro = livroRaw[0];

    const [autores] = await pool.query(
      `SELECT nome FROM autores 
       JOIN livros_autores USING(id_autor)
       WHERE id_livro = ?`,
      [id]
    );

    const [categorias] = await pool.query(
      `SELECT nome FROM categorias 
       JOIN livros_categorias USING(id_categoria)
       WHERE id_livro = ?`,
      [id]
    );

    const [isbn] = await pool.query(
      `SELECT isbn_10, isbn_13 
       FROM isbns WHERE id_livro = ?`,
      [id]
    );

    res.json({
      ...livro,
      autores: autores.map(a => a.nome),
      categorias: categorias.map(c => c.nome),
      isbn_10: isbn[0]?.isbn_10 || null,
      isbn_13: isbn[0]?.isbn_13 || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar detalhes do livro" });
  }
};

