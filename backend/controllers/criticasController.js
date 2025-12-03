const db = require('../database/db');
const util = require('util');

const query = util.promisify(db.query).bind(db);

function validarUrlPossivel(url) {
  if (!url) return true;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

async function recalcularMediaEAtualizarLivro(id_livro) {
  const rows = await query('SELECT COUNT(*) AS qtd, AVG(nota) AS media FROM criticas WHERE id_livro = ?', [id_livro]);
  const qtd = rows[0].qtd || 0;
  const media = rows[0].media === null ? null : Number(parseFloat(rows[0].media).toFixed(1));

  await query('UPDATE livros SET media_avaliacao = ?, qtd_avaliacoes = ? WHERE id_livro = ?', [media, qtd, id_livro]);
  return { media, qtd };
}

module.exports = {
  async criarCritica(req, res) {
    try {
      const usuario = req.user;
      if (!usuario) return res.status(401).json({ erro: "Usuário não autenticado." });
      if (usuario.cargo !== "critico") return res.status(403).json({ erro: "Apenas críticos podem criar críticas." });

      const { id_livro, texto, nota, link_resenha } = req.body;

      if (!id_livro || !texto || nota === undefined) {
        return res.status(400).json({ erro: "Campos obrigatórios: id_livro, texto, nota." });
      }

      if (texto.length > 100) return res.status(400).json({ erro: "Texto deve ter no máximo 100 caracteres." });

      const notaNum = Number(nota);
      if (notaNum < 0 || notaNum > 100) return res.status(400).json({ erro: "Nota deve ser entre 0 e 100." });

      if (!validarUrlPossivel(link_resenha)) {
        return res.status(400).json({ erro: "Link inválido." });
      }

      const existe = await query(
        'SELECT id_critica FROM criticas WHERE id_usuario = ? AND id_livro = ?',
        [usuario.id, id_livro]
      );

      if (existe.length > 0) {
        return res.status(409).json({ erro: "Você já possui uma crítica para este livro." });
      }

      const result = await query(
        'INSERT INTO criticas (id_usuario, id_livro, texto, nota, link_resenha) VALUES (?, ?, ?, ?, ?)',
        [usuario.id, id_livro, texto, notaNum, link_resenha || null]
      );

      const stats = await recalcularMediaEAtualizarLivro(id_livro);

      return res.status(201).json({
        mensagem: "Crítica criada.",
        id_critica: result.insertId,
        media_atual: stats.media,
        qtd_avaliacoes: stats.qtd
      });

    } catch (err) {
      return res.status(500).json({ erro: "Erro interno." });
    }
  },

  async atualizarCritica(req, res) {
    try {
      const usuario = req.user;
      if (!usuario) return res.status(401).json({ erro: "Usuário não autenticado." });

      const id_critica = Number(req.params.id);
      if (!id_critica) return res.status(400).json({ erro: "ID inválido." });

      const rows = await query('SELECT id_usuario, id_livro FROM criticas WHERE id_critica = ?', [id_critica]);
      if (rows.length === 0) return res.status(404).json({ erro: "Crítica não encontrada." });

      const critica = rows[0];

      if (usuario.id !== critica.id_usuario && usuario.cargo !== "admin") {
        return res.status(403).json({ erro: "Sem permissão." });
      }

      const { texto, nota, link_resenha } = req.body;

      const updates = [];
      const params = [];

      if (texto !== undefined) {
        if (texto.length > 100) return res.status(400).json({ erro: "Texto deve ter até 100 caracteres." });
        updates.push("texto = ?");
        params.push(texto);
      }

      if (nota !== undefined) {
        const notaNum = Number(nota);
        if (notaNum < 0 || notaNum > 100) return res.status(400).json({ erro: "Nota deve ser entre 0 e 100." });
        updates.push("nota = ?");
        params.push(notaNum);
      }

      if (link_resenha !== undefined) {
        if (!validarUrlPossivel(link_resenha)) return res.status(400).json({ erro: "Link inválido." });
        updates.push("link_resenha = ?");
        params.push(link_resenha || null);
      }

      if (updates.length === 0) {
        return res.status(400).json({ erro: "Nada para atualizar." });
      }

      params.push(id_critica);

      await query(`UPDATE criticas SET ${updates.join(', ')} WHERE id_critica = ?`, params);

      const stats = await recalcularMediaEAtualizarLivro(critica.id_livro);

      return res.status(200).json({
        mensagem: "Crítica atualizada.",
        media_atual: stats.media,
        qtd_avaliacoes: stats.qtd
      });

    } catch {
      return res.status(500).json({ erro: "Erro interno." });
    }
  },

  async deletarCritica(req, res) {
    try {
      const usuario = req.user;
      if (!usuario) return res.status(401).json({ erro: "Usuário não autenticado." });

      const id_critica = Number(req.params.id);

      const rows = await query('SELECT id_usuario, id_livro FROM criticas WHERE id_critica = ?', [id_critica]);
      if (rows.length === 0) return res.status(404).json({ erro: "Crítica não encontrada." });

      const critica = rows[0];

      if (usuario.id !== critica.id_usuario && usuario.cargo !== "admin") {
        return res.status(403).json({ erro: "Sem permissão." });
      }

      await query('DELETE FROM criticas WHERE id_critica = ?', [id_critica]);

      const stats = await recalcularMediaEAtualizarLivro(critica.id_livro);

      return res.status(200).json({
        mensagem: "Crítica removida.",
        media_atual: stats.media,
        qtd_avaliacoes: stats.qtd
      });

    } catch {
      return res.status(500).json({ erro: "Erro interno." });
    }
  },

  async obterCriticasPorLivro(req, res) {
    try {
      const id_livro = Number(req.params.id_livro);

      const rows = await query(
        `SELECT c.id_critica, c.id_usuario, u.nome AS nome_usuario, c.texto, c.nota, c.link_resenha, c.data_critica
         FROM criticas c
         JOIN usuarios u ON c.id_usuario = u.id
         WHERE c.id_livro = ?
         ORDER BY c.data_critica DESC`,
        [id_livro]
      );

      const stats = await query('SELECT COUNT(*) AS qtd, AVG(nota) AS media FROM criticas WHERE id_livro = ?', [id_livro]);

      return res.status(200).json({
        criticas: rows,
        media: stats[0].media === null ? null : Number(stats[0].media).toFixed(1),
        qtd: stats[0].qtd
      });

    } catch {
      return res.status(500).json({ erro: "Erro interno." });
    }
  }
};
