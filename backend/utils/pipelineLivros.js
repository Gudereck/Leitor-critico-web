const axios = require("axios");
const pool = require("../database/db");

async function pipeline(lista) {
  const conn = await pool.getConnection();
  const ids = [];

  for (const item of lista) {
    const query = encodeURIComponent(`${item.titulo} ${item.autor}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&langRestrict=pt`;

    const { data } = await axios.get(url);

    if (!data.items || !data.items.length) continue;

    const book = data.items[0];
    const info = book.volumeInfo;

    const [result] = await conn.query(
      `
      INSERT INTO livros
      (id_google, titulo, descricao, editora, data_publicacao, idioma, link_imagem)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE id_livro = LAST_INSERT_ID(id_livro)
      `,
      [
        book.id,
        info.title,
        info.description || "",
        info.publisher || "",
        info.publishedDate || null,
        info.language || "",
        info.imageLinks?.thumbnail || ""
      ]
    );

    ids.push(result.insertId);
  }

  conn.release();

  const [livros] = await pool.query(
    `SELECT * FROM livros WHERE id_livro IN (${ids.join(",")})`
  );

  return livros;
}

module.exports = pipeline;
