const db = require("../database/db");
const axios = require("axios");

async function cacheCategoria(nomeCategoria, listaTitulos) {
  // 1. Tenta pegar do cache
  const [cache] = await db.query(
    `SELECT l.* FROM categorias_cache c
     JOIN livros l ON l.id_livro = c.id_livro
     WHERE c.nome = ?`,
    [nomeCategoria]
  );

  if (cache.length > 0) return cache;

  // 2. Buscar da API Google Books e salvar
  for (const item of listaTitulos) {
    // 🔥 CORREÇÃO AQUI
    const query = encodeURIComponent(`${item.titulo} ${item.autor}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&langRestrict=pt&maxResults=1`;

    const api = await axios.get(url);

    const info = api.data.items?.[0]?.volumeInfo;
    if (!info) continue;

    // Inserir livro
    const [result] = await db.query(
      `INSERT INTO livros (
         id_google, titulo, subtitulo, descricao, data_publicacao,
         editora, idioma, numero_paginas, categoria_principal,
         media_avaliacao, qtd_avaliacoes, link_previa, link_imagem
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id_livro = LAST_INSERT_ID(id_livro)`,
      [
        api.data.items[0].id,
        info.title || item.titulo,
        info.subtitle || "",
        info.description || "",
        info.publishedDate?.length === 4 ? `${info.publishedDate}-01-01` : info.publishedDate || null,
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

    const idLivro = result.insertId;

    // Relacionar no cache
    await db.query(
      `INSERT INTO categorias_cache (nome, id_livro) VALUES (?, ?)`,
      [nomeCategoria, idLivro]
    );
  }

  // 3. Agora retornar do cache (garantido que existirão vários)
  const [finalCache] = await db.query(
    `SELECT l.* FROM categorias_cache c
     JOIN livros l ON l.id_livro = c.id_livro
     WHERE c.nome = ?`,
    [nomeCategoria]
  );

  return finalCache;
}

module.exports = cacheCategoria;
