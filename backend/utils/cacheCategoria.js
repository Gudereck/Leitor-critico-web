const db = require("../database/db");
const axios = require("axios");

async function cacheCategoria(nomeCategoria, listaTitulos) {
  // 1. Tenta pegar do cache já com media_criticos
  const [cache] = await db.query(
    `SELECT
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
      AVG(c.nota) AS media_criticos,
      ANY_VALUE(cc.posicao) AS posicao
    FROM categorias_cache cc
    JOIN livros l ON l.id_livro = cc.id_livro
    LEFT JOIN livros_autores la ON la.id_livro = l.id_livro
    LEFT JOIN autores a ON a.id_autor = la.id_autor
    LEFT JOIN isbns i ON i.id_livro = l.id_livro
    LEFT JOIN criticas c ON c.id_livro = l.id_livro
    WHERE cc.nome = ?
    GROUP BY l.id_livro
    ORDER BY ANY_VALUE(cc.posicao)`,
    [nomeCategoria]
  );

  if (cache.length > 0) {
    console.log(`✓ Cache encontrado para "${nomeCategoria}": ${cache.length} livros`);
    return cache;
  }

  console.log(`📚 Buscando ${listaTitulos.length} livros da API para "${nomeCategoria}"...`);

  // 2. Buscar da API Google Books e salvar - MANTENDO A ORDEM DO ARRAY
  for (let posicao = 0; posicao < listaTitulos.length; posicao++) {
    const item = listaTitulos[posicao];
    const query = encodeURIComponent(`${item.titulo} ${item.autor}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&langRestrict=pt&maxResults=1`;

    try {
      const api = await axios.get(url);
      const info = api.data.items?.[0]?.volumeInfo;

      if (!info) {
        console.warn(`⚠️ Livro não encontrado: "${item.titulo}"`);
        continue;
      }

      // Verifica se o livro já existe por título (evita duplicatas)
      const [existente] = await db.query(
        `SELECT id_livro FROM livros WHERE titulo = ?`,
        [info.title || item.titulo]
      );

      let idLivro;

      if (existente.length > 0) {
        idLivro = existente[0].id_livro;
        console.log(`📖 Livro já existe: "${info.title}" (ID: ${idLivro})`);
      } else {
        // Insere novo livro
        const [result] = await db.query(
          `INSERT INTO livros (
            id_google, titulo, subtitulo, descricao, data_publicacao,
            editora, idioma, numero_paginas, categoria_principal,
            media_avaliacao, qtd_avaliacoes, link_previa, link_imagem
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            api.data.items[0].id,
            info.title || item.titulo,
            info.subtitle || "",
            info.description || "",
            info.publishedDate?.length === 4
              ? `${info.publishedDate}-01-01`
              : info.publishedDate || null,
            info.publisher || "",
            info.language || "",
            info.pageCount || null,
            info.categories?.[0] || "",
            info.averageRating || null,
            info.ratingsCount || null,
            info.previewLink || "",
            info.imageLinks?.thumbnail || ""
          ]
        );
        idLivro = result.insertId;
        console.log(`✓ Livro novo salvo: "${info.title}" (ID: ${idLivro})`);
      }

      // === Autores: usa Google Books ou o item.autor como fallback ===
      const autoresApi =
        info.authors && info.authors.length > 0 ? info.authors : [item.autor];

      for (const nomeAutor of autoresApi) {
        const [autorResult] = await db.query(
          `INSERT INTO autores (nome)
           VALUES (?)
           ON DUPLICATE KEY UPDATE id_autor = LAST_INSERT_ID(id_autor)`,
          [nomeAutor]
        );

        const idAutor = autorResult.insertId;

        await db.query(
          `INSERT IGNORE INTO livros_autores (id_livro, id_autor)
           VALUES (?, ?)`,
          [idLivro, idAutor]
        );
      }

      // Verifica se já existe na categoria_cache
      const [jaNaCache] = await db.query(
        `SELECT id FROM categorias_cache WHERE nome = ? AND id_livro = ?`,
        [nomeCategoria, idLivro]
      );

      if (jaNaCache.length === 0) {
        await db.query(
          `INSERT INTO categorias_cache (nome, id_livro, posicao) VALUES (?, ?, ?)`,
          [nomeCategoria, idLivro, posicao]
        );
        console.log(`✓ Adicionado à cache "${nomeCategoria}" (posição: ${posicao})`);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`❌ Erro ao buscar "${item.titulo}": ${err.message}`);
    }
  }

  // 3. Buscar novamente, agora com cache preenchido
  const [finalCache] = await db.query(
    `SELECT
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
      AVG(c.nota) AS media_criticos,
      ANY_VALUE(cc.posicao) AS posicao
    FROM categorias_cache cc
    JOIN livros l ON l.id_livro = cc.id_livro
    LEFT JOIN livros_autores la ON la.id_livro = l.id_livro
    LEFT JOIN autores a ON a.id_autor = la.id_autor
    LEFT JOIN isbns i ON i.id_livro = l.id_livro
    LEFT JOIN criticas c ON c.id_livro = l.id_livro
    WHERE cc.nome = ?
    GROUP BY l.id_livro
    ORDER BY ANY_VALUE(cc.posicao)`,
    [nomeCategoria]
  );

  console.log(`✓ Cache preenchido com sucesso: ${finalCache.length} livros`);
  return finalCache;
}

module.exports = cacheCategoria;
