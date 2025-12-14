// preencherAutoresCategorias.js
const pool = require("./database/db");
const categorias = require("./data/categorias");

async function preencherAutoresCategorias() {
  const conn = await pool.getConnection();

  const todas = [
    ...categorias.populares,
    ...categorias.populares2024,
    ...categorias.classicos,
  ];

  for (const item of todas) {
    try {
      const [livros] = await conn.query(
        "SELECT id_livro FROM livros WHERE titulo = ?",
        [item.titulo]
      );
      if (livros.length === 0) {
        console.warn("Livro não encontrado na tabela livros:", item.titulo);
        continue;
      }

      const idLivro = livros[0].id_livro;

      const [autorResult] = await conn.query(
        `INSERT INTO autores (nome)
         VALUES (?)
         ON DUPLICATE KEY UPDATE id_autor = LAST_INSERT_ID(id_autor)`,
        [item.autor]
      );
      const idAutor = autorResult.insertId;

      await conn.query(
        `INSERT IGNORE INTO livros_autores (id_livro, id_autor)
         VALUES (?, ?)`,
        [idLivro, idAutor]
      );

      console.log(`OK: ${item.titulo} → ${item.autor}`);
    } catch (err) {
      console.error("Erro para", item.titulo, ":", err.message);
    }
  }

  await conn.release();
  process.exit(0);
}

preencherAutoresCategorias().catch((err) => {
  console.error(err);
  process.exit(1);
});
